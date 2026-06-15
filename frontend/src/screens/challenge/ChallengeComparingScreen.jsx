import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { challengeTw as tw, cameraFrameStyle } from './challengeNativewind';

export default function ChallengeComparingScreen({
  target,
  targetName = 'Saved object',
  candidate,
}) {
  const scanAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const scanLoop = Animated.loop(
      Animated.timing(scanAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 700,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    scanLoop.start();
    pulseLoop.start();

    return () => {
      scanLoop.stop();
      pulseLoop.stop();
    };
  }, [pulseAnim, scanAnim]);

  const scanTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-24, 452],
  });
  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1.08],
  });
  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.18, 0.38],
  });

  return (
    <View className={tw.screen}>
      <View className={tw.blackStatus} />
      <View className={tw.whiteTopSpacer} />

      <View className={tw.topTargetBarWide}>
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
          <Text className={tw.targetName}>{targetName}</Text>
        </View>
      </View>

      <View className={tw.comparingBody}>
        <View className={tw.cameraFrame} style={cameraFrameStyle}>
          {candidate ? (
            <Image source={{ uri: candidate }} className={tw.comparingCandidateImage} resizeMode="cover" />
          ) : (
            <View className={tw.comparingFallback}>
              <Ionicons name="image" size={34} color="#111" />
            </View>
          )}

          <Animated.View
            pointerEvents="none"
            className={tw.scanBand}
            style={{ transform: [{ translateY: scanTranslateY }] }}
          />
          <Animated.View
            pointerEvents="none"
            className={tw.scanPulse}
            style={{
              opacity: pulseOpacity,
              transform: [{ translateY: -48 }, { scale: pulseScale }],
            }}
          />
          <View className={tw.scanBorder} pointerEvents="none" />
        </View>

        <Text className={tw.comparingText}>Comparing objects...</Text>
      </View>
    </View>
  );
}
