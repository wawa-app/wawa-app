import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { challengeTw as tw } from './challengeNativewind';

interface ChallengeStartScreenProps {
  target: string | null;
  onStartCapture: () => void;
  onChangeTarget: () => void | Promise<void>;
}

export default function ChallengeStartScreen({
  target,
  onStartCapture,
  onChangeTarget,
}: ChallengeStartScreenProps) {
  return (
    <ScrollView className={tw.screen} contentContainerClassName={tw.challengeStartContent}>
      <Text className={tw.challengeStartTitle}>Find this item</Text>

      <View className={tw.challengeStartTarget}>
        {target ? (
          <Image source={{ uri: target }} className={tw.targetImage} resizeMode="cover" />
        ) : (
          <View className={tw.targetPlaceholder}>
            <Ionicons name="image" size={34} color="#111" />
          </View>
        )}
      </View>

      <Text className={tw.challengeStartHelp}>
        Point your camera at the same item and tap the shutter to compare.
      </Text>

      <TouchableOpacity className={tw.primaryButton} onPress={onStartCapture} activeOpacity={0.85}>
        <Ionicons name="camera" size={20} color="#fff" />
        <Text className={tw.primaryButtonText}>Take Match Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity className={tw.secondaryButton} onPress={onChangeTarget} activeOpacity={0.85}>
        <Ionicons name="shuffle" size={20} color="#000" />
        <Text className={tw.secondaryButtonText}>Pick Different Target</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
