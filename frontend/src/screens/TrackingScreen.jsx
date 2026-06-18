import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Share as RNShare,
    StatusBar,
} from "react-native";

import apiClient from "../api/client";
import {
    Share as ShareIcon,
    Streak as StreakIcon,
    Trophy,
    Timer,
} from "../components/icons";

const DEFAULT_STATS = {
    uni: {
        stage: "Baby Uni",
        level: 1,
        exp: 0,
        avatarKey: "default",
    },
    streak: {
        currentCount: 0,
        longestCount: 0,
    },
    totalUnlocks: 0,
};

function getDurationSeconds(log) {
    return (
        log?.durationSeconds ??
        log?.timeToComplete ??
        log?.timeToCompleteSeconds ??
        log?.completedInSeconds ??
        log?.totalTimeSeconds ??
        log?.secondsToComplete ??
        null
    );
}

function formatAverageTime(logs) {
    const validDurations = logs
        .map(getDurationSeconds)
        .filter((value) => typeof value === "number" && value > 0);

    if (!validDurations.length) return "0m00s";

    const averageSeconds = Math.round(
        validDurations.reduce((sum, value) => sum + value, 0) / validDurations.length
    );

    const minutes = Math.floor(averageSeconds / 60);
    const seconds = averageSeconds % 60;

    return `${minutes}m${String(seconds).padStart(2, "0")}s`;
}

