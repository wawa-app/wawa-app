import React from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
} from "react-native";

import CalendarIcon from "./icons/Calendar";
import UpdateIcon from "./icons/Update";

const ObjectCardContent = ({
    objectName,
    date,
    status,
    imageUri,
    onMenuPress,
}) => {
    const isEnrolled = status === "Enrolled";

    return (
        <>
            <View className="w-[88px] h-[88px] rounded-lg overflow-hidden bg-Neutral-Gray-200">
                {imageUri ? (
                    <Image
                        source={{ uri: imageUri }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-full h-full bg-Neutral-Gray-200" />
                )}
            </View>

            <View className="flex-1 ml-4">
                <Text className="text-[18px] leading-[24px] font-geologica text-Base-OnSurface mb-2">
                    {objectName}
                </Text>

                <View className="flex-row items-center">
                    <View className="w-5 h-5 items-center justify-center mr-2">
                        {isEnrolled ? (
                            <CalendarIcon size={16} color="#1A0F07" />
                        ) : (
                            <UpdateIcon size={16} color="#1A0F07" />
                        )}
                    </View>

                    <Text className="text-xs font-geologica-bold text-Base-OnSurface">
                        {status} {date}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                className="absolute top-3 right-3"
                onPress={onMenuPress}
            >
                <Text className="text-2xl text-Base-OnSurface leading-6">
                    ⋮
                </Text>
            </TouchableOpacity>
        </>
    );
};

const ObjectCard = ({
    objectName,
    date,
    status,
    imageUri,
    onMenuPress,
    needsCheck = false,
}) => {
    if (needsCheck) {
        return (
            <View className="w-[328px] h-[120px] p-4 rounded-2xl bg-State-Warn flex-row items-center relative">
                <ObjectCardContent
                    objectName={objectName}
                    date={date}
                    status={status}
                    imageUri={imageUri}
                    onMenuPress={onMenuPress}
                />
            </View>
        );
    }

    return (
        <View className="w-[328px] h-[120px] p-4 rounded-2xl border border-Base-OnBackground bg-Base-Surface flex-row items-center relative">
            <ObjectCardContent
                objectName={objectName}
                date={date}
                status={status}
                imageUri={imageUri}
                onMenuPress={onMenuPress}
            />
        </View>
    );
};

export default ObjectCard;