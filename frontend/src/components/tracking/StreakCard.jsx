import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";

import apiClient from "../../api/client";

export default function StreakCard({ variant = "lose", streakCount }) {
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

    const totalDays = 7;
    const filledDays = Math.min(streak, totalDays);

    return (
        <View className={`w-[265px] max-w-[280px] ${cardBg} border border-[#191919] rounded-[28px] px-4 py-6 items-center justify-center`}>

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
                        <Text className="text-white text-[28px] mr-3">
                            🔥
                        </Text>

                        <Text className="text-white text-[36px] leading-[44px] font-geologica-bold font-bold text-center">
                            {streak}
                        </Text>
                    </View>

                    {/* Title */}
                    <Text className="text-white text-[20px] leading-[28px] font-geologica-bold font-bold text-center mb-4">
                        {title}
                    </Text>

                    {/* Day circles */}
                    <View className="flex-row items-center justify-center gap-2">
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
                                >
                                    <Text className="text-black text-[14px] font-bold leading-[16px]">
                                        {isFilled ? "✓" : isMissed ? "×" : ""}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </>
            )}
        </View>
    );
}
