import React, { useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { challengeTw as tw } from './challengeNativewind';

interface ChallengeCaptureScreenProps {
  target: string | null;
  onCaptured: (tempUri: string) => void | Promise<void>;
  onChangeTarget: () => void | Promise<void>;
  onClose: () => void;
}

export default function ChallengeCaptureScreen({
  target,
  onCaptured,
  onChangeTarget,
  onClose,
}: ChallengeCaptureScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isChangingTarget, setIsChangingTarget] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });
      if (!photo?.uri) throw new Error('No photo URI returned');
      await onCaptured(photo.uri);
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

  if (!permission) {
    return <View className={tw.screen} />;
  }

  if (!permission.granted) {
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
          <Text className={tw.targetNameWithButton}>Library Item</Text>
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
        <View className={tw.cameraFrame}>
          <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} />
        </View>

        <View className={tw.captureControls}>
          <TouchableOpacity className={tw.roundIconButton} onPress={onClose} activeOpacity={0.8}>
            <Ionicons name="close" size={24} color="#111" />
          </TouchableOpacity>

          <TouchableOpacity
            className={tw.shutterButton}
            onPress={handleCapture}
            disabled={isCapturing}
            activeOpacity={0.75}
          >
            <View className={tw.shutterInner} />
          </TouchableOpacity>

          <TouchableOpacity
            className={tw.roundIconButton}
            onPress={() => setFacing((current) => (current === 'back' ? 'front' : 'back'))}
            activeOpacity={0.8}
          >
            <Ionicons name="camera-reverse" size={24} color="#111" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
