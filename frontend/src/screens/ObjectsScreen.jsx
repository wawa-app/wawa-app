import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
import { useScroll } from "../context/ScrollContext";
import RNFS from "react-native-fs";
import { pathFromUri } from "../utils/photos";
import Fab from "../components/common/Fab";
import { useSnackbar } from "../components/common/SnackbarProvider";


import EditIcon from "../components/icons/Edit";
import DeleteIcon from "../components/icons/Delete";
import CheckIcon from "../components/icons/Check";

const CHECK_MINUTES = 43200; // 30 days
const MAX_OBJECTS = 20;
const MIN_OBJECTS = 10;

function ObjectMenu({
    position,
    onClose,
    onEdit,
    onDelete,
    onMarkAsChecked,
    showMarkAsChecked,
}) {
    return (
        <Modal
            transparent
            visible
            animationType="none"
            onRequestClose={onClose}
        >
            <Pressable className="flex-1" onPress={onClose}>
                <View
                    className="absolute w-[178px] bg-Base-Surface rounded-2xl shadow-lg overflow-hidden"
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
                            <EditIcon size={20} color="#1A0F07" />
                        </View>

                        <Text className="text-sm font-geologica-medium text-Base-OnSurface">
                            Edit
                        </Text>
                    </Pressable>

                    <Pressable
                        className="h-12 px-4 flex-row items-center"
                        onPress={onDelete}
                    >
                        <View className="w-8">
                            <DeleteIcon size={20} color="#1A0F07" />
                        </View>

                        <Text className="text-sm font-geologica-medium text-Base-OnSurface">
                            Delete
                        </Text>
                    </Pressable>

                    {showMarkAsChecked && (
                        <Pressable
                            className="h-12 px-4 flex-row items-center"
                            onPress={onMarkAsChecked}
                        >
                            <View className="w-8">
                                <CheckIcon size={20} color="#1A0F07" />
                            </View>

                            <Text className="text-sm font-geologica-medium text-Base-OnSurface">
                                Mark as checked
                            </Text>
                        </Pressable>
                    )}
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
    const [shouldIdentifyImage, setShouldIdentifyImage] = useState(true);

    const [editingObject, setEditingObject] = useState(null);
    const [editingObjectId, setEditingObjectId] = useState(null);

    const [timeTick, setTimeTick] = useState(Date.now());

    const cardRefs = useRef({});
    const isSavingObjectRef = useRef(false);

    const { setScrolled } = useScroll();
    const { show: showSnackbar } = useSnackbar();

    const handleScroll = (e) => {
        setScrolled(e.nativeEvent.contentOffset.y > 0);
    };

    useFocusEffect(
        useCallback(() => {
            return () => setScrolled(false);
        }, [setScrolled])
    );

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeTick(Date.now());
        }, 10000);

        return () => clearInterval(timer);
    }, []);

    const isOlderThanCheckLimit = useCallback((dateValue) => {
        if (!dateValue) return false;

        const lastUpdatedDate = new Date(dateValue);

        if (Number.isNaN(lastUpdatedDate.getTime())) {
            return false;
        }

        const differenceInMs = Date.now() - lastUpdatedDate.getTime();
        const differenceInMinutes = differenceInMs / (1000 * 60);

        return differenceInMinutes >= CHECK_MINUTES;
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
            };
        },
        [formatDate]
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

    const objectsWithCheckStatus = objects.map((object) => ({
        ...object,
        needsCheck: isOlderThanCheckLimit(object.lastUpdatedAt),
    }));

    const mustCheckObjects = objectsWithCheckStatus.filter(
        (object) => object.needsCheck
    );
    const normalObjects = objectsWithCheckStatus.filter(
        (object) => !object.needsCheck
    );

    const activeMenuObject = objectsWithCheckStatus.find(
        (object) => object.id === activeMenuId
    );
    const activeMenuNeedsCheck = Boolean(activeMenuObject?.needsCheck);

    const enrolledCount = objects.length;
    const objectsToCheckCount = mustCheckObjects.length;
    const isMaxObjectsReached = enrolledCount >= MAX_OBJECTS;
    const canDeleteObject = enrolledCount > MIN_OBJECTS;

    const localPhotoExists = async (imageUri) => {
        if (!imageUri) return false;

        try {
            const filePath = pathFromUri(imageUri);
            return await RNFS.exists(filePath);
        } catch (error) {
            console.warn("[ObjectsScreen] localPhotoExists error:", error?.message);
            return false;
        }
    };

    useEffect(() => {
        const fetchObjects = async () => {
            try {
                const response = await apiClient.get("/api/objects");

                const backendObjects = response.data.data.map((object) =>
                    formatBackendObject(object)
                );

                const validObjects = [];

                for (const object of backendObjects) {
                    const existsOnThisDevice = await localPhotoExists(object.imageUri);

                    if (existsOnThisDevice) {
                        validObjects.push(object);
                    } else {
                        try {
                            await apiClient.delete(`/api/objects/${object.id}`);
                        } catch (deleteError) {
                            console.error(
                                "[ObjectsScreen] delete missing local object error:",
                                deleteError.response?.data || deleteError.message
                            );
                        }
                    }
                }

                await persistObjects(validObjects);
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
        setShouldIdentifyImage(true);
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
        setPendingPhotoUri(objectToEdit.imageUri);
        setShouldIdentifyImage(false);
        closeMenu();

        navigation.setParams({
            editingObjectId: id,
        });

        setShowAddObjectSheet(true);
    };

    const handleEditImagePress = () => {
        if (!editingObjectId) return;

        setShowAddObjectSheet(false);

        navigation.navigate("CameraCapture", {
            editingObjectId,
        });
    };

    const handleDelete = async (id) => {
        if (!canDeleteObject) {
            closeMenu();
            showSnackbar({
                text: "You need at least 10 objects",
                tone: "error",
            });
            return;
        }

        try {
            await apiClient.delete(`/api/objects/${id}`);

            const nextObjects = objects.filter((object) => object.id !== id);

            await persistObjects(nextObjects);

            closeMenu();
            showSnackbar({
                text: "Object deleted",
                tone: "success",
            });
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

            showSnackbar({
                text: "Object marked as checked",
                tone: "success",
            });
            closeMenu();
        } catch (error) {
            console.error(
                "[ObjectsScreen] markAsChecked error:",
                error.response?.data || error.message
            );
        }
    };

    const handleAddPress = () => {
        if (isMaxObjectsReached) {
            showSnackbar({
                text: "You can store up to 20 objects",
                tone: "error",
            });
            return;
        }



        setEditingObject(null);
        setEditingObjectId(null);
        setPendingPhotoUri(null);
        setShouldIdentifyImage(true);

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

    const findDuplicateObjectName = (
        newObjectName,
        currentEditingId = null
    ) => {
        const normalizedNewName = newObjectName
            ?.trim()
            .toLowerCase();

        if (
            !normalizedNewName ||
            normalizedNewName === "object"
        ) {
            return null;
        }

        return (
            objects.find((object) => {
                if (object.id === currentEditingId) {
                    return false;
                }

                const normalizedExistingName = object.objectName
                    ?.trim()
                    .toLowerCase();

                return normalizedExistingName === normalizedNewName;
            }) || null
        );
    };

    const handleSaveObject = async ({ objectName, imageUri }) => {
        if (isSavingObjectRef.current) {
            return;
        }

        isSavingObjectRef.current = true;

        const objectIdToUpdate =
            editingObject?.id ||
            editingObjectId ||
            route?.params?.editingObjectId;

        const trimmedObjectName = objectName?.trim();
        const temporaryId = `temporary-${Date.now()}`;

        setShowAddObjectSheet(false);
        setPendingPhotoUri(null);

        if (!objectIdToUpdate) {
            const temporaryObject = {
                id: temporaryId,
                objectName: trimmedObjectName,
                status: "Saving...",
                date: formatDate(new Date()),
                imageUri,
                lastUpdatedAt: new Date().toISOString(),
            };

            setObjects((currentObjects) => [
                ...currentObjects,
                temporaryObject,
            ]);
        }

        try {
            if (!objectIdToUpdate && objects.length >= MAX_OBJECTS) {
                setObjects((currentObjects) =>
                    currentObjects.filter(
                        (object) => object.id !== temporaryId
                    )
                );

                clearEditState();
                showSnackbar({
                    text: "You can store up to 20 objects",
                    tone: "error",
                });
                return;
            }
            const duplicateObject = findDuplicateObjectName(
                trimmedObjectName,
                objectIdToUpdate
            );

            if (duplicateObject) {
                if (!objectIdToUpdate) {
                    setObjects((currentObjects) =>
                        currentObjects.filter(
                            (object) => object.id !== temporaryId
                        )
                    );
                }

                clearEditState();

                showSnackbar({
                    text: `${duplicateObject.objectName} already exists`,
                    tone: "error",
                });

                return;

            }
            if (objectIdToUpdate) {
                const response = await apiClient.patch(
                    `/api/objects/${objectIdToUpdate}`,
                    {
                        name: trimmedObjectName,
                        localRef: [imageUri],
                        status: "Updated",
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
                showSnackbar({ text: `${trimmedObjectName} is Updated`, tone: "success" });

                return;
            }

            const response = await apiClient.post("/api/onboarding/photo-challenge", {
                name: trimmedObjectName,
                localRef: [imageUri],
            });

            const savedObject = response.data.data;
            const formattedObject = formatBackendObject(savedObject);

            setObjects((currentObjects) => {
                const nextObjects = currentObjects.map((object) =>
                    object.id === temporaryId ? formattedObject : object
                );

                saveStoredObjects(nextObjects).catch((storageError) => {
                    console.warn(
                        "[ObjectsScreen] saveStoredObjects error:",
                        storageError?.message
                    );
                });

                return nextObjects;
            });

            clearEditState();
            showSnackbar({
                text: `${trimmedObjectName} is Added`,
                tone: "success",
            });
        } catch (error) {
            if (!objectIdToUpdate) {
                setObjects((currentObjects) =>
                    currentObjects.filter(
                        (object) => object.id !== temporaryId
                    )
                );
            }

            console.error(
                "[ObjectsScreen] saveObject error:",
                error.response?.data || error.message
            );

            showSnackbar({
                text: "Unable to save object. Please try again.",
                tone: "error",
            });
        }
        finally {
            isSavingObjectRef.current = false;
        }
    };

    return (
        <View className="flex-1 bg-Base-Background">
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />

            <ScrollView
                className="flex-1"
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="px-4 py-6 items-center">
                    <View style={{ width: 328 }}>
                        <Text className="text-[32px] leading-[40px] font-geologica-bold text-Base-OnBackground">
                            Objects
                        </Text>

                        <Text className="text-xs text-Base-OnBackground mt-1">
                            <Text className="font-geologica-bold font-bold text-State-Info">
                                {enrolledCount} / {MAX_OBJECTS}
                            </Text>{" "}
                            Enrolled{" "}
                            <Text className="font-geologica-bold font-bold text-State-Error">
                                ({objectsToCheckCount}
                            </Text>
                            <Text className="text-Base-OnBackground">
                                {" "}
                                objects you need to check)
                            </Text>
                        </Text>
                    </View>
                </View>

                {mustCheckObjects.length > 0 && (
                    <View className="bg-Sunlight-400 px-4 py-6">
                        <Text className="text-base font-geologica-bold font-bold text-Base-OnBackground">
                            Are these objects still near you?
                        </Text>

                        <Text className="text-xs font-geologica-bold text-Base-OnBackground mt-2 mb-4">
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
                                        needsCheck={item.needsCheck}
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
                                needsCheck={item.needsCheck}
                                onMenuPress={() => openMenu(item.id)}
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View className="absolute right-6 z-10" style={{ bottom: 24 }}>
                <Fab
                    onPress={handleAddPress}
                    disabled={isMaxObjectsReached}
                    variant="primary"
                    size="regular"
                />
            </View>

            {activeMenuId && (
                <ObjectMenu
                    position={menuPosition}
                    onClose={closeMenu}
                    onEdit={() => handleEdit(activeMenuId)}
                    onDelete={() => handleDelete(activeMenuId)}
                    onMarkAsChecked={() => handleMarkAsChecked(activeMenuId)}
                    showMarkAsChecked={activeMenuNeedsCheck}
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
                initialName={editingObject?.objectName || ""}
                isEditing={Boolean(editingObjectId)}
                shouldIdentifyImage={shouldIdentifyImage}
                onCancel={handleCancelAddObject}
                onSave={handleSaveObject}
                onImagePress={handleEditImagePress}
            />

        </View>
    );
}