import React, { useEffect, useState, useCallback } from 'react';
import { NativeModules } from 'react-native';
import AlarmRingingScreen from './AlarmRingingScreen';
import ChallengeCaptureScreen from './challenge/ChallengeCaptureScreen';
import ChallengeComparingScreen from './challenge/ChallengeComparingScreen';
import ChallengeResultScreen from './challenge/ChallengeResultScreen';
import { listPhotos, pickRandom } from '../utils/photos';

async function compare(targetUri, candidateUri) {
    await new Promise((r) => setTimeout(r, 1200)); //tentative
    return { matched: Math.random() > 0.5 };
};

const { AlarmModule } = NativeModules;

// const handleClose = useCallback(() => {
//     AlarmModule.stopAlarm(); //tentative
// }, []);

//tentative
const PHASE = {
    RINGING: 'ringing',
    CAPTURING: 'capturing',
    COMPARING: 'comparing',
    RESULT: 'result',
};

export default function AlarmFlow() {
    const [phase, setPhase] = useState(PHASE.RINGING);
    const [target, setTarget] = useState(null);
    const [candidate, setCandidate] = useState(null);
    const [matched, setMatched] = useState(false);

    // Pick the object the user must scan, once on mount.
    useEffect(() => {
        (async () => {
            const photos = await listPhotos();
            setTarget(pickRandom(photos));
        })();
    }, []);

    const handleStartMission = useCallback(() => {
        // Do NOT stop the alarm here — it must keep ringing until success.
        setPhase(PHASE.CAPTURING);
    }, []);

    const handleCaptured = useCallback(
        async (candidateUri) => {
            setCandidate(candidateUri);
            setPhase(PHASE.COMPARING);
            const { matched: isMatch } = await compare(target, candidateUri);
            setMatched(isMatch);
            setPhase(PHASE.RESULT);
            // STEP 2 (native): if (isMatch) AlarmModule.stopRingtone();
        },
        [target]
    );

    const handleChangeTarget = useCallback(async () => {
        const photos = await listPhotos();
        setTarget(pickRandom(photos));
    }, []);

    const handleClose = useCallback(() => {
        // Success path. STEP 2 (native): AlarmModule.dismissAndReturn();
        console.log('[AlarmFlow] mission complete → return to app');
    }, []);

    const handleTryAgain = useCallback(() => {
        setCandidate(null);
        setMatched(false);
        setPhase(PHASE.CAPTURING); // alarm still ringing
    }, []);

    const handleEmergencyExit = useCallback(() => {
        // DESIGN DECISION: whether/how the user may bail out of the mission.
        console.log('[AlarmFlow] emergency exit pressed');
    }, []);

    switch (phase) {
        case PHASE.CAPTURING:
            return (
                <ChallengeCaptureScreen
                    target={target}
                    onCaptured={handleCaptured}
                    onChangeTarget={handleChangeTarget}
                />
            );

        case PHASE.COMPARING:
            return <ChallengeComparingScreen target={target} candidate={candidate} />;

        case PHASE.RESULT:
            return (
                <ChallengeResultScreen
                    matched={matched}
                    onClose={handleClose}
                    onTryAgain={handleTryAgain}
                    onEmergencyExit={handleEmergencyExit}
                />
            );

        case PHASE.RINGING:
        default:
            return <AlarmRingingScreen onStartMission={handleStartMission} />;
    }
}