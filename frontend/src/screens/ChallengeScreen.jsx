import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ChallengeCaptureScreen from './challenge/ChallengeCaptureScreen';
import ChallengeComparingScreen from './challenge/ChallengeComparingScreen';
import ChallengeResultScreen from './challenge/ChallengeResultScreen';
import { getChallengeObjectsWithImages, pickRandomObject } from '../storage/objectStorage';
import { compareImages } from '../utils/vision';

const normalizeSelectedObject = (object) => {
  if (!object?.imageUri) return null;

  return {
    id: object.id,
    objectName: object.objectName || object.name || 'Saved object',
    imageUri: object.imageUri,
  };
};

export default function ChallengeScreen({ route }) {
  const [targetObject, setTargetObject] = React.useState(null);
  const [candidate, setCandidate] = React.useState(null);
  const [stage, setStage] = React.useState('capture');
  const [matched, setMatched] = React.useState(false);
  const [loadingTarget, setLoadingTarget] = React.useState(true);

  const target = targetObject?.imageUri || null;
  const targetName = targetObject?.objectName || 'Saved object';

  const loadTarget = React.useCallback(async ({ preferSelected = false } = {}) => {
    setLoadingTarget(true);
    try {
      const selectedObject = normalizeSelectedObject(route?.params?.selectedObject);

      if (preferSelected && selectedObject) {
        setTargetObject(selectedObject);
        return;
      }

      const objects = await getChallengeObjectsWithImages();
      setTargetObject(pickRandomObject(objects));
    } catch (e) {
      console.warn('Failed to load challenge target object:', e);
      setTargetObject(null);
    } finally {
      setLoadingTarget(false);
    }
  }, [route?.params?.selectedObject]);

  React.useEffect(() => {
    loadTarget({ preferSelected: true });
  }, [loadTarget, route?.params?.selectedAt]);

  const handleCaptured = React.useCallback(async (photoUri) => {
    console.log('Challenge photo captured:', photoUri);
    setCandidate(photoUri);
    setStage('comparing');

    try {
      if (!target) throw new Error('No saved object photo selected');
      const result = await compareImages(target, photoUri);
      console.log('Challenge comparison result:', result);
      setMatched(result.match);
    } catch (e) {
      console.warn('Challenge comparison failed:', e);
      setMatched(false);
    } finally {
      setStage('result');
    }
  }, [target]);

  const handleTryAgain = React.useCallback(() => {
    setCandidate(null);
    setStage('capture');
  }, []);

  const handleClose = React.useCallback(() => {
    setCandidate(null);
    setStage('capture');
    loadTarget();
  }, [loadTarget]);

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
        onEmergencyExit={handleClose}
      />
    );
  }

  return (
    <ChallengeCaptureScreen
      target={target}
      targetName={targetName}
      onCaptured={handleCaptured}
      onChangeTarget={() => loadTarget()}
    />
  );
}
