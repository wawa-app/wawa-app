import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StreakCard from '../../components/tracking/StreakCard';
import { challengeTw as tw } from './challengeNativewind';

export default function ChallengeResultScreen({
  matched,
  targetName = 'saved object',
  onClose,
  onTryAgain,
  onEmergencyExit,
}) {
  if (matched) {
    return (
      <ScrollView className={tw.screen} contentContainerClassName={tw.resultContent}>
        <View className={tw.shortBlackStatus} />

        <View className={tw.shareWrap}>
          <TouchableOpacity className={tw.shareButton} activeOpacity={0.75}>
            <Ionicons name="share-social" size={20} color="#000" />
            <Text className={tw.shareText}>Share</Text>
          </TouchableOpacity>
        </View>

        <View className={tw.resultCenter}>
          <View className={tw.uniCircle}>
            <View className={tw.uniFace}>
              <Ionicons name="happy" size={52} color="#fff" />
            </View>
          </View>

          <Text className={tw.levelText}>Elementary Uni (Level: 15)</Text>

          <View className={tw.xpCard}>
            <View className={tw.xpHeader}>
              <Text className={tw.xpLabel}>XP</Text>
              <Text className={tw.xpValue}>84/100</Text>
            </View>
            <View className={tw.xpTrack}>
              <View className={tw.xpFill} />
            </View>
          </View>

          <Text className={tw.successTitle}>MISSION{'\n'}ACCOMPLISHED</Text>
          <Text className={tw.resultCopy}>
            Congratulations! You’ve successfully{'\n'}
            scanned the {targetName} and started{'\n'}
            your day on time.
          </Text>

          <View className="mt-8">
            <StreakCard variant="success" />
          </View>

          <TouchableOpacity className={tw.resultButton} onPress={onClose} activeOpacity={0.85}>
            <Text className={tw.resultButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className={tw.screen} contentContainerClassName={tw.resultContent}>
      <View className={tw.shortBlackStatus} />

      <View className={tw.wrongResultCenter}>
        <View className={tw.uniCircle}>
          <View className={tw.sadFaceWrap}>
            <View className={tw.uniFace}>
              <Ionicons name="sad" size={52} color="#fff" />
            </View>
            <Text className={tw.sadLabel}>Sad Uni</Text>
          </View>
        </View>

        <Text className={tw.wrongTitle}>WRONG OBJECT?</Text>
        <Text className={tw.wrongCopy}>
          Don&apos;t give up! You can do it.{'\n'}
          Take a deep breath and aim again.{'\n'}
          You can try again within 3 times to{'\n'}
          keep the streak!
        </Text>

        <View className="mt-8">
          <StreakCard variant="lose" />
        </View>

        <TouchableOpacity className={tw.resultButton} onPress={onTryAgain} activeOpacity={0.85}>
          <Text className={tw.resultButtonText}>Try again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={tw.emergencyButton}
          onPress={onEmergencyExit}
          activeOpacity={0.85}
        >
          <Text className={tw.emergencyText}>Emergency exit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
