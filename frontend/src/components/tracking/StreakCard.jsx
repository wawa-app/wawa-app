import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import apiClient from "../../api/client";
import { Streak, Unstreak } from "../icons";

export default function StreakCard({ variant = "lose", streakCount, width = 265 }) {
    const hasProvidedStreak = typeof streakCount === "number";
    const [streak, setStreak] = useState(hasProvidedStreak ? streakCount : 0);
    const [loading, setLoading] = useState(!hasProvidedStreak);
    const [error, setError] = useState(false);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(false);

            const response = await apiClient.get("/api/users/stats");

            if (response.data?.success) {
                const streakStats = response.data.stats?.streak;
                setStreak(
                    typeof streakStats === "number"
                        ? streakStats
                        : streakStats?.currentCount ?? 0
                );
            } else {
                console.warn("[StreakCard] stats response error:", response.data);
                setError(true);
            }
        } catch (err) {
            console.warn(
                "[StreakCard] fetchStats error:",
                err?.response?.status,
                err?.response?.data || err?.message
            );
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // The completed mission endpoint already returns the updated streak.
        // Use it immediately instead of making the success screen wait on a
        // second network request.
        if (hasProvidedStreak) {
            setStreak(streakCount);
            setError(false);
            setLoading(false);
            return;
        }

        fetchStats();
    }, [streakCount, hasProvidedStreak]);

    const isLose = variant === "lose";
    const title = isLose ? "Day Streak LOSE!" : "Day Streak COUNT!";
    const cardBg = isLose ? "bg-[#315A84]" : "bg-[#E65B00]";
    const titleWeight = isLose ? "font-geologica-black font-black" : "font-geologica-bold font-bold";
    const StreakStatusIcon = isLose ? Unstreak : Streak;

    const visibleDays = 7;
    const completedDays = Math.max(0, Math.floor(streak));
    const totalDays = Math.max(visibleDays, completedDays + (isLose ? 1 : 0));
    const filledDays = Math.min(completedDays, totalDays);
    const canScrollDays = totalDays > visibleDays;

    return (
        <View
            className={`${cardBg} border border-[#191919] rounded-[28px] px-4 py-6 items-center justify-center`}
            style={{ width, maxWidth: "100%" }}
        >

            {loading ? (
                <ActivityIndicator color="#FFFFFF" />
            ) : error ? (
                <TouchableOpacity onPress={fetchStats} activeOpacity={0.8}>
                    <Text className="text-white text-[14px] font-geologica-bold font-bold text-center">
                        Unable to load streak
                    </Text>
                    <Text className="mt-1 text-white text-[11px] font-geologica-bold font-bold text-center opacity-80">
                        Tap to retry
                    </Text>
                </TouchableOpacity>
            ) : (
                <>
                    {/* Icon + streak number */}
                    <View className="flex-row items-center justify-center mb-2">
                        <StreakStatusIcon size={40} color="#FFFFFF" style={styles.headerIcon} />

                        <Text className="text-white text-[36px] leading-[44px] font-geologica-black font-black text-center">
                            {streak}
                        </Text>
                    </View>

                    {/* Title */}
                    <Text className={`text-white text-[18px] leading-[28px] ${titleWeight} text-center mb-4`}>
                        {title}
                    </Text>

                    {/* Day circles */}
                    <ScrollView
                        horizontal
                        scrollEnabled={canScrollDays}
                        showsHorizontalScrollIndicator={false}
                        nestedScrollEnabled
                        snapToInterval={32}
                        decelerationRate="fast"
                        style={styles.dayViewport}
                        contentContainerStyle={styles.dayRow}
                    >
                        {Array.from({ length: totalDays }).map((_, index) => {
                            const isFilled = index < filledDays;
                            const isMissed = isLose && index === filledDays;

                            return (
                                <View
                                    key={index}
                                    className={`w-6 h-6 rounded-full items-center justify-center ${isFilled
                                        ? "bg-[#FFC107]"
                                        : isMissed
                                            ? "bg-[#6F7378]"
                                            : "bg-[#D8D0C4]"
                                        }`}
                                    style={index < totalDays - 1 ? styles.daySpacing : undefined}
                                >
                                    <Text className="text-black text-[14px] font-bold leading-[16px]">
                                        {isFilled ? "✓" : isMissed ? "×" : ""}
                                    </Text>
                                </View>
                            );
                        })}
                    </ScrollView>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    headerIcon: {
        marginRight: 12,
    },
    dayViewport: {
        width: 216,
        flexGrow: 0,
    },
    dayRow: {
        alignItems: "center",
    },
    daySpacing: {
        marginRight: 8,
    },
});
