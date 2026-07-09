import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Share as RNShare,
    StatusBar,
} from "react-native";
import LottieView from "lottie-react-native";

import apiClient from "../api/client";
import {
    Share as ShareIcon,
    Streak as StreakIcon,
    Trophy,
    Timer,
} from "../components/icons";
import { useScroll } from "../context/ScrollContext";
import MissionHistoryCard from "../components/tracking/MissionHistoryCard";

const uniHappy = require("../assets/animations/UNIIII - Child happy.json");
const uniNormal = require("../assets/animations/UNIIII - Child normal.json");
const uniCry = require("../assets/animations/UNIIII - Child cry.json");

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

function isCompletedLog(log) {
    const status = String(
        log?.status ??
        log?.missionId?.status ??
        log?.result ??
        ""
    ).toLowerCase();

    return (
        status === "completed" ||
        status === "complete" ||
        status === "success"
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



function getHistoryTitle(log) {
    const objectName = log?.objectId?.name;
    const status = log?.status || log?.missionId?.status;

    if (objectName) return objectName;
    if (status) return `Mission ${status}`;
    return "Mission completed";
}

function formatCompletedDate(value) {
    if (!value) return "Completed Unknown date";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Completed Unknown date";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `Completed ${year}/${month}/${day}`;
}

function formatDuration(value) {
    if (typeof value !== "number" || value <= 0) {
        return "0m00s";
    }

    const minutes = Math.floor(value / 60);
    const seconds = value % 60;

    return `${minutes}m${String(seconds).padStart(2, "0")}s`;
}

function normalizeImagePath(value) {
    if (!value) {
        return null;
    }

    if (Array.isArray(value)) {
        return normalizeImagePath(value[0]);
    }

    if (typeof value === "object") {
        return normalizeImagePath(
            value.uri ??
            value.path ??
            value.localRef ??
            value.localPhotoPath ??
            value.local_photo_path ??
            null
        );
    }

    if (typeof value !== "string") {
        return null;
    }

    if (value.startsWith("file://")) {
        return value;
    }

    return `file://${value}`;
}

function getHistoryImageUri(log) {
    return normalizeImagePath(
        log?.objectId?.localRef ??
        log?.objectId?.localPhotoPath ??
        log?.objectId?.local_photo_path ??
        log?.objectId?.imageUri ??
        log?.objectId?.photoUri ??
        log?.objectId?.photo ??
        log?.objectId?.image ??
        log?.object?.localRef ??
        log?.object?.localPhotoPath ??
        log?.object?.local_photo_path ??
        log?.object?.imageUri ??
        log?.object?.photoUri ??
        log?.localRef ??
        log?.localPhotoPath ??
        log?.local_photo_path ??
        log?.imageUri ??
        log?.photoUri ??
        null
    );
}
function UniAnimation({ mood = "normal" }) {
    const source =
        mood === "happy" ? uniHappy : mood === "cry" ? uniCry : uniNormal;

    return (
        <LottieView
            source={source}
            autoPlay
            loop
            style={{ width: 120, height: 120 }}
        />
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
            className="h-6 flex-row items-center justify-center"
        >
            <ShareIcon size={16} color="#E85A00" />

            <Text className="ml-2 text-[#E85A00] text-[12px] leading-[16px] font-geologica-regular">
                Share
            </Text>
        </TouchableOpacity>
    );
}

function UniSection({ uni }) {
    const stage = uni?.stage ?? DEFAULT_STATS.uni.stage;
    const level = uni?.level ?? DEFAULT_STATS.uni.level;
    const exp = uni?.exp ?? DEFAULT_STATS.uni.exp;

    const currentXp = Math.min(exp % 100, 100);
    const xpProgress = `${currentXp}%`;

    return (
        <View className="w-full h-[316px] bg-[#FFF3C7] rounded-lg px-4 py-4 items-center">
            <View className="w-full flex-row justify-end">
                <ShareButton message={`My WaWa Uni is ${stage} at level ${level}!`} />
            </View>

            <View className="mt-4 w-[120px] h-[120px] items-center justify-center">
                <UniAnimation mood="normal" />
            </View>

            <Text className="mt-4 text-[#1A0F0A] text-[16px] leading-[24px] font-geologica-regular text-center">
                {stage} (Level: {level})
            </Text>

            <View className="mt-4 w-full h-[68px] bg-[#FFCC80] rounded-xl px-4 py-3 justify-center">
                <View className="w-full flex-row justify-between items-center">
                    <Text className="text-[#1A0F0A] text-[12px] leading-[16px] font-geologica-bold font-bold">
                        XP
                    </Text>

                    <Text className="text-[#1A0F0A] text-[12px] leading-[16px] font-geologica-bold font-bold">
                        {currentXp}/100
                    </Text>
                </View>

                <View className="mt-2 w-full h-4 bg-[#FFF3E1] rounded-full overflow-hidden">
                    <View
                        className="h-full bg-[#E85A00] rounded-full"
                        style={{ width: xpProgress }}
                    />
                </View>
            </View>
        </View>
    );
}
function StreakStatItem({ icon, value, label }) {
    return (
        <View className="items-center justify-center min-w-[72px]">
            <View className="w-12 h-12 items-center justify-center">
                {icon}
            </View>

            <Text className="mt-1 text-[#1A0F0A] text-[18px] leading-[24px] font-geologica-regular text-center">
                {value}
            </Text>

            <Text className="mt-1 text-[#1A0F0A] text-[12px] leading-[16px] font-geologica-regular text-center">
                {label}
            </Text>
        </View>
    );
}

function StreakInfoSection({ current, best, averageTime }) {
    return (
        <View className="w-full bg-[#FFF3C7] rounded-lg px-4 py-4">
            <View className="w-full flex-row items-center justify-between">
                <Text
                    numberOfLines={1}
                    className="flex-1 text-[#1A0F0A] text-[24px] leading-[32px] font-geologica-bold font-bold"
                >
                    Your Streak
                </Text>

                <View className="ml-4">
                    <ShareButton
                        message={`My WaWa streak is ${current} days. My best streak is ${best} days!`}
                    />
                </View>
            </View>

            <View className="mt-6 w-full h-24 flex-row items-center justify-between">
                <StreakStatItem
                    icon={<StreakIcon size={48} color="#E85A00" />}
                    value={current}
                    label="Current"
                />

                <StreakStatItem
                    icon={<Trophy size={48} color="#E85A00" />}
                    value={best}
                    label="Best"
                />

                <StreakStatItem
                    icon={<Timer size={48} color="#E85A00" />}
                    value={averageTime}
                    label="Average time"
                />
            </View>
        </View>
    );
}

function MissionHistorySection({ logs }) {
    if (logs.length === 0) {
        return (
            <View className="w-full">
                <Text className="text-[#1A0F0A] text-[24px] leading-[32px] font-geologica-bold font-bold">
                    Recent mission history
                </Text>

                <Text className="mt-6 text-[#1A0F0A] text-[18px] leading-[24px] font-geologica-bold font-bold">
                    You don’t have history yet. Let’s do mission
                </Text>
            </View>
        );
    }

    return (
        <View className="w-full">
            <Text className="text-[#1A0F07] text-[20px] leading-[28px] font-geologica-bold font-bold">
                Recent mission history
            </Text>

            <View className="mt-4 gap-4">
                {logs.map((log, index) => {
                    const durationSeconds = getDurationSeconds(log);
                    const imageUri = getHistoryImageUri(log);

                    return (
                        <MissionHistoryCard
                            key={log?._id ?? index}
                            objectName={getHistoryTitle(log)}
                            completedDate={formatCompletedDate(
                                log?.attemptAt ?? log?.createdAt
                            )}
                            duration={formatDuration(durationSeconds)}
                            imageUri={imageUri}
                        />
                    );
                })}
            </View>
        </View>
    );
}

export default function TrackingScreen() {
    const { setScrolled } = useScroll();

    const [stats, setStats] = useState(DEFAULT_STATS);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const handleScroll = (e) => {
        setScrolled(e.nativeEvent.contentOffset.y > 0);
    };

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
                const completedLogs = (historyResponse.data.logs ?? []).filter(isCompletedLog);
                setHistory(completedLogs);
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

    useFocusEffect(
        useCallback(() => {
            return () => setScrolled(false);
        }, [setScrolled])
    );

    useEffect(() => {
        fetchTrackingData();
    }, []);

    const averageTime = useMemo(() => formatAverageTime(history), [history]);

    const currentStreak = stats?.streak?.currentCount ?? 0;
    const bestStreak = stats?.streak?.longestCount ?? 0;
    const uni = stats?.uni ?? DEFAULT_STATS.uni;

    if (loading) {
        return (
            <View className="flex-1 bg-[#FFF9EF]">
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />

                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator color="#E85A00" />

                    <Text className="mt-3 text-[#1A0F0A] text-[14px] leading-[20px] font-geologica-regular">
                        Loading tracking...
                    </Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 bg-[#FFF9EF]">
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />

                <View className="flex-1 px-6 items-center justify-center">
                    <Text className="text-[#1A0F0A] text-[24px] leading-[32px] font-geologica-bold font-bold text-center">
                        Unable to load tracking
                    </Text>

                    <Text className="mt-2 text-[#4D3A2A] text-[14px] leading-[20px] font-geologica-regular text-center">
                        Please check your connection and try again.
                    </Text>

                    <TouchableOpacity
                        onPress={fetchTrackingData}
                        activeOpacity={0.8}
                        className="mt-6 bg-[#E85A00] rounded-2xl h-12 px-6 items-center justify-center"
                    >
                        <Text className="text-white text-[14px] leading-[20px] font-geologica-bold font-bold">
                            Retry
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#FFF9EF]">
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />

            <ScrollView
                className="flex-1"
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 24,
                    paddingBottom: 104,
                }}
                showsVerticalScrollIndicator={false}
            >
                <Text className="text-[#1A0F0A] text-[32px] leading-[40px] font-geologica-bold font-bold mb-8">
                    Tracking
                </Text>

                <View className="w-full gap-4">
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