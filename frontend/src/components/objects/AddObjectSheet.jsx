import React, { useEffect, useState } from "react";
import {
    Image,
    Keyboard,
    Modal,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

export default function AddObjectSheet({
    visible,
    imageUri,
    onCancel,
    onSave,
}) {
    const [objectName, setObjectName] = useState("");

    useEffect(() => {
        if (visible) {
            setObjectName("");
        }
    }, [visible]);

    const handleCancel = () => {
        Keyboard.dismiss();
        onCancel();
    };

    const handleSave = () => {
        const trimmedName = objectName.trim();

        if (!trimmedName) return;

        Keyboard.dismiss();

        onSave({
            objectName: trimmedName,
            imageUri,
        });
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={handleCancel}
        >
            <View className="flex-1 justify-end bg-black/35">
                <View className="h-[687px] bg-[#FFF7FF] rounded-t-[28px] overflow-hidden">
                    <View className="h-[67px] px-6 flex-row items-center justify-between">
                        <Pressable onPress={handleCancel}>
                            <Text className="text-[16px] leading-[24px] font-geologica-regular text-[#49454F]">
                                Cancel
                            </Text>
                        </Pressable>

                        <Text className="text-[20px] leading-[28px] font-geologica-bold text-black">
                            Add Object
                        </Text>

                        <Pressable onPress={handleSave}>
                            <Text className="text-[16px] leading-[24px] font-geologica-regular text-black">
                                Save
                            </Text>
                        </Pressable>
                    </View>

                    <View className="px-4">
                        <View className="w-[328px] h-[231px] self-center bg-[#F2F2F2] overflow-hidden">
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

                        <Text className="mt-3 mb-2 text-[16px] leading-[20px] font-geologica-bold text-black">
                            Name*
                        </Text>

                        <View className="w-[327px] h-10 self-center bg-white border border-black rounded-lg flex-row items-center px-3">
                            <TextInput
                                className="flex-1 text-[16px] leading-[20px] font-geologica-regular text-black p-0"
                                value={objectName}
                                onChangeText={setObjectName}
                                placeholder=""
                                placeholderTextColor="#49454F"
                                autoCapitalize="words"
                                returnKeyType="done"
                                onSubmitEditing={handleSave}
                            />

                            {objectName.length > 0 && (
                                <Pressable
                                    className="w-6 h-6 rounded-full bg-black items-center justify-center"
                                    onPress={() => setObjectName("")}
                                >
                                    <Text className="text-white text-[18px] leading-[20px]">
                                        ×
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}