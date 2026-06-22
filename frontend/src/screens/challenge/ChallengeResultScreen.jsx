import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StreakCard from '../../components/tracking/StreakCard';
import apiClient from '../../api/client';
import { challengeTw as tw } from './challengeNativewind';

const DEFAULT_UNI = {
  stage: 'Baby Uni',
  level: 1,
  exp: 0,
};

export default function ChallengeResultScreen({
  matched,
  targetName = 'saved object',
  onClose,
  onTryAgain,
  onEmergencyExit,
  completionStats,
}) {
  const [uni, setUni] = React.useState(DEFAULT_UNI);

  React.useEffect(() => {
    if (!matched) return;

    let isMounted = true;

    const applyUniStats = (nextUni) => {
      if (!isMounted || !nextUni) return;
      setUni({
        stage: nextUni.stage ?? DEFAULT_UNI.stage,
        level: nextUni.level ?? DEFAULT_UNI.level,
        exp: nextUni.exp ?? DEFAULT_UNI.exp,
      });
    };

    // A newly completed mission has already returned its updated stats.
    if (completionStats?.uni) {
      applyUniStats(completionStats.uni);
      return () => {
        isMounted = false;
      };
    }

    const fetchUniStats = async () => {
      try {
        const response = await apiClient.get('/api/users/stats');
        applyUniStats(response.data?.stats?.uni);
      } catch (error) {
        console.warn(
          '[ChallengeResultScreen] fetchUniStats error:',
          error?.response?.status,
          error?.response?.data || error?.message
        );
      }
    };

    fetchUniStats();

    return () => {
      isMounted = false;
    };
  }, [matched, completionStats]);

  const currentXp = Math.min(uni.exp % 100, 100);
  const xpProgress = `${currentXp}%`;

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

          <Text className={tw.levelText}>{uni.stage} (Level: {uni.level})</Text>

          <View className={tw.xpCard}>
            <View className={tw.xpHeader}>
              <Text className={tw.xpLabel}>XP</Text>
              <Text className={tw.xpValue}>{currentXp}/100</Text>
            </View>
            <View className={tw.xpTrack}>
              <View className={tw.xpFill} style={{ width: xpProgress }} />
            </View>
          </View>

          <Text className={tw.successTitle}>MISSION{'\n'}ACCOMPLISHED</Text>
          <Text className={tw.resultCopy}>
            Congratulations! You’ve successfully{'\n'}
            scanned the {targetName} and started{'\n'}
            your day on time.
          </Text>

          <View className="mt-8">
            <StreakCard
              variant="success"
              streakCount={completionStats?.streak?.currentCount}
            />
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
