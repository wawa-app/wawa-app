import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';
import ChallengeCaptureScreen from './challenge/ChallengeCaptureScreen';
import ChallengeComparingScreen from './challenge/ChallengeComparingScreen';
import ChallengeResultScreen from './challenge/ChallengeResultScreen';
import { getStoredObjectsWithImages, pickRandomObject } from '../storage/objectStorage';
import { compareImages } from '../utils/vision';
import apiClient from '../api/client';

const MAX_ATTEMPTS = 3;

export default function ChallengeScreen() {
  const [targetObject, setTargetObject] = React.useState(null);
  const [candidate, setCandidate] = React.useState(null);
  const [stage, setStage] = React.useState('capture');
  const [matched, setMatched] = React.useState(false);
  const [loadingTarget, setLoadingTarget] = React.useState(true);
  const [completionStats, setCompletionStats] = React.useState(null);
  const [failedCount, setFailedCount] = React.useState(0);

  const target = targetObject?.imageUri || null;
  const targetName = targetObject?.objectName || 'Saved object';

  const loadTarget = React.useCallback(async () => {
    setLoadingTarget(true);
    try {
      const objects = await getStoredObjectsWithImages();
      setTargetObject(pickRandomObject(objects));
    } catch (e) {
      console.warn('Failed to load challenge target object:', e);
      setTargetObject(null);
    } finally {
      setLoadingTarget(false);
    }
  }, []);

  useFocusEffect(React.useCallback(() => {
    loadTarget();
  }, [loadTarget]));

  const fetchUserStats = React.useCallback(async () => {
    try {
      const response = await apiClient.get('/api/users/stats');
      return response.data?.stats ?? null;
    } catch (error) {
      console.warn(
        'Failed to fetch user stats:',
        error?.response?.status,
        error?.response?.data || error?.message
      );
      return null;
    }
  }, []);

  const handleCaptured = React.useCallback(async (photoUri) => {
    console.log('Challenge photo captured:', photoUri);
    setCandidate(photoUri);
    setStage('comparing');

    let isMatch = false;
    try {
      if (!target) throw new Error('No saved object photo selected');
      const result = await compareImages(target, photoUri);
      console.log('Challenge comparison result:', result);
      isMatch = Boolean(result.match);
    } catch (e) {
      console.warn('Challenge comparison failed:', e);
      isMatch = false;
    }

    setMatched(isMatch);

    if (isMatch) {
      try {
        const response = await apiClient.post('/api/mission/challenge-success', {
          objectId: targetObject?.id,
        });
        const stats = response.data?.stats ?? await fetchUserStats();
        setCompletionStats(
          stats
            ? { ...stats, awarded: response.data?.awarded }
            : null
        );
        setFailedCount(0);
      } catch (rewardError) {
        console.warn(
          'Challenge matched, but streak update failed:',
          rewardError?.response?.status,
          rewardError?.response?.data || rewardError?.message
        );
      }
    } else {
      const nextFailedCount = failedCount + 1;
      setFailedCount(nextFailedCount);
      try {
        const response = await apiClient.post('/api/mission/challenge-failure', {
          objectId: targetObject?.id,
          failedAttemptCount: nextFailedCount,
        });
        const stats = response.data?.stats ?? await fetchUserStats();
        setCompletionStats(stats);
      } catch (failureError) {
        console.warn(
          'Challenge failed, but streak update failed:',
          failureError?.response?.status,
          failureError?.response?.data || failureError?.message
        );
      }
    }

    setStage('result');
  }, [failedCount, fetchUserStats, target, targetObject?.id]);

  const handleTryAgain = React.useCallback(() => {
    if (failedCount >= MAX_ATTEMPTS) {
      setCandidate(null);
      setCompletionStats(null);
      setFailedCount(0);
      setStage('capture');
      loadTarget();
      return;
    }

    setCandidate(null);
    setCompletionStats(null);
    setStage('capture');
  }, [failedCount, loadTarget]);

  const handleClose = React.useCallback(() => {
    setCandidate(null);
    setCompletionStats(null);
    setFailedCount(0);
    setStage('capture');
    loadTarget();
  }, [loadTarget]);

  const handleEmergencyExit = React.useCallback(async () => {
    try {
      const response = await apiClient.patch('/api/mission/emergency', {
        objectId: targetObject?.id,
      });
      setCompletionStats(response.data?.stats ?? null);
    } catch (err) {
      console.warn(
        'Challenge emergency exit failed:',
        err?.response?.status,
        err?.response?.data || err?.message
      );
    } finally {
      handleClose();
    }
  }, [handleClose, targetObject?.id]);

  if (loadingTarget && stage === 'capture') {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-black text-[18px] font-geologica-bold text-center">
          Loading saved object...
        </Text>
      </View>
    );
  }

  if (!target && stage === 'capture') {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-black text-[22px] font-geologica-bold text-center mb-3">
          No saved object image yet
        </Text>
        <Text className="text-black text-[14px] text-center mb-6">
          Add an object with a photo in the Objects tab, then come back to run the challenge.
        </Text>
        <TouchableOpacity
          className="bg-black px-6 py-3 rounded-full"
          onPress={loadTarget}
          activeOpacity={0.85}
        >
          <Text className="text-white text-[16px] font-geologica-medium">Reload</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (stage === 'comparing') {
    return <ChallengeComparingScreen target={target} targetName={targetName} candidate={candidate} />;
  }

  if (stage === 'result') {
    return (
      <ChallengeResultScreen
        matched={matched}
        targetName={targetName}
        onClose={handleClose}
        onTryAgain={handleTryAgain}
        onEmergencyExit={handleEmergencyExit}
        completionStats={completionStats}
        failedAttemptCount={failedCount}
        maxAttempts={MAX_ATTEMPTS}
      />
    );
  }

  return (
    <ChallengeCaptureScreen
      target={target}
      targetName={targetName}
      onCaptured={handleCaptured}
      onChangeTarget={loadTarget}
    />
  );
}
