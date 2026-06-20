import React, { useEffect, useState, useCallback } from 'react';
import { NativeModules } from 'react-native';
import AlarmRingingScreen from './AlarmRingingScreen';
import ChallengeCaptureScreen from './challenge/ChallengeCaptureScreen';
import ChallengeComparingScreen from './challenge/ChallengeComparingScreen';
import ChallengeResultScreen from './challenge/ChallengeResultScreen';
import { getStoredObjectsWithImages, pickRandomObject } from '../storage/objectStorage';
import { compareImages } from '../utils/vision';
import apiClient from '../api/client';

const { AlarmModule } = NativeModules;

const PHASE = { RINGING: 'ringing', CAPTURING: 'capturing', COMPARING: 'comparing', RESULT: 'result' };

export default function AlarmFlow() {
    const [phase, setPhase] = useState(PHASE.RINGING);
    const [targetObject, setTargetObject] = useState(null);
    const [candidate, setCandidate] = useState(null);
    const [matched, setMatched] = useState(false);
    const [completionStats, setCompletionStats] = useState(null);

    const target = targetObject?.imageUri || null;
    const targetName = targetObject?.objectName || 'Saved object';

    const loadTarget = useCallback(async () => {
        try {
            const objects = await getStoredObjectsWithImages();
            setTargetObject(pickRandomObject(objects));
        } catch (e) {
            console.warn('Failed to load alarm challenge target:', e);
            setTargetObject(null);
        }
    }, []);

    useEffect(() => { loadTarget(); }, [loadTarget]);

    const handleStartMission = useCallback(() => {
        // Keep the alarm ringing — only success stops it.
        setCompletionStats(null);
        setPhase(PHASE.CAPTURING);
    }, []);

    const handleCaptured = useCallback(async (photoUri) => {
        setCandidate(photoUri);
        setPhase(PHASE.COMPARING);

        let isMatch = false;
        try {
            console.log('🔍 target =', target);
            console.log('🔍 candidate =', photoUri);
            if (!target) throw new Error('No saved object photo selected');
            const result = await compareImages(target, photoUri);
            console.log('🔍 result =', result);
            isMatch = result.match;
            if (isMatch) {
                AlarmModule.stopRingtone();
                try {
                    const response = await apiClient.post('/api/mission/challenge-success', { objectId: targetObject?.id });
                    setCompletionStats(response.data?.stats ?? null);
                } catch (rewardError) {
                    console.warn('success POST failed:', rewardError?.message);
                }
            }
        } catch (e) {
            console.warn('🔍 comparison failed:', e?.message, e?.response?.status, e?.response?.data);
            isMatch = false;
        } finally {
            setMatched(isMatch);
            setPhase(PHASE.RESULT);
        }
    }, [target, targetObject?.id]);

    const handleChangeTarget = useCallback(async () => { await loadTarget(); }, [loadTarget]);

    const handleClose = useCallback(() => {
        // success path → leave alarm screen, go to app
        AlarmModule.dismissAndReturn();
    }, []);

    const handleTryAgain = useCallback(() => {
        // Failure path: alarm is STILL ringing.
        setCandidate(null);
        setMatched(false);
        setPhase(PHASE.CAPTURING);
    }, []);

    const handleEmergencyExit = useCallback(() => {
        AlarmModule.dismissAndReturn();
    }, []);

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
