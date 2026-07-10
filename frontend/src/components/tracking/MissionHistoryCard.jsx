import React from "react";
import { View, Text, Image } from "react-native";
import { Calendar, Timer } from "../icons";

function getImageSource(imageUri) {
    return { uri: imageUri };
}

export default function MissionHistoryCard({
    objectName = "Coffee Mug",
    completedDate = "Completed 2026/05/30",
    duration = "4m22s",
    imageUri,
}) {
    return (
        <View className="w-full min-h-[112px] rounded-2xl border border-[#1A0F07] bg-[#FFF8E1] px-4 py-3 flex-row items-center">
            {imageUri ? (
                <Image
                    source={getImageSource(imageUri)}
                    className="w-[88px] h-[88px] rounded overflow-hidden"
                    resizeMode="cover"
                />
            ) : (
                <View className="w-[88px] h-[88px] rounded bg-[#FFF3C7]" />
            )}

            <View className="ml-4 flex-1 justify-center">
                <Text
                    numberOfLines={1}
                    className="text-[#1A0F07] text-[20px] leading-[28px] font-geologica-regular"
                >
                    {objectName}
                </Text>

                <View className="mt-3 flex-row items-center">
                    <View className="w-[18px] h-[18px] items-center justify-center">
                        <Calendar size={18} color="#1A0F07" />
                    </View>

                    <Text
                        numberOfLines={1}
                        className="ml-2 text-[#1A0F07] text-[11px] leading-[16px] font-geologica-regular"
                    >
                        {completedDate}
                    </Text>
                </View>

                <View className="mt-2 flex-row items-center">
                    <View className="w-[18px] h-[18px] items-center justify-center">
                        <Timer size={18} color="#1A0F07" />
                    </View>

                    <Text className="ml-2 text-[#1A0F07] text-[11px] leading-[16px] font-geologica-regular">
                        {duration}
                    </Text>
                </View>
            </View>
        </View>
    );
}