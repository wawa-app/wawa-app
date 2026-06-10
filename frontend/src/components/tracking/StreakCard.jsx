import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";

import apiClient from "../../api/client";

export default function StreakCard({ variant = "lose" }) {
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(false);

                const response = await apiClient.get("/api/users/stats");

                if (response.data?.success) {
                    setStreak(response.data.stats?.streak ?? 0);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("[StreakCard] fetchStats error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const isLose = variant === "lose";
    const title = isLose ? "Day Streak LOSE!" : "Day Streak!";

    const totalDays = 7;
    const filledDays = Math.min(streak, totalDays);

    return (
        <View className="w-[265px] max-w-[280px] bg-[#315A84] border border-[#191919] rounded-[28px] px-4 py-6 items-center justify-center">

            {loading ? (
                <ActivityIndicator color="#FFFFFF" />
            ) : error ? (
                <TouchableOpacity>
                    <Text className="text-white text-[14px] font-geologica-bold font-bold text-center">
                        Unable to load streak
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