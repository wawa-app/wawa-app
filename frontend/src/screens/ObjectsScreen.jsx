import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Modal,
    StatusBar,
} from "react-native";

import apiClient from "../api/client";
import ObjectCard from "../components/ObjectCard.jsx";
import CautionModal from "../components/objects/CautionModal.jsx";
import AddObjectSheet from "../components/objects/AddObjectSheet.jsx";

import EditIcon from "../components/icons/Edit";
import DeleteIcon from "../components/icons/Delete";
import CheckIcon from "../components/icons/Check";

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
                        <View className="w-8 items-start justify-center">
                            <EditIcon size={20} color="#49454F" />
                        </View>

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
                        <View className="w-8 items-start justify-center">
                            <DeleteIcon size={20} color="#49454F" />
                        </View>

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
                        <View className="w-8 items-start justify-center">
                            <CheckIcon size={20} color="#49454F" />
                        </View>

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
    const [editingObject, setEditingObject] = useState(null);

    const [snackbarMessage, setSnackbarMessage] = useState("");

    const cardRefs = useRef({});

    const CHECK_DAYS = 30;

    const isOlderThanCheckLimit = (dateValue) => {
        if (!dateValue) return false;

        const lastUpdatedDate = new Date(dateValue);

        if (Number.isNaN(lastUpdatedDate.getTime())) {
            return false;
        }

        const today = new Date();
        const differenceInMs = today.getTime() - lastUpdatedDate.getTime();
        const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

        return differenceInDays >= CHECK_DAYS;
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return "";

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}/${month}/${day}`;
    };

    const formatBackendObject = (object) => {
        const lastUpdatedAt = object.updatedAt || object.createdAt || "";

        return {
            id: object._id,
            objectName: object.name,
            status: object.status || "Enrolled",
            date: formatDate(lastUpdatedAt),
            imageUri: object.localRef?.[0] || null,
            lastUpdatedAt,
            needsCheck: isOlderThanCheckLimit(lastUpdatedAt),
        };
    };

    const mustCheckObjects = objects.filter((object) => object.needsCheck);
    const normalObjects = objects.filter((object) => !object.needsCheck);

    const enrolledCount = objects.length;
    const objectsToCheckCount = mustCheckObjects.length;

    useEffect(() => {
        const fetchObjects = async () => {
            try {
                const response = await apiClient.get("/api/objects");

                const backendObjects = response.data.data.map((object) =>
                    formatBackendObject(object)
                );

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
        const objectToEdit = objects.find((object) => object.id === id);

        if (!objectToEdit) {
            closeMenu();
            return;
        }

        setEditingObject(objectToEdit);
        setPendingPhotoUri(objectToEdit.imageUri);
        setShowAddObjectSheet(true);
        closeMenu();
    };

    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`/api/objects/${id}`);

            setObjects((prevObjects) =>
                prevObjects.filter((object) => object.id !== id)
            );

            closeMenu();
            setSnackbarMessage("Object deleted");
        } catch (error) {
            console.error(
                "[ObjectsScreen] deleteObject error:",
                error.response?.data || error.message
            );
        }
    };

    const handleMarkAsChecked = async (id) => {
        try {
            const response = await apiClient.patch(`/api/objects/${id}`, {
                status: "Updated",
            });

            const updatedObject = response.data.data;
            const formattedObject = formatBackendObject(updatedObject);

            setObjects((prevObjects) =>
                prevObjects.map((object) =>
                    object.id === id ? formattedObject : object
                )
            );

            setSnackbarMessage("Object marked as checked");
            closeMenu();
        } catch (error) {
            console.error(
                "[ObjectsScreen] markAsChecked error:",
                error.response?.data || error.message
            );
        }
    };

    const handleAddPress = () => {
        setEditingObject(null);
        setPendingPhotoUri(null);
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
        setEditingObject(null);
    };

    const handleSaveObject = async ({ objectName, imageUri }) => {
        try {
            console.log("[ObjectsScreen] Save pressed:", { objectName, imageUri });

            if (editingObject) {
                const response = await apiClient.patch(
                    `/api/objects/${editingObject.id}`,
                    {
                        name: objectName,
                        localRef: [imageUri],
                    }
                );

                const savedObject = response.data.data;
                const formattedObject = formatBackendObject(savedObject);

                setObjects((prevObjects) =>
                    prevObjects.map((object) =>
                        object.id === editingObject.id ? formattedObject : object
                    )
                );

                setShowAddObjectSheet(false);
                setPendingPhotoUri(null);
                setEditingObject(null);
                setSnackbarMessage(`${objectName} is Updated`);

                return;
            }

            const response = await apiClient.post("/api/onboarding/photo-challenge", {
                name: objectName,
                localRef: [imageUri],
            });

            const savedObject = response.data.data;
            const formattedObject = formatBackendObject(savedObject);

            setObjects((prevObjects) => [...prevObjects, formattedObject]);

            setShowAddObjectSheet(false);
            setPendingPhotoUri(null);
            setEditingObject(null);
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
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />



            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
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