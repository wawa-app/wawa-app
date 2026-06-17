import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../api/client";

export const OBJECTS_STORAGE_KEY = "wawa_objects";

export const formatStoredObject = (object) => ({
    id: object._id || object.id,
    objectName: object.name || object.objectName || "Saved object",
    imageUri: object.localRef?.[0] || object.imageUri || null,
});

export const loadStoredObjects = async () => {
    const savedObjects = await AsyncStorage.getItem(OBJECTS_STORAGE_KEY);
    if (!savedObjects) return [];

    const parsed = JSON.parse(savedObjects);
    return Array.isArray(parsed) ? parsed : [];
};

export const saveStoredObjects = async (objects) => {
    await AsyncStorage.setItem(OBJECTS_STORAGE_KEY, JSON.stringify(objects));
};

export const getStoredObjectsWithImages = async () => {
    const objects = await loadStoredObjects();
    return objects.filter((object) => object?.imageUri);
};

export const getBackendObjectsWithImages = async () => {
    const response = await apiClient.get("/api/objects");
    const objects = Array.isArray(response.data?.data) ? response.data.data : [];

    return objects
        .map(formatStoredObject)
        .filter((object) => object?.imageUri);
};

export const getChallengeObjectsWithImages = async () => {
    try {
        const backendObjects = await getBackendObjectsWithImages();
        if (backendObjects.length) return backendObjects;
    } catch (error) {
        console.warn(
            "[objectStorage] backend object fetch failed:",
            error.response?.data || error.message
        );
    }

    return getStoredObjectsWithImages();
};

export const pickRandomObject = (objects) => {
    if (!objects.length) return null;
    return objects[Math.floor(Math.random() * objects.length)];
};
