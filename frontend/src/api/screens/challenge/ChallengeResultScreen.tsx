import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { challengeTw as tw } from './challengeNativewind';

interface ChallengeResultScreenProps {
  matched: boolean;
  onClose: () => void | Promise<void>;
  onTryAgain: () => void;
  onEmergencyExit: () => void | Promise<void>;
}

export default function ChallengeResultScreen({
  matched,
  onClose,
  onTryAgain,
  onEmergencyExit,
}: ChallengeResultScreenProps) {
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
            scanned the coffee mug and started{'\n'}
            your day on time.
          </Text>

          <StreakCard tone="success" />

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

        <StreakCard tone="danger" />

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

interface StreakCardProps {
  tone: 'success' | 'danger';
}

function StreakCard({ tone }: StreakCardProps) {
  const isSuccess = tone === 'success';
  const days = isSuccess
    ? ['checkmark', 'checkmark', 'checkmark', 'checkmark', 'checkmark', null, null]
    : ['checkmark', 'checkmark', 'checkmark', 'checkmark', 'close', null, null];

  return (
    <View className={tw.streakCard}>
      <View className={tw.streakHeader}>
        <Ionicons name={isSuccess ? 'flame' : 'flame-outline'} size={30} color="#fff" />
        <Text className={tw.streakCount}>5</Text>
      </View>
      <Text className={tw.streakLabel}>
        {isSuccess ? 'Day streak count!' : 'Day streak lose!'}
      </Text>
      <View className={tw.streakDays}>
        {days.map((icon, index) => (
          <View key={index} className={icon ? tw.streakDayDone : tw.streakDayEmpty}>
            {icon ? <Ionicons name={icon as any} size={14} color="#000" /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}
