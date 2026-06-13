import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from 'react-native-vision-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { challengeTw as tw, cameraFrameStyle, captureControlsStyle } from './challengeNativewind';

export default function ChallengeCaptureScreen({
  target,
  onCaptured,
  onChangeTarget,
}) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [facing] = useState('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isChangingTarget, setIsChangingTarget] = useState(false);
  const device = useCameraDevice(facing);
  const photoOutput = usePhotoOutput({ quality: 0.85 });

  const handleCapture = async () => {
    if (!device || isCapturing) return;
    setIsCapturing(true);
    try {
      const photo = await photoOutput.capturePhotoToFile(
        { flashMode: 'off', enableShutterSound: true },
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
    if (isChangingTarget) return;
    setIsChangingTarget(true);
    try {
      await onChangeTarget();
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
              <Ionicons name="image" size={28} color="#111" />
            </View>
          )}
        </View>

        <View className={tw.targetTextWrap}>
          <Text className={tw.targetLabel}>Targeting</Text>
          <Text className={tw.targetNameWithButton}>Coffee Mug</Text>
          <TouchableOpacity
            className={tw.changeObjectButton}
            onPress={handleChangeTarget}
            disabled={isChangingTarget}
            activeOpacity={0.8}
          >
            <Text className={tw.changeObjectText}>
              {isChangingTarget ? 'Changing...' : 'Change object'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className={tw.captureBody}>
        <View className={tw.cameraFrame} style={cameraFrameStyle}>
          {device ? (
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive
              outputs={[photoOutput]}
              resizeMode="cover"
            />
          ) : (
            <View className={tw.comparingFallback}>
              <Ionicons name="camera" size={34} color="#111" />
            </View>
          )}
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
