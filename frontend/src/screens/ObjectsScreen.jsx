import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Modal,
} from "react-native";

import apiClient from "../api/client";
import ObjectCard from "../components/ObjectCard.jsx";
import CautionModal from "../components/objects/CautionModal.jsx";
import AddObjectSheet from "../components/objects/AddObjectSheet.jsx";

function ObjectMenu({ position, onClose, onEdit, onDelete, onMarkAsChecked }) {
    return (
        <Modal
            transparent
            visible
            animationType="none"
            onRequestClose={onClose}
        >
            <Pressable className="flex-1" onPress={onClose}>
                <View
                    className="absolute w-[178px] bg-[#FFF7FF] rounded-2xl shadow-lg overflow-hidden"
                    style={{
                        top: position.top,
                        left: position.left,
                        elevation: 20,
                        zIndex: 999,
                    }}
                >
                    <Pressable
                        className="h-12 px-4 flex-row items-center"
                        onPress={onEdit}
                    >
                        <Text className="w-8 text-[18px] leading-[20px] text-[#49454F]">
                            ✎
                        </Text>

                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            className="text-[14px] leading-[20px] tracking-[0.1px] font-geologica-medium text-[#1D1B20]"
                        >
                            Edit
                        </Text>
                    </Pressable>

                    <Pressable
                        className="h-12 px-4 flex-row items-center"
                        onPress={onDelete}
                    >
                        <Text className="w-8 text-[18px] leading-[20px] text-[#49454F]">
                            ▮
                        </Text>

                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            className="text-[14px] leading-[20px] tracking-[0.1px] font-geologica-medium text-[#1D1B20]"
                        >
                            Delete
                        </Text>
                    </Pressable>

                    <Pressable
                        className="h-12 px-4 flex-row items-center"
                        onPress={onMarkAsChecked}
                    >
                        <Text className="w-8 text-[18px] leading-[20px] text-[#49454F]">
                            ✓
                        </Text>

                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            className="text-[14px] leading-[20px] tracking-[0.1px] font-geologica-medium text-[#1D1B20]"
                        >
                            Mark as checked
                        </Text>
                    </Pressable>
                </View>
            </Pressable>
        </Modal>
    );
}

