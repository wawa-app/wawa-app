import React, { useEffect, useRef, useState } from "react";
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { identifyObject } from "../../utils/vision";

export default function AddObjectSheet({
    visible,
    imageUri,
    initialName = "",
    isEditing = false,
    shouldIdentifyImage = true,
    onCancel,
    onSave,
    onImagePress,
}) {
    const [objectName, setObjectName] = useState("");
    const [isIdentifying, setIsIdentifying] = useState(false);
    const inputRef = useRef(null);
    const hasUserEditedName = useRef(false);

    useEffect(() => {
        if (!visible) return undefined;

        let isCurrent = true;
        hasUserEditedName.current = false;
        setObjectName(initialName || "Object");
        setIsIdentifying(false);

        const focusTimeout = setTimeout(() => {
            inputRef.current?.focus();
        }, 300);

        if (!imageUri || !shouldIdentifyImage) {
            return () => {
                isCurrent = false;
                clearTimeout(focusTimeout);
            };
        }

        setIsIdentifying(true);
        identifyObject(imageUri)
            .then((name) => {
                if (isCurrent && !hasUserEditedName.current) {
                    setObjectName(name);
                }
            })
            .finally(() => {
                if (isCurrent) setIsIdentifying(false);
            });

        return () => {
            isCurrent = false;
            clearTimeout(focusTimeout);
        };
    }, [visible, imageUri, initialName, isEditing, shouldIdentifyImage]);

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
            <KeyboardAvoidingView
                className="flex-1 justify-end"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View className="flex-1 justify-end bg-black/35">
                    <View className="h-[687px] bg-[#FFF3CD] rounded-t-[28px] overflow-hidden">
                        <View className="h-[67px] px-6 flex-row items-center justify-between">
                            <Pressable onPress={handleCancel}>
                                <Text className="text-[16px] leading-[24px] font-geologica-regular text-[#49454F]">
                                    Cancel
                                </Text>
                            </Pressable>

                            <Text className="text-[20px] leading-[28px] font-geologica-bold text-black">
                                {isEditing ? "Edit Object" : "Add Object"}
                            </Text>

                            <Pressable
                                onPress={handleSave}
                                hitSlop={12}
                                className="min-w-[48px] h-12 items-end justify-center"
                            >
                                <Text className="text-[16px] leading-[24px] font-geologica-regular text-black">
                                    Save
                                </Text>
                            </Pressable>
                        </View>

                        <View className="px-4">
                            <Pressable
                                className="w-[328px] h-[231px] self-center bg-[#F2F2F2] overflow-hidden"
                                onPress={onImagePress}
                                disabled={!isEditing || !onImagePress}
                            >
                                {imageUri ? (
                                    <Image
                                        source={{ uri: imageUri }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View className="w-full h-full bg-[#F7F7F7]" />
                                )}
                            </Pressable>

                            <Text className="mt-3 mb-2 text-[16px] leading-[20px] font-geologica-bold text-black">
                                Name*
                            </Text>

                            <View className="w-[327px] h-10 self-center bg-white border border-black rounded-lg flex-row items-center px-3">
                                <TextInput
                                    ref={inputRef}
                                    className="flex-1 text-[16px] leading-[20px] font-geologica-regular text-black p-0"
                                    value={objectName}
                                    onChangeText={(name) => {
                                        hasUserEditedName.current = true;
                                        setObjectName(name);
                                    }}
                                    placeholder="Coffee Mug"
                                    placeholderTextColor="#49454F"
                                    autoCapitalize="words"
                                    returnKeyType="done"
                                    onSubmitEditing={handleSave}
                                />

                                {objectName.length > 0 && (
                                    <Pressable
                                        className="w-6 h-6 rounded-full bg-black items-center justify-center"
                                        onPress={() => {
                                            hasUserEditedName.current = true;
                                            setObjectName("");
                                        }}
                                    >
                                        <Text className="text-white text-[18px] leading-[20px]">
                                            ×
                                        </Text>
                                    </Pressable>
                                )}
                            </View>

                            {isIdentifying && (
                                <Text className="mt-2 text-xs font-geologica-regular text-[#49454F]">
                                    Identifying object…
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