function formatHistoryDate(value) {
    if (!value) return "Unknown date";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Unknown date";

    return date.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function getHistoryTitle(log) {
    const objectName = log?.objectId?.name;
    const status = log?.status || log?.missionId?.status;

    if (objectName) return objectName;
    if (status) return `Mission ${status}`;
    return "Mission completed";
}

function getHistorySubtitle(log) {
    const date = formatHistoryDate(log?.attemptAt || log?.createdAt);
    const duration = getDurationSeconds(log);

    if (typeof duration === "number" && duration > 0) {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${date} • ${minutes}m${String(seconds).padStart(2, "0")}s`;
    }

    return date;
}

function UniPlaceholder() {
    return (
        <View className="w-16 h-16 border-2 border-black items-center justify-center">
            <View className="absolute w-[88px] h-[2px] bg-black rotate-45" />
            <View className="absolute w-[88px] h-[2px] bg-black -rotate-45" />
        </View>
    );
}

function ShareButton({ message }) {
    const handleShare = async () => {
        try {
            await RNShare.share({
                message,
            });
        } catch (error) {
            console.warn("[TrackingScreen] share error:", error?.message);
        }
    };

    return (
        <TouchableOpacity
            onPress={handleShare}
            activeOpacity={0.7}
            className="flex-row items-center"
        >
            <ShareIcon size={20} color="#000000" />

            <Text className="ml-1 text-[12px] leading-[15px] text-black font-geologica-regular">
                Share
            </Text>
        </TouchableOpacity>
    );
}

function UniSection({ uni }) {
    const stage = uni?.stage ?? "Baby Uni";
    const level = uni?.level ?? 1;
    const exp = uni?.exp ?? 0;

    const currentXp = Math.min(exp % 100, 100);
    const xpProgress = `${currentXp}%`;

    return (
        <View className="w-full h-[240px] bg-[#D9D9D9] rounded-lg p-4 items-center gap-4">
            <View className="w-full flex-row justify-end">
                <ShareButton
                    message={`My WaWa Uni is ${stage} at level ${level}!`}
                />
            </View>

            <UniPlaceholder />

            <Text className="text-black text-[16px] leading-[20px] font-geologica-bold font-bold text-center">
                {stage} (Level: {level})
            </Text>

            <View className="w-full bg-[#868686] rounded-xl p-4 gap-2">
                <View className="flex-row justify-between items-center">
                    <Text className="text-white text-[12px] leading-[15px] font-geologica-bold font-bold">
                        XP
                    </Text>

                    <Text className="text-white text-[12px] leading-[15px] font-geologica-bold font-bold">
                        {currentXp}/100
                    </Text>
                </View>

                <View className="w-full h-4 bg-[#D9D9D9] rounded-full overflow-hidden">
                    <View
                        className="h-full bg-[#4D4D4D] rounded-full"
                        style={{ width: xpProgress }}
                    />
                </View>
            </View>
        </View>
    );
}

function StreakInfoSection({ current, best, averageTime }) {
    return (
        <View className="w-full bg-[#E6E6E6] rounded-lg p-4 gap-4">
            <View className="w-full flex-row items-start justify-between">
                <Text className="text-black text-[16px] leading-[20px] font-geologica-bold font-bold">
                    Your Streak
                </Text>

                <ShareButton
                    message={`My WaWa streak is ${current} days. My best streak is ${best} days!`}
                />
            </View>

            <View className="w-full flex-row items-center justify-between">
                <View className="items-center justify-center">
                    <StreakIcon size={32} color="#333333" />

                    <Text className="mt-3 text-black text-[16px] leading-[20px] font-geologica-bold font-bold">
                        {current}
                    </Text>

                    <Text className="text-[#333333] text-[12px] leading-[15px] font-geologica-regular">
                        Current
                    </Text>
                </View>

                <View className="items-center justify-center">
                    <Trophy size={32} color="#333333" />

                    <Text className="mt-3 text-black text-[16px] leading-[20px] font-geologica-bold font-bold">
                        {best}
                    </Text>

                    <Text className="text-[#333333] text-[12px] leading-[15px] font-geologica-regular">
                        Best
                    </Text>
                </View>

                <View className="items-center justify-center">
                    <Timer size={32} color="#333333" />

                    <Text className="mt-3 text-black text-[16px] leading-[20px] font-geologica-bold font-bold">
                        {averageTime}
                    </Text>

                    <Text className="text-[#333333] text-[12px] leading-[15px] font-geologica-regular">
                        Average time
                    </Text>
                </View>
            </View>
        </View>
    );
}

function MissionHistorySection({ logs }) {
    return (
        <View className="w-full gap-3">
            <Text className="text-black text-[16px] leading-[20px] font-geologica-bold font-bold">
                Recent mission history
            </Text>

            <View className="w-full border border-black rounded-lg bg-white overflow-hidden">
                {logs.length === 0 ? (
                    <View className="p-4">
                        <Text className="text-black text-[14px] font-geologica-regular">
                            No mission history yet.
                        </Text>
                    </View>
                ) : (
                    logs.map((log, index) => (
                        <View
                            key={log?._id ?? index}
                            className={`p-4 ${index !== logs.length - 1
                                ? "border-b border-[#D9D9D9]"
                                : ""
                                }`}
                        >
                            <Text className="text-black text-[14px] leading-[18px] font-geologica-bold font-bold">
                                {getHistoryTitle(log)}
                            </Text>

                            <Text className="mt-1 text-[#4D4A50] text-[12px] leading-[15px] font-geologica-regular">
                                {getHistorySubtitle(log)}
                            </Text>
                        </View>
                    ))
                )}
            </View>
        </View>
    );
}

export default function TrackingScreen() {
    const [stats, setStats] = useState(DEFAULT_STATS);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);


    const fetchTrackingData = async () => {
        try {
            setLoading(true);
            setError(false);

            const [statsResponse, historyResponse] = await Promise.all([
                apiClient.get("/api/users/stats"),
                apiClient.get("/api/users/history?limit=7"),
            ]);

            if (statsResponse.data?.success) {
                setStats(statsResponse.data.stats ?? DEFAULT_STATS);
            } else {
                setError(true);
            }

            if (historyResponse.data?.success) {
                setHistory(historyResponse.data.logs ?? []);
            } else {
                setHistory([]);
            }
        } catch (err) {
            console.warn(
                "[TrackingScreen] fetch error:",
                err?.response?.status,
                err?.response?.data || err?.message
            );
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrackingData();
    }, []);

    const averageTime = useMemo(() => formatAverageTime(history), [history]);

    const currentStreak = stats?.streak?.currentCount ?? 0;
    const bestStreak = stats?.streak?.longestCount ?? 0;
    const uni = stats?.uni ?? DEFAULT_STATS.uni;

    if (loading) {
        return (
            <View className="flex-1 bg-white">
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />



                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator color="#000000" />

                    <Text className="mt-3 text-black text-[14px] font-geologica-regular">
                        Loading tracking...
                    </Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 bg-white">
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />



                <View className="flex-1 px-6 items-center justify-center">
                    <Text className="text-black text-[22px] leading-[28px] font-geologica-bold font-bold text-center">
                        Unable to load tracking
                    </Text>

                    <Text className="mt-2 text-[#4D4A50] text-[14px] leading-[20px] font-geologica-regular text-center">
                        Please check your connection and try again.
                    </Text>

                    <TouchableOpacity
                        onPress={fetchTrackingData}
                        activeOpacity={0.8}
                        className="mt-6 bg-black rounded-2xl h-12 px-6 items-center justify-center"
                    >
                        <Text className="text-white text-[14px] font-geologica-bold font-bold">
                            Retry
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />





            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: 32,
                    paddingBottom: 120,
                }}
                showsVerticalScrollIndicator={false}
            >
                <Text className="text-black text-[32px] leading-[39px] font-geologica-bold font-bold mb-8">
                    Tracking
                </Text>

                <View className="gap-4">
                    <UniSection uni={uni} />

                    <StreakInfoSection
                        current={currentStreak}
                        best={bestStreak}
                        averageTime={averageTime}
                    />

                    <MissionHistorySection logs={history} />
                </View>
            </ScrollView>
        </View>
    );
}