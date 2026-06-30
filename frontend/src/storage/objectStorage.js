import AsyncStorage from "@react-native-async-storage/async-storage";

export const OBJECTS_STORAGE_KEY = "wawa_objects";

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

export const pickRandomObject = (objects) => {
    if (!objects.length) return null;
    return objects[Math.floor(Math.random() * objects.length)];
};
