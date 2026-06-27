import React, { useEffect, useState, useCallback, useRef } from 'react';
import { NativeModules } from 'react-native';
import AlarmRingingScreen from './AlarmRingingScreen';
import ChallengeCaptureScreen from '../challenge/ChallengeCaptureScreen';
import ChallengeComparingScreen from '../challenge/ChallengeComparingScreen';
import ChallengeResultScreen from '../challenge/ChallengeResultScreen';
import { getStoredObjectsWithImages, pickRandomObject } from '../../storage/objectStorage';
import { compareImages } from '../../utils/vision';
import apiClient from '../../api/client';

const { AlarmModule } = NativeModules;

const PHASE = { RINGING: 'ringing', CAPTURING: 'capturing', COMPARING: 'comparing', RESULT: 'result' }
const MAX_ATTEMPTS = 3

export default function AlarmFlow({ alarmId }) {
    const [phase, setPhase] = useState(PHASE.RINGING)
    const [targetObject, setTargetObject] = useState(null)
    const [candidate, setCandidate] = useState(null)
    const [matched, setMatched] = useState(false)
    const [completionStats, setCompletionStats] = useState(null)
    const [failedCount, setFailedCount] = useState(0)
    const missionStartRef = useRef(null)

    const target = targetObject?.imageUri || null;
    const targetName = targetObject?.objectName || 'Saved object';
    const resolvedAlarmId = alarmId && alarmId !== '' ? alarmId : null;

    const loadTarget = useCallback(async () => {
        try {
            const objects = await getStoredObjectsWithImages()
            setTargetObject(pickRandomObject(objects))
        } catch (e) {
            console.warn('Failed to load alarm challenge target:', e)
            setTargetObject(null)
        }
    }, []);

    useEffect(() => { loadTarget(); }, [loadTarget])

    const handleStartMission = useCallback(() => {
        // Keep the alarm ringing — only success stops it.
        setCompletionStats(null)
        setFailedCount(0)
        missionStartRef.current = Date.now()
        setPhase(PHASE.CAPTURING)
    }, []);

    // Records the attempt (success or failed) to /verify with the alarm _id.
    const recordAttempt = useCallback(async (isSuccess) => {
        const timeToComplete = missionStartRef.current
            ? Math.round((Date.now() - missionStartRef.current) / 1000)
            : null;
        try {
            const response = await apiClient.post('/api/mission/verify', {
                alarmId: resolvedAlarmId,
                objectId: targetObject?.id,
                isSuccess,
                timeToComplete,
            });
            return response.data
        } catch (err) {
            console.warn('verify POST failed:', err?.response?.status, err?.response?.data || err?.message)
            return null
        }
    }, [resolvedAlarmId, targetObject?.id])

    const handleCaptured = useCallback(async (photoUri) => {
        setCandidate(photoUri)
        setPhase(PHASE.COMPARING)

        let isMatch = false
        try {
            console.log('target =', target)
            console.log('candidate =', photoUri)
            if (!target) throw new Error('No saved object photo selected')
            const result = await compareImages(target, photoUri)
            console.log('result =', result)
            isMatch = result.match
        } catch (e) {
            console.warn('comparison failed:', e?.message, e?.response?.status, e?.response?.data)
            isMatch = false
        }

        if (isMatch) {
            AlarmModule.stopRingtone()
            const data = await recordAttempt(true)
            setCompletionStats(data?.stats ?? null)
            setMatched(true)
            setPhase(PHASE.RESULT)
            return
        }

        // Failure: record failed attempt, increment the counter.
        await recordAttempt(false)
        setFailedCount((prev) => prev + 1)
        setMatched(false)
        setPhase(PHASE.RESULT)
    }, [target, recordAttempt, targetObject?.id])

    const handleChangeTarget = useCallback(async () => { await loadTarget(); }, [loadTarget])

    const handleClose = useCallback(() => {
        AlarmModule.dismissAndReturn();
    }, []);

    const handleTryAgain = useCallback(() => {
        // Out of attempts → force dismiss.
        if (failedCount >= MAX_ATTEMPTS) {
            AlarmModule.dismissAndReturn()
            return;
        }
        // Still ringing, try again.
        setCandidate(null)
        setMatched(false)
        setPhase(PHASE.CAPTURING)
    }, [failedCount])

    const handleEmergencyExit = useCallback(() => {
        AlarmModule.dismissAndReturn()
    }, [])

    switch (phase) {
        case PHASE.CAPTURING:
            return <ChallengeCaptureScreen target={target} targetName={targetName} onCaptured={handleCaptured} onChangeTarget={handleChangeTarget} />;
        case PHASE.COMPARING:
            return <ChallengeComparingScreen target={target} targetName={targetName} candidate={candidate} />;
        case PHASE.RESULT:
            return <ChallengeResultScreen matched={matched} targetName={targetName} onClose={handleClose} onTryAgain={handleTryAgain} onEmergencyExit={handleEmergencyExit} completionStats={completionStats} />;
        case PHASE.RINGING:
        default:
            return <AlarmRingingScreen onStartMission={handleStartMission} />;
    }
}