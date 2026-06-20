import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { saveStoredObjects } from "../storage/objectStorage";

import EditIcon from "../components/icons/Edit";
import DeleteIcon from "../components/icons/Delete";
import CheckIcon from "../components/icons/Check";

const CHECK_DAYS = 30;

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
                    className="absolute w-[178px] bg-white rounded-2xl shadow-lg overflow-hidden"
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
                        <View className="w-8">
                            <EditIcon size={20} color="black" />
                        </View>

                        <Text className="text-sm font-geologica-medium text-black">
                            Edit
                        </Text>
                    </Pressable>

                    <Pressable
                        className="h-12 px-4 flex-row items-center"
                        onPress={onDelete}
                    >
                        <View className="w-8">
                            <DeleteIcon size={20} color="black" />
                        </View>

                        <Text className="text-sm font-geologica-medium text-black">
                            Delete
                        </Text>
                    </Pressable>

                    <Pressable
                        className="h-12 px-4 flex-row items-center"
                        onPress={onMarkAsChecked}
                    >
                        <View className="w-8">
                            <CheckIcon size={20} color="black" />
                        </View>

                        <Text className="text-sm font-geologica-medium text-black">
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
    const [editingObjectId, setEditingObjectId] = useState(null);

    const [snackbarMessage, setSnackbarMessage] = useState("");

    const cardRefs = useRef({});

    const isOlderThanCheckLimit = useCallback((dateValue) => {
        if (!dateValue) return false;

        const lastUpdatedDate = new Date(dateValue);

        if (Number.isNaN(lastUpdatedDate.getTime())) {
            return false;
        }

        const today = new Date();
        const differenceInMs = today.getTime() - lastUpdatedDate.getTime();
        const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

        return differenceInDays >= CHECK_DAYS;
    }, []);

    const formatDate = useCallback((dateValue) => {
        if (!dateValue) return "";

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}/${month}/${day}`;
    }, []);

    const formatBackendObject = useCallback(
        (object) => {
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
        },
        [formatDate, isOlderThanCheckLimit]
    );

    const persistObjects = useCallback(async (nextObjects) => {
        setObjects(nextObjects);
        await saveStoredObjects(nextObjects);
    }, []);

    const clearEditState = useCallback(() => {
        setEditingObject(null);
        setEditingObjectId(null);

        navigation.setParams({
            editingObjectId: undefined,
        });
    }, [navigation]);

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

                await persistObjects(backendObjects);
            } catch (error) {
                console.error("[ObjectsScreen] fetchObjects error:", error);
            }
        };

        fetchObjects();
    }, [formatBackendObject, persistObjects]);

    useEffect(() => {
        const capturedPhotoUri = route?.params?.capturedPhotoUri;
        const routeEditingObjectId = route?.params?.editingObjectId;

        if (!capturedPhotoUri) return;

        if (routeEditingObjectId) {
            const objectToEdit = objects.find(
                (object) => object.id === routeEditingObjectId
            );

            setEditingObject(objectToEdit || null);
            setEditingObjectId(routeEditingObjectId);
        } else {
            setEditingObject(null);
            setEditingObjectId(null);
        }

        setPendingPhotoUri(capturedPhotoUri);
        setShowAddObjectSheet(true);

        navigation.setParams({
            capturedPhotoUri: undefined,
            capturedAt: undefined,
        });
    }, [
        navigation,
        objects,
        route?.params?.capturedAt,
        route?.params?.capturedPhotoUri,
        route?.params?.editingObjectId,
    ]);

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
        setEditingObjectId(id);
        setPendingPhotoUri(null);
        closeMenu();

        navigation.setParams({
            editingObjectId: id,
        });

        navigation.navigate("CameraCapture", {
            editingObjectId: id,
        });
    };

    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`/api/objects/${id}`);

            const nextObjects = objects.filter((object) => object.id !== id);

            await persistObjects(nextObjects);

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

            const nextObjects = objects.map((object) =>
                object.id === id ? formattedObject : object
            );

            await persistObjects(nextObjects);

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
        setEditingObjectId(null);
        setPendingPhotoUri(null);

        navigation.setParams({
            editingObjectId: undefined,
        });

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
        clearEditState();
    };

    const handleSaveObject = async ({ objectName, imageUri }) => {
        try {
            const objectIdToUpdate =
                editingObject?.id || editingObjectId || route?.params?.editingObjectId;

            if (objectIdToUpdate) {
                const response = await apiClient.patch(
                    `/api/objects/${objectIdToUpdate}`,
                    {
                        name: objectName,
                        localRef: [imageUri],
                    }
                );

                const savedObject = response.data.data;
                const formattedObject = formatBackendObject(savedObject);

                const nextObjects = objects.map((object) =>
                    object.id === objectIdToUpdate ? formattedObject : object
                );

                await persistObjects(nextObjects);

                setShowAddObjectSheet(false);
                setPendingPhotoUri(null);
                clearEditState();
                setSnackbarMessage(`${objectName} is Updated`);

                return;
            }

            const response = await apiClient.post("/api/onboarding/photo-challenge", {
                name: objectName,
                localRef: [imageUri],
            });

            const savedObject = response.data.data;
            const formattedObject = formatBackendObject(savedObject);

            await persistObjects([...objects, formattedObject]);

            setShowAddObjectSheet(false);
            setPendingPhotoUri(null);
            clearEditState();
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
                <View className="px-4 py-6">
                    <Text className="text-4xl font-geologica-bold font-bold text-black">
                        Objects
                    </Text>

                    <Text className="text-xs text-black mt-1">
                        <Text className="font-geologica-bold font-bold">
                            {enrolledCount}
                        </Text>{" "}
                        Enrolled ({objectsToCheckCount} objects you need to check)
                    </Text>
                </View>

                {mustCheckObjects.length > 0 && (
                    <View className="px-4 py-6">
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

                <View className="px-4 pt-6 gap-4 items-center">
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

            <Pressable
                className="absolute right-6 bottom-[98px] w-[58px] h-[58px] rounded-full bg-black items-center justify-center z-10"
                onPress={handleAddPress}
            >
                <Text className="text-white text-4xl font-light">
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
                <View className="absolute right-6 bottom-[150px] bg-black px-6 py-4 rounded-sm shadow-lg">
                    <Text className="text-white text-sm font-geologica-regular">
                        {snackbarMessage}
                    </Text>
                </View>
            ) : null}
        </View>
    );
}