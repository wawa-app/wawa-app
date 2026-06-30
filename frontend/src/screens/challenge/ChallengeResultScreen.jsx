import React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LottieView from 'lottie-react-native';
import StreakCard from '../../components/tracking/StreakCard';
import apiClient from '../../api/client';
import { challengeTw as tw } from './challengeNativewind';

const uniHappy = require('../../assets/animations/UNIIII - Child happy.json');
const uniCry = require('../../assets/animations/UNIIII - Child cry.json');

const DEFAULT_UNI = {
  stage: 'Baby Uni',
  level: 1,
  exp: 0,
};

// Intro animation for the success "streak" step: the title + copy start centered,
// then slide up to the top while the streak card and buttons fade in.
const REVEAL_DELAY = 1200;
const REVEAL_DURATION = 600;
const HEADER_CENTER_OFFSET = Dimensions.get('window').height * 0.28;
const UNI_SIZE = 180;

function UniAnimation({ mood = 'happy' }) {
  const source = mood === 'cry' ? uniCry : uniHappy;

  return (
    <LottieView
      source={source}
      autoPlay
      loop
      style={styles.uniAnimation}
    />
  );
}

export default function ChallengeResultScreen({
  matched,
  targetName = 'saved object',
  onClose,
  onTryAgain,
  onEmergencyExit,
  completionStats,
  failedAttemptCount = 0,
  maxAttempts = 3,
}) {
  const [uni, setUni] = React.useState(DEFAULT_UNI);
  // Matched flow has two steps: 'streak' (streak card + Continue) then 'reward'
  // (Uni level + XP). Continue advances from the first step to the second.
  const [step, setStep] = React.useState('streak');
  // 0 = intro (title centered, streak/buttons hidden), 1 = revealed (title at top).
  const reveal = React.useRef(new Animated.Value(0)).current;
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    if (!matched || step !== 'streak') return undefined;

    reveal.setValue(0);
    setRevealed(false);
    const timer = setTimeout(() => {
      Animated.timing(reveal, {
        toValue: 1,
        duration: REVEAL_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => setRevealed(true));
    }, REVEAL_DELAY);

    return () => clearTimeout(timer);
  }, [matched, step, reveal]);

  const headerTranslateY = reveal.interpolate({
    inputRange: [0, 1],
    outputRange: [HEADER_CENTER_OFFSET, 0],
  });
  const bottomTranslateY = reveal.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  // Failure ("Mission failed") shares the same intro: the title + copy start
  // centered, then slide to the top while the crying Uni grows in between them
  // and the streak card + buttons fade in. Uses a non-native driver because the
  // Uni's height is animated to collapse its space during the intro.
  const failReveal = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (matched) return undefined;

    failReveal.setValue(0);
    setRevealed(false);
    const timer = setTimeout(() => {
      Animated.timing(failReveal, {
        toValue: 1,
        duration: REVEAL_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(() => setRevealed(true));
    }, REVEAL_DELAY);

    return () => clearTimeout(timer);
  }, [matched, failReveal]);

  const failHeaderTranslateY = failReveal.interpolate({
    inputRange: [0, 1],
    outputRange: [HEADER_CENTER_OFFSET, 0],
  });
  const failBottomTranslateY = failReveal.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });
  const failUniHeight = failReveal.interpolate({
    inputRange: [0, 1],
    outputRange: [0, UNI_SIZE],
  });

  const handleShare = React.useCallback(async () => {
    try {
      await Share.share({
        message: `I scanned my ${targetName} and kept my streak going! 🔥`,
      });
    } catch (error) {
      console.warn('[ChallengeResultScreen] share error:', error?.message);
    }
  }, [targetName]);

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
  const remainingAttempts = Math.max(maxAttempts - failedAttemptCount, 0);
  const isFinalFailure = failedAttemptCount >= maxAttempts;
  const failureRetryCopy = remainingAttempts > 0
    ? `You can try again within ${remainingAttempts} times to\nkeep the streak!`
    : 'Your streak has been reset to zero.';
  const serverStreakCount = completionStats?.streak?.currentCount;
  const successStreakCount = typeof serverStreakCount === 'number'
    ? serverStreakCount
    : undefined;
  const failureStreakCount = completionStats?.streak?.currentCount;

  if (matched) {
    return (
      <ScrollView className={tw.screen} contentContainerClassName={tw.resultContent}>
        <View className={tw.shortBlackStatus} />

        {step === 'streak' ? (
          <View className={tw.successStepBody}>
            <Animated.View
              style={[styles.introHeader, { transform: [{ translateY: headerTranslateY }] }]}
            >
              <Text className={tw.successTitle}>MISSION{'\n'}ACCOMPLISHED</Text>
              <Text className={tw.resultCopy}>
                Congratulations! You’ve successfully{'\n'}
                scanned the {targetName} and started{'\n'}
                your day on time.
              </Text>
            </Animated.View>

            <Animated.View
              pointerEvents={revealed ? 'auto' : 'none'}
              style={[
                styles.introBottom,
                { opacity: reveal, transform: [{ translateY: bottomTranslateY }] },
              ]}
            >
              <StreakCard
                variant="success"
                streakCount={successStreakCount}
              />

              <View className={tw.successActions}>
                <TouchableOpacity
                  className={tw.primaryActionButton}
                  onPress={() => setStep('reward')}
                  activeOpacity={0.85}
                >
                  <Text className={tw.primaryActionText}>Continue</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={tw.secondaryActionButton}
                  onPress={handleShare}
                  activeOpacity={0.85}
                >
                  <Text className={tw.secondaryActionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        ) : (
          <View className={tw.successStepBody}>
            <Text className={tw.successTitle}>MISSION{'\n'}ACCOMPLISHED</Text>

            <View className={tw.uniRewardCenter}>
              <UniAnimation mood="happy" />
              <Text className={tw.levelText}>{uni.stage} (Level: {uni.level})</Text>
            </View>

            <View className={tw.uniRewardBottom}>
              <View className={tw.xpCard}>
                <View className={tw.xpHeader}>
                  <Text className={tw.xpLabel}>XP</Text>
                  <Text className={tw.xpValue}>{currentXp}/100</Text>
                </View>
                <View className={tw.xpTrack}>
                  <View className={tw.xpFill} style={{ width: xpProgress }} />
                </View>
              </View>

              <View className={tw.successActions}>
                <TouchableOpacity
                  className={tw.primaryActionButton}
                  onPress={onClose}
                  activeOpacity={0.85}
                >
                  <Text className={tw.primaryActionText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={tw.secondaryActionButton}
                  onPress={handleShare}
                  activeOpacity={0.85}
                >
                  <Text className={tw.secondaryActionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView className={tw.screen} contentContainerClassName={tw.resultContent}>
      <View className={tw.shortBlackStatus} />

      <View className={tw.successStepBody}>
        <Animated.View
          style={[styles.introHeader, { transform: [{ translateY: failHeaderTranslateY }] }]}
        >
          <Text className={tw.wrongTitle}>MISSION FAILED</Text>

          <Animated.View style={[styles.failUni, { height: failUniHeight, opacity: failReveal }]}>
            <UniAnimation mood="cry" />
          </Animated.View>

          <Text className={tw.wrongCopy}>
            {!isFinalFailure ? (
              <>
                Don&apos;t give up! You can do it.{'\n'}
                Take a deep breath and aim again.{'\n'}
              </>
            ) : null}
            {failureRetryCopy}
          </Text>
        </Animated.View>

        <Animated.View
          pointerEvents={revealed ? 'auto' : 'none'}
          style={[
            styles.introBottom,
            { opacity: failReveal, transform: [{ translateY: failBottomTranslateY }] },
          ]}
        >
          <StreakCard
            variant="lose"
            streakCount={failureStreakCount}
          />

          <View className={tw.successActions}>
            {!isFinalFailure ? (
              <TouchableOpacity
                className={tw.primaryActionButton}
                onPress={onTryAgain}
                activeOpacity={0.85}
              >
                <Text className={tw.primaryActionText}>Try again</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              className={isFinalFailure ? tw.primaryActionButton : tw.secondaryActionButton}
              onPress={onEmergencyExit}
              activeOpacity={0.85}
            >
              <Text className={tw.secondaryActionText}>Emergency exit</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  uniAnimation: {
    height: UNI_SIZE,
    width: UNI_SIZE,
  },
  introHeader: {
    alignItems: 'center',
  },
  introBottom: {
    marginTop: 'auto',
    width: '100%',
    alignItems: 'center',
  },
  failUni: {
    width: UNI_SIZE,
    overflow: 'hidden',
    alignItems: 'center',
  },
});
