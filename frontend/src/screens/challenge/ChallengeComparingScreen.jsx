import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { challengeTw as tw, cameraFrameStyle } from './challengeNativewind';

export default function ChallengeComparingScreen({
  target,
  targetName = 'Saved object',
  candidate,
}) {
  const scanAnim = useRef(new Animated.Value(0)).current;
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const scanLoop = Animated.loop(
      Animated.timing(scanAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
    );
    const dotsInterval = setInterval(() => {
      setDotCount((count) => (count === 3 ? 1 : count + 1));
    }, 450);

    scanLoop.start();

    return () => {
      scanLoop.stop();
      clearInterval(dotsInterval);
    };
  }, [scanAnim]);

  const scanTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-16, 504],
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
              <Ionicons name="image" size={28} color="#3D2A1C" />
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
              <Ionicons name="image" size={34} color="#3D2A1C" />
            </View>
          )}

          <Animated.View
            pointerEvents="none"
            className={tw.scanBand}
            style={{ transform: [{ translateY: scanTranslateY }] }}
          />
          <View className={tw.scanBorder} pointerEvents="none" />
        </View>

        <View className={tw.comparingTextRow}>
          <Text className={tw.comparingText}>Comparing Objects</Text>
          <Text className={tw.comparingDots}>{'.'.repeat(dotCount)}</Text>
        </View>
      </View>
    </View>
  );
}
