import React, { useState } from "react";
import {
    Modal,
    Pressable,
    Text,
    View,
} from "react-native";

export default function CautionModal({
    visible,
    onCancel,
    onConfirm,
}) {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const handleConfirm = () => {
        onConfirm(dontShowAgain);
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View className="flex-1 items-center justify-center bg-black/25">
                <View className="w-[312px] bg-[#F1F1F1] rounded-[28px] overflow-hidden">
                    <View className="px-6 pt-6 pb-4">
                        <Text className="text-[24px] leading-[32px] font-geologica-regular text-[#1D1B20]">
                            Caution
                        </Text>

                        <Text className="mt-4 text-[14px] leading-[20px] font-geologica-regular text-[#49454F]">
                            Please ensure that no personal information (such as faces,
                            addresses, or documents) is captured by the camera.
                        </Text>

                        <Pressable
                            className="mt-4 flex-row items-center"
                            onPress={() => setDontShowAgain(!dontShowAgain)}
                        >
                            <View className="w-4 h-4 border border-black items-center justify-center mr-3">
                                {dontShowAgain && (
                                    <Text className="text-[12px] leading-[12px] text-black">
                                        ✓
                                    </Text>
                                )}
                            </View>

                            <Text className="text-[12px] leading-[16px] font-geologica-regular text-black">
                                Don't show again
                            </Text>
                        </Pressable>
                    </View>

                    <View className="h-[1px] bg-[#D0D0D0]" />

                    <View className="h-[88px] px-6 flex-row items-center justify-end gap-2">
                        <Pressable
                            className="px-4 py-[10px]"
                            onPress={onCancel}
                        >
                            <Text className="text-[14px] leading-[20px] font-geologica-medium text-black">
                                Cancel
                            </Text>
                        </Pressable>

                        <Pressable
                            className="px-4 py-[10px]"
                            onPress={handleConfirm}
                        >
                            <Text className="text-[14px] leading-[20px] font-geologica-medium text-black">
                                Confirm
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}