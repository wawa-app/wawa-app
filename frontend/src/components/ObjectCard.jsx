import React from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
} from "react-native";

import CalendarIcon from "./icons/Calendar";
import UpdateIcon from "./icons/Update";

const ObjectCard = ({
    objectName,
    date,
    status,
    imageUri,
    onMenuPress,
}) => {
    const isEnrolled = status === "Enrolled";

    return (
        <View className="w-[328px] h-[120px] p-4 rounded-lg border border-[#191919] bg-[#C1C1C1] flex-row items-center relative">
            <View className="w-[88px] h-[88px] rounded-2xl overflow-hidden bg-[#F2F2F2]">
                {imageUri ? (
                    <Image
                        source={{ uri: imageUri }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-full h-full bg-[#F7F7F7]" />
                )}
            </View>

            <View className="flex-1 ml-4">
                <Text className="text-[18px] leading-[24px] font-geologica-bold font-semibold text-black mb-2">
                    {objectName}
                </Text>

                <View className="flex-row items-center">
                    <View className="w-5 h-5 items-center justify-center mr-2">
                        {isEnrolled ? (
                            <CalendarIcon size={16} color="#4A4A4A" />
                        ) : (
                            <UpdateIcon size={16} color="#4A4A4A" />
                        )}
                    </View>

                    <Text className="text-xs text-[#4A4A4A]">
                        {status} {date}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                className="absolute top-3 right-3"
                onPress={onMenuPress}
            >
                <Text className="text-2xl text-black leading-6">
                    ⋮
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ObjectCard;