export default function ObjectsScreen({ navigation, route }) {
    const [objects, setObjects] = useState([]);

    const [activeMenuId, setActiveMenuId] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const [showCautionModal, setShowCautionModal] = useState(false);
    const [showAddObjectSheet, setShowAddObjectSheet] = useState(false);
    const [pendingPhotoUri, setPendingPhotoUri] = useState(null);

    const [snackbarMessage, setSnackbarMessage] = useState("");

    const cardRefs = useRef({});

    const mustCheckObjects = [];
    const normalObjects = objects;

    const enrolledCount = objects.length;
    const objectsToCheckCount = mustCheckObjects.length;

    useEffect(() => {
        const fetchObjects = async () => {
            try {
                const response = await apiClient.get("/api/objects");

                const backendObjects = response.data.data.map((object) => ({
                    id: object._id,
                    objectName: object.name,
                    status: object.status || "",
                    date: object.updatedAt || object.createdAt || "",
                    imageUri: object.localRef?.[0] || null,
                }));

                setObjects(backendObjects);
            } catch (error) {
                console.error("[ObjectsScreen] fetchObjects error:", error);
            }
        };

        fetchObjects();
    }, []);

    useEffect(() => {
        const capturedPhotoUri = route?.params?.capturedPhotoUri;

        if (!capturedPhotoUri) return;

        setPendingPhotoUri(capturedPhotoUri);
        setShowAddObjectSheet(true);

        navigation.setParams({
            capturedPhotoUri: undefined,
            capturedAt: undefined,
        });
    }, [route?.params?.capturedAt]);

    useEffect(() => {
        if (!snackbarMessage) return;

        const timer = setTimeout(() => {
            setSnackbarMessage("");
        }, 2500);

        return () => clearTimeout(timer);
    }, [snackbarMessage]);

    const openMenu = (id) => {
        const cardRef = cardRefs.current[id];

        if (!cardRef) return;

        cardRef.measureInWindow((x, y, width) => {
            setMenuPosition({
                top: y + 42,
                left: x + width - 178,
            });

            setActiveMenuId(id);
        });
    };

    const closeMenu = () => {
        setActiveMenuId(null);
    };

    const handleEdit = (id) => {
        console.log("Edit object through backend:", id);
        closeMenu();
    };

    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`/api/objects/${id}`);

            setObjects((prevObjects) =>
                prevObjects.filter((object) => object.id !== id)
            );

            closeMenu();
        } catch (error) {
            console.error("[ObjectsScreen] deleteObject error:", error);
        }
    };

    const handleMarkAsChecked = (id) => {
        console.log("Mark as checked object through backend:", id);
        closeMenu();
    };

    const handleAddPress = () => {
        setShowCautionModal(true);
    };

    const handleCancelCaution = () => {
        setShowCautionModal(false);
    };

    const handleConfirmCaution = () => {
        setShowCautionModal(false);
        navigation.navigate("CameraCapture");
    };

    const handleCancelAddObject = () => {
        setShowAddObjectSheet(false);
        setPendingPhotoUri(null);
    };

    const handleSaveObject = async ({ objectName, imageUri }) => {
        try {
            console.log("[ObjectsScreen] Save pressed:", { objectName, imageUri });

            const response = await apiClient.post("/api/onboarding/photo-challenge", {
                name: objectName,
                localRef: [imageUri],
            });

            const savedObject = response.data.data;

            const formattedObject = {
                id: savedObject._id,
                objectName: savedObject.name,
                status: "",
                date: savedObject.updatedAt || savedObject.createdAt || "",
                imageUri: savedObject.localRef?.[0] || null,
            };

            setObjects((prevObjects) => [...prevObjects, formattedObject]);

            setShowAddObjectSheet(false);
            setPendingPhotoUri(null);
            setSnackbarMessage(`${objectName} is Added`);
        } catch (error) {
            console.error(
                "[ObjectsScreen] saveObject error:",
                error.response?.data || error.message
            );
        }
    };

    return (
        <View className="flex-1 bg-white">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* App header */}
                <View className="h-[52px] bg-black items-center justify-center">
                    <Text className="text-white text-[32px] leading-[39px] font-geologica-bold font-bold">
                        WaWa
                    </Text>
                </View>

                {/* Page title section */}
                <View className="bg-white px-4 py-6">
                    <Text className="text-[32px] leading-[39px] font-geologica-bold font-bold text-black">
                        Objects
                    </Text>

                    <Text className="text-xs text-black mt-1">
                        <Text className="font-geologica-bold font-bold">
                            {enrolledCount}
                        </Text>{" "}
                        Enrolled ({objectsToCheckCount} objects you need to check)
                    </Text>
                </View>

                {/* Must check section */}
                {mustCheckObjects.length > 0 && (
                    <View className="bg-[#D9D9D9] px-4 py-6">
                        <Text className="text-base font-geologica-bold font-bold text-black">
                            Are these objects still near you?
                        </Text>

                        <Text className="text-xs text-black mt-2 mb-4">
                            It looks like it's been over a month since the last update.
                        </Text>

                        <View className="gap-4 items-center">
                            {mustCheckObjects.map((item) => (
                                <View
                                    key={item.id}
                                    ref={(ref) => {
                                        cardRefs.current[item.id] = ref;
                                    }}
                                >
                                    <ObjectCard
                                        objectName={item.objectName}
                                        status={item.status}
                                        date={item.date}
                                        imageUri={item.imageUri}
                                        onMenuPress={() => openMenu(item.id)}
                                    />
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Normal objects list */}
                <View className="bg-white px-4 pt-6 gap-4 items-center">
                    {normalObjects.map((item) => (
                        <View
                            key={item.id}
                            ref={(ref) => {
                                cardRefs.current[item.id] = ref;
                            }}
                        >
                            <ObjectCard
                                objectName={item.objectName}
                                status={item.status}
                                date={item.date}
                                imageUri={item.imageUri}
                                onMenuPress={() => openMenu(item.id)}
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Floating add button */}
            <Pressable
                className="absolute right-6 bottom-[98px] w-[58px] h-[58px] rounded-full bg-[#101010] items-center justify-center z-10"
                onPress={handleAddPress}
            >
                <Text className="text-white text-[32px] leading-[34px] font-light">
                    +
                </Text>
            </Pressable>

            {activeMenuId && (
                <ObjectMenu
                    position={menuPosition}
                    onClose={closeMenu}
                    onEdit={() => handleEdit(activeMenuId)}
                    onDelete={() => handleDelete(activeMenuId)}
                    onMarkAsChecked={() => handleMarkAsChecked(activeMenuId)}
                />
            )}

            <CautionModal
                visible={showCautionModal}
                onCancel={handleCancelCaution}
                onConfirm={handleConfirmCaution}
            />

            <AddObjectSheet
                visible={showAddObjectSheet}
                imageUri={pendingPhotoUri}
                onCancel={handleCancelAddObject}
                onSave={handleSaveObject}
            />

            {snackbarMessage ? (
                <View className="absolute right-6 bottom-[150px] bg-[#302D38] px-6 py-4 rounded-sm shadow-lg">
                    <Text className="text-white text-[14px] leading-[20px] font-geologica-regular">
                        {snackbarMessage}
                    </Text>
                </View>
            ) : null}
        </View>
    );
}