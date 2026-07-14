import React, { useEffect, useState } from "react";
import {
    Modal,
    Pressable,
    Text,
    View,
} from "react-native";

import WarningIcon from "../icons/Warning";

export default function CautionModal({
    visible,
    onCancel,
    onConfirm,
}) {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        if (visible) {
            setDontShowAgain(false);
        }
    }, [visible]);

    const handleConfirm = () => {
        onConfirm(dontShowAgain);
    };

    const toggleDontShowAgain = () => {
        setDontShowAgain((currentValue) => !currentValue);
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onCancel}
        >
            <View className="flex-1 items-center justify-center bg-black/40 px-6">
                <View
                    className="w-[312px] min-w-[280px] max-w-[560px] bg-Base-Surface rounded-[28px] overflow-hidden"
                    style={{
                        elevation: 8,
                        shadowColor: "#1A0F07",
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowOpacity: 0.18,
                        shadowRadius: 6,
                    }}
                >
                    <View className="items-center px-6 pt-6 pb-4">
                        <View className="w-12 h-12 items-center justify-center mb-4">
                            <WarningIcon
                                size={48}
                                color="#FF9800"
                            />
                        </View>

                        <Text className="text-[24px] leading-[32px] font-geologica-bold text-Base-OnSurface text-center">
                            Caution
                        </Text>

                        <Text className="w-full mt-6 text-[16px] leading-[24px] font-geologica-regular text-Base-OnSurface">
                            Please ensure that no personal information (such as faces,
                            addresses, or documents) is captured by the camera.
                        </Text>

                        <Pressable
                            className="w-full min-h-12 mt-8 px-2 flex-row items-center"
                            onPress={toggleDontShowAgain}
                            accessibilityRole="checkbox"
                            accessibilityState={{
                                checked: dontShowAgain,
                            }}
                        >
                            <View
                                className={`
                                    w-6
                                    h-6
                                    mr-4
                                    rounded-[2px]
                                    border-2
                                    items-center
                                    justify-center
                                    ${dontShowAgain
                                        ? "bg-Brand-Primary border-Brand-Primary"
                                        : "bg-transparent border-Base-OnSurface"
                                    }
                                `}
                            >
                                {dontShowAgain && (
                                    <Text className="text-white text-[16px] leading-[18px] font-geologica-bold">
                                        ✓
                                    </Text>
                                )}
                            </View>

                            <Text className="text-[12px] leading-[16px] font-geologica-medium text-Base-OnSurface">
                                Don’t show again
                            </Text>
                        </Pressable>
                    </View>

                    <View className="h-[1px] bg-Base-Outline" />

                    <View className="h-[80px] flex-row items-center">
                        <Pressable
                            className="flex-1 h-12 items-center justify-center"
                            onPress={onCancel}
                        >
                            <Text className="text-[16px] leading-[24px] font-geologica-medium text-Base-OnSurfaceVariant">
                                Cancel
                            </Text>
                        </Pressable>

                        <Pressable
                            className="flex-1 h-12 items-center justify-center"
                            onPress={handleConfirm}
                        >
                            <Text className="text-[16px] leading-[24px] font-geologica-medium text-Brand-Primary">
                                Confirm
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}