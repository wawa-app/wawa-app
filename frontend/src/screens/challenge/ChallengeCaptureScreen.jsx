import React, { useRef, useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from 'react-native-vision-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { challengeTw as tw, cameraFrameStyle, captureControlsStyle } from './challengeNativewind';

const CHANGE_TARGET_LIMIT = 3;

export default function ChallengeCaptureScreen({
  target,
  targetName = 'Saved object',
  onCaptured,
  onChangeTarget,
}) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [facing] = useState('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isChangingTarget, setIsChangingTarget] = useState(false);
  const [changeTargetCount, setChangeTargetCount] = useState(0);
  const cameraRef = useRef(null);
  const device = useCameraDevice(facing);
  const photoOutput = usePhotoOutput({ quality: 0.85 });
  const hasReachedChangeLimit = changeTargetCount >= CHANGE_TARGET_LIMIT;
  const changeTargetLabel = hasReachedChangeLimit
    ? 'Change limit reached'
    : isChangingTarget
      ? 'Changing...'
      : 'Change object';

  const handleCapture = async () => {
    if (!device || isCapturing) return;
    setIsCapturing(true);
    try {
      if (Platform.OS === 'android') {
        const snapshot = await cameraRef.current?.takeSnapshot();
        if (!snapshot) throw new Error('Camera snapshot is not ready');
        const filePath = await snapshot.saveToTemporaryFileAsync('jpg', 85);
        await onCaptured(`file://${filePath}`);
        return;
      }

      const photo = await photoOutput.capturePhotoToFile(
        { flashMode: 'off', enableShutterSound: false },
        {}
      );
      if (!photo?.filePath) throw new Error('No photo file path returned');
      await onCaptured(`file://${photo.filePath}`);
    } catch (e) {
      console.warn('Challenge capture failed:', e);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleChangeTarget = async () => {
    if (isChangingTarget || hasReachedChangeLimit) return;
    setIsChangingTarget(true);
    try {
      await onChangeTarget();
      setChangeTargetCount((count) => Math.min(count + 1, CHANGE_TARGET_LIMIT));
    } finally {
      setIsChangingTarget(false);
    }
  };

  if (!hasPermission) {
    return (
      <View className={tw.permissionScreen}>
        <Text className={tw.permissionIcon}>📷</Text>
        <Text className={tw.permissionTitle}>Camera Permission Needed</Text>
        <Text className={tw.permissionText}>
          WaWa needs camera access to take the match photo.
        </Text>
        <TouchableOpacity
          className={tw.permissionButton}
          onPress={requestPermission}
          activeOpacity={0.8}
        >
          <Text className={tw.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className={tw.screen}>
      <View className={tw.blackStatus} />
      <View className={tw.whiteTopSpacer} />

      <View className={tw.topTargetBar}>
        <View className={tw.targetThumb}>
          {target ? (
            <Image source={{ uri: target }} className={tw.targetImage} resizeMode="cover" />
          ) : (
            <View className={tw.targetPlaceholder}>
              <Ionicons name="image" size={28} color="#3D2A1C" />
            </View>
          )}
        </View>

        <View className={tw.targetTextWrap}>
          <Text className={tw.targetLabel}>Targeting</Text>
          <Text className={tw.targetNameWithButton}>{targetName}</Text>
          <TouchableOpacity
            className={`${tw.changeObjectButton} ${hasReachedChangeLimit ? 'opacity-50' : ''}`}
            onPress={handleChangeTarget}
            disabled={isChangingTarget || hasReachedChangeLimit}
            activeOpacity={0.8}
          >
            <Text className={tw.changeObjectText} numberOfLines={1} adjustsFontSizeToFit>
              {changeTargetLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className={tw.captureBody}>
        <View className={tw.cameraFrame} style={cameraFrameStyle}>
          <View style={[styles.cameraPreviewClip, device && styles.activeCameraFrame]}>
            {device ? (
              <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive
                outputs={[photoOutput]}
                resizeMode="cover"
                implementationMode={Platform.OS === 'android' ? 'compatible' : undefined}
              />
            ) : (
              <View className={tw.comparingFallback}>
                <Ionicons name="camera" size={34} color="#3D2A1C" />
              </View>
            )}
          </View>
        </View>

        <View className={tw.captureControls} style={captureControlsStyle}>
          <TouchableOpacity
            className={tw.shutterButton}
            onPress={handleCapture}
            disabled={isCapturing}
            activeOpacity={0.75}
          >
            <View className={tw.shutterInner} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraPreviewClip: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 18,
  },
  activeCameraFrame: {
    backgroundColor: '#000000',
  },
});
