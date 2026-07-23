import React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  ScrollView,
  Share as RNShare,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const REVEAL_DELAY = 1200;
const REVEAL_DURATION = 600;
const HEADER_CENTER_OFFSET = Dimensions.get('window').height * 0.28;
const SUCCESS_UNI_SIZE = 280;
const FAILURE_UNI_SIZE = 190;
const SHARE_URL = 'https://wawa-wmdd.netlify.app';
// Version the preference so a choice saved by the previous emergency dialog
// cannot silently bypass this redesigned confirmation prompt.
const EMERGENCY_PROMPT_KEY = 'wawa.hideEmergencyExitPrompt.v2';

function UniAnimation({ mood = 'happy', size = SUCCESS_UNI_SIZE }) {
  const source = mood === 'cry' ? uniCry : uniHappy;

  return (
    <LottieView
      source={source}
      autoPlay
      loop
      style={{ height: size, width: size }}
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
  const [revealed, setRevealed] = React.useState(false);
  const [showEmergencyPrompt, setShowEmergencyPrompt] = React.useState(false);
  const [hideEmergencyPrompt, setHideEmergencyPrompt] = React.useState(false);
  const [isEmergencyExiting, setIsEmergencyExiting] = React.useState(false);
  const reveal = React.useRef(new Animated.Value(0)).current;

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
    outputRange: [HEADER_CENTER_OFFSET * 0.55, 0],
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
    outputRange: [0, FAILURE_UNI_SIZE],
  });

  const handleShare = React.useCallback(async () => {
    try {
      await RNShare.share({
        title: 'Share WaWa',
        message: `I completed my WaWa mission! ${SHARE_URL}`,
        url: SHARE_URL,
      });
    } catch (error) {
      console.warn('[ChallengeResultScreen] share error:', error?.message);
    }
  }, []);

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

  const handleKeepStreak = React.useCallback(() => {
    if (isEmergencyExiting) return;
    setShowEmergencyPrompt(false);
  }, [isEmergencyExiting]);

  const handleConfirmEmergencyExit = React.useCallback(async () => {
    if (isEmergencyExiting) return;
    setIsEmergencyExiting(true);
    try {
      await onEmergencyExit();
      setShowEmergencyPrompt(false);
    } finally {
      setIsEmergencyExiting(false);
    }
  }, [isEmergencyExiting, onEmergencyExit]);

  const handleEmergencyPress = React.useCallback(async () => {
    if (isEmergencyExiting) return;

    try {
      const shouldSkipPrompt = await AsyncStorage.getItem(EMERGENCY_PROMPT_KEY);
      if (shouldSkipPrompt === 'true') {
        await handleConfirmEmergencyExit();
        return;
      }
    } catch (error) {
      console.warn(
        '[ChallengeResultScreen] load emergency prompt preference error:',
        error?.message
      );
    }

    setHideEmergencyPrompt(false);
    setShowEmergencyPrompt(true);
  }, [handleConfirmEmergencyExit, isEmergencyExiting]);

  const handleSkipStreak = React.useCallback(async () => {
    if (isEmergencyExiting) return;

    if (hideEmergencyPrompt) {
      try {
        await AsyncStorage.setItem(EMERGENCY_PROMPT_KEY, 'true');
      } catch (error) {
        console.warn(
          '[ChallengeResultScreen] save emergency prompt preference error:',
          error?.message
        );
      }
    }

    await handleConfirmEmergencyExit();
  }, [handleConfirmEmergencyExit, hideEmergencyPrompt, isEmergencyExiting]);

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
  const failureStreakCount = isFinalFailure ? 0 : completionStats?.streak?.currentCount;

  if (matched && step === 'reward') {
    return (
      <View className={tw.screen}>
        <View style={styles.rewardStepBody}>
          <Text className={tw.successTitle}>MISSION{'\n'}ACCOMPLISHED</Text>

          <View className={tw.uniRewardCenter} style={styles.rewardUniSpacing}>
            <UniAnimation mood="happy" />
            <Text className={tw.levelText}>{uni.stage} (Level: {uni.level})</Text>
          </View>

          <View className={tw.uniRewardBottom}>
            <View className={tw.xpCard} style={styles.xpCardBackground}>
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
      </View>
    );
  }

  if (matched) {
    return (
      <ScrollView className={tw.screen} contentContainerClassName={tw.resultContent}>
        {/* <View className={tw.shortBlackStatus} /> */}

        <View className={tw.successCenteredBody}>
          <Animated.View
            className={tw.successHeaderBlock}
            style={{ transform: [{ translateY: headerTranslateY }] }}
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
              styles.successRevealBottom,
              { opacity: reveal, transform: [{ translateY: bottomTranslateY }] },
            ]}
          >
            <View style={styles.successHeaderGap} />

            <View className={tw.successCenteredBottom}>
              <StreakCard
                variant="success"
                streakCount={successStreakCount}
                width={308}
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
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    );
  }

  if (isFinalFailure) {
    return (
      <ScrollView className={tw.screen} contentContainerStyle={styles.finalFailureScrollContent}>
        {/* <View className={tw.shortBlackStatus} /> */}

        <View style={styles.finalFailureBody}>
          <View style={styles.finalFailureContent}>
            <Text className={tw.wrongTitle}>MISSION FAILED</Text>

            <Text className={tw.wrongCopy}>
              Don&apos;t give up! You can do it.{'\n'}
              Take a deep breath and aim again{'\n'}
              next time.
            </Text>

            <View style={styles.finalFailureCard}>
              <StreakCard
                variant="lose"
                streakCount={failureStreakCount}
              />
            </View>

            <View style={styles.finalFailureActions}>
              <TouchableOpacity
                className={tw.primaryActionButton}
                onPress={onClose}
                activeOpacity={0.85}
              >
                <Text className={tw.primaryActionText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <>
      <ScrollView className={tw.screen} contentContainerClassName={tw.resultContent}>
        {/* <View className={tw.shortBlackStatus} /> */}

        <View className={tw.successStepBody} style={styles.failureStepBody}>
          <Animated.View
            style={[styles.introHeader, { transform: [{ translateY: failHeaderTranslateY }] }]}
          >
            <Text className={tw.wrongTitle}>MISSION FAILED</Text>

            {!isFinalFailure ? (
              <Animated.View style={[styles.failUni, { height: failUniHeight, opacity: failReveal }]}>
                <UniAnimation mood="cry" size={FAILURE_UNI_SIZE} />
              </Animated.View>
            ) : null}

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
              styles.failBottom,
              { opacity: failReveal, transform: [{ translateY: failBottomTranslateY }] },
            ]}
          >
            <StreakCard
              variant="lose"
              streakCount={failureStreakCount}
            />

            <View style={styles.failedActions}>
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
                onPress={handleEmergencyPress}
                activeOpacity={0.85}
              >
                <Text className={tw.secondaryActionText}>Emergency exit</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
      <Modal
        visible={showEmergencyPrompt}
        transparent
        animationType="fade"
        onRequestClose={handleKeepStreak}
      >
        <View style={styles.emergencyOverlay}>
          <View style={styles.emergencyDialog}>
            <View style={styles.emergencyContent}>
              <Text
                style={styles.emergencyMessage}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                Leaving now will break your streak.{'\n'}
                Take a second before you leave.
              </Text>

              <TouchableOpacity
                style={styles.emergencyCheckboxRow}
                onPress={() => setHideEmergencyPrompt((value) => !value)}
                disabled={isEmergencyExiting}
                activeOpacity={0.8}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: hideEmergencyPrompt }}
              >
                <View style={styles.emergencyCheckbox}>
                  {hideEmergencyPrompt ? (
                    <Text style={styles.emergencyCheckboxTick}>✓</Text>
                  ) : null}
                </View>
                <Text style={styles.emergencyCheckboxText}>Don’t show again</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.emergencyDivider} />

            <View style={styles.emergencyActions}>
              <TouchableOpacity
                style={[styles.emergencyActionButton, styles.emergencySkipButton]}
                onPress={handleSkipStreak}
                disabled={isEmergencyExiting}
                activeOpacity={0.8}
              >
                <Text style={styles.emergencySkipText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.emergencyActionButton, styles.emergencyKeepButton]}
                onPress={handleKeepStreak}
                disabled={isEmergencyExiting}
                activeOpacity={0.8}
              >
                <Text style={styles.emergencyKeepText}>Keep my streak</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  rewardUniSpacing: {
    transform: [{ translateY: 13.33 }],
  },
  xpCardBackground: {
    backgroundColor: '#FFB24D',
    borderRadius: 16,
  },
  rewardStepBody: {
    flex: 1,
    width: '100%',
    paddingTop: 87.75,
    // Android's edge-to-edge window height includes the status-bar inset,
    // so compensate for it to keep the visible bottom gap at 87.25.
    paddingBottom: 87.25 + (StatusBar.currentHeight ?? 0),
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  introHeader: {
    alignItems: 'center',
  },
  successHeaderGap: {
    height: 32,
  },
  successRevealBottom: {
    width: '100%',
    alignItems: 'center',
  },
  introBottom: {
    marginTop: 'auto',
    width: '100%',
    alignItems: 'center',
  },
  failBottom: {
    marginTop: 50,
    width: '100%',
    alignItems: 'center',
  },
  failedActions: {
    marginTop: 48,
    width: '100%',
  },
  failUni: {
    width: FAILURE_UNI_SIZE,
    overflow: 'hidden',
    alignItems: 'center',
  },
  failureStepBody: {
    paddingTop: 87,
  },
  finalFailureScrollContent: {
    minHeight: '100%',
    paddingHorizontal: 32,
  },
  finalFailureBody: {
    flex: 1,
    justifyContent: 'center',
  },
  finalFailureContent: {
    width: '100%',
    alignItems: 'center',
  },
  finalFailureCard: {
    marginTop: 24,
    alignItems: 'center',
  },
  finalFailureActions: {
    marginTop: 72,
    width: '100%',
  },
  emergencyOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    paddingHorizontal: 24,
  },
  emergencyDialog: {
    width: 318,
    maxWidth: '100%',
    overflow: 'hidden',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#191919',
    backgroundColor: '#FFF8E1',
  },
  emergencyContent: {
    height: 140,
    paddingHorizontal: 26,
    paddingTop: 25,
  },
  emergencyMessage: {
    color: '#1A0F07',
    fontFamily: 'Geologica-Regular',
    fontSize: 15,
    lineHeight: 23,
  },
  emergencyCheckboxRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  emergencyCheckbox: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1A0F07',
    backgroundColor: '#FFF8E1',
  },
  emergencyCheckboxTick: {
    color: '#1A0F07',
    fontFamily: 'Geologica-Bold',
    fontSize: 13,
    lineHeight: 15,
  },
  emergencyCheckboxText: {
    marginLeft: 16,
    color: '#1A0F07',
    fontFamily: 'Geologica-Bold',
    fontSize: 12,
    lineHeight: 18,
  },
  emergencyDivider: {
    height: 1,
    backgroundColor: '#D4CBBF',
  },
  emergencyActions: {
    height: 82,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
  emergencyActionButton: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencySkipButton: {
    width: 80,
  },
  emergencyKeepButton: {
    width: 140,
  },
  emergencySkipText: {
    color: '#1A0F07',
    fontFamily: 'Geologica-Bold',
    fontSize: 14,
  },
  emergencyKeepText: {
    color: '#FF6D00',
    fontFamily: 'Geologica-Bold',
    fontSize: 14,
  },
});
