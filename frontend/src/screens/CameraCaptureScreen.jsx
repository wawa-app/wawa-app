import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
    usePhotoOutput,
} from "react-native-vision-camera";
import RNFS from "react-native-fs";

export default function CameraCaptureScreen({ navigation, route }) {
    const [takingPhoto, setTakingPhoto] = useState(false);
    const cameraRef = useRef(null);

    const device = useCameraDevice("back");
    const photoOutput = usePhotoOutput();

    const { hasPermission, requestPermission } = useCameraPermission();
    const editingObjectId = route?.params?.editingObjectId;

    const savePhotoLocally = async (photoPath) => {
        const folderPath = `${RNFS.DocumentDirectoryPath}/wawa_objects`;
        const fileName = `object_${Date.now()}.jpg`;
        const destinationPath = `${folderPath}/${fileName}`;

        const folderExists = await RNFS.exists(folderPath);

        if (!folderExists) {
            await RNFS.mkdir(folderPath);
        }

        const cleanSourcePath = photoPath.startsWith("file://")
            ? photoPath.replace("file://", "")
            : photoPath;

        await RNFS.copyFile(cleanSourcePath, destinationPath);

        return `file://${destinationPath}`;
    };

    const handleTakePhoto = async () => {
        try {
            if (takingPhoto) return;

            if (!photoOutput) {
                Alert.alert("Camera Error", "Photo output is not ready yet.");
                return;
            }

            setTakingPhoto(true);

            if (Platform.OS === "android") {
                const snapshot = await cameraRef.current?.takeSnapshot();
                if (!snapshot) {
                    Alert.alert("Camera Error", "Camera snapshot is not ready yet.");
                    return;
                }

                const snapshotPath = await snapshot.saveToTemporaryFileAsync("jpg", 85);
                const savedPhotoUri = await savePhotoLocally(snapshotPath);

                console.log("[CameraCaptureScreen] saved snapshot uri:", savedPhotoUri);

                if (route?.params?.fromWalkthrough) {
                    navigation.navigate("WalkthroughStep2", {
                        capturedPhotoUri: savedPhotoUri,
                    });
                } else {
                    navigation.navigate("Main", {
                        screen: "Objects",
                        params: {
                            capturedPhotoUri: savedPhotoUri,
                            capturedAt: Date.now(),
                            editingObjectId,
                        },
                    });
                }

                return;
            }

            const photo = await photoOutput.capturePhotoToFile(
                {
                    enableShutterSound: false,
                },
                {
                    onWillBeginCapture: () => {
                        console.log("[CameraCaptureScreen] will begin capture");
                    },
                    onWillCapturePhoto: () => {
                        console.log("[CameraCaptureScreen] will capture photo");
                    },
                    onDidCapturePhoto: () => {
                        console.log("[CameraCaptureScreen] did capture photo");
                    },
                }
            );

            console.log("[CameraCaptureScreen] photo result:", photo);

            if (!photo?.filePath) {
                Alert.alert("Camera Error", "Photo file path was not created.");
                return;
            }

            const savedPhotoUri = await savePhotoLocally(photo.filePath);

            console.log("[CameraCaptureScreen] saved photo uri:", savedPhotoUri);

            // Return to walkthrough if called from walkthrough flow
            if (route?.params?.fromWalkthrough) {
                navigation.navigate("WalkthroughStep2", {
                    capturedPhotoUri: savedPhotoUri,
                });
            } else {
                navigation.navigate("Main", {
                    screen: "Objects",
                    params: {
                        capturedPhotoUri: savedPhotoUri,
                        capturedAt: Date.now(),
                        editingObjectId,
                    },
                });
            }
        } catch (error) {
            console.error("[CameraCaptureScreen] take photo error:", error);

            Alert.alert(
                "Camera Error",
                error?.message || "Could not take the photo."
            );
        } finally {
            setTakingPhoto(false);
        }
    };

    const handleRequestPermission = async () => {
        const permissionGranted = await requestPermission();

        if (!permissionGranted) {
            Alert.alert(
                "Camera Permission Required",
                "Please allow camera access to add an object."
            );
        }
    };

    if (!hasPermission) {
        return (
            <View className="flex-1 bg-black items-center justify-center px-6">
                <Text className="text-white text-[20px] font-geologica-bold text-center mb-4">
                    Camera permission is required
                </Text>

                <Pressable
                    className="bg-white px-6 py-3 rounded-full"
                    onPress={handleRequestPermission}
                >
                    <Text className="text-black text-[16px] font-geologica-medium">
                        Allow Camera
                    </Text>
                </Pressable>
            </View>
        );
    }

    if (!device) {
        return (
            <View className="flex-1 bg-black items-center justify-center">
                <ActivityIndicator color="#FFFFFF" />

                <Text className="text-white mt-4 text-[14px]">
                    Loading camera...
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black">
            <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                outputs={[photoOutput]}
                onInitialized={() => {
                    console.log("[CameraCaptureScreen] Camera initialized");
                }}
                onStarted={() => {
                    console.log("[CameraCaptureScreen] Camera started");
                }}
                onError={(error) => {
                    console.error("[CameraCaptureScreen] Camera error:", error);

                    Alert.alert(
                        "Camera Error",
                        error?.message || "Camera failed to start."
                    );
                }}
            />

            {/* Camera options mock button */}
            <Pressable
                className="absolute right-6 bottom-[135px] w-12 h-12 rounded-full bg-[#82D833] items-center justify-center z-10"
                onPress={() => console.log("Camera options pressed")}
            >
                <Text className="text-white text-[22px] leading-[24px]">
                    ...
                </Text>
            </Pressable>

            {/* Bottom camera button area */}
            <View className="absolute left-0 right-0 bottom-0 h-[118px] bg-[#191919] items-center justify-center z-10">
                <Pressable
                    className="w-[52px] h-[52px] rounded-full bg-white items-center justify-center"
                    onPress={handleTakePhoto}
                    disabled={takingPhoto}
                >
                    {takingPhoto ? (
                        <ActivityIndicator color="#000000" />
                    ) : (
                        <Text className="text-[28px] leading-[32px] text-black">
                            📷
                        </Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
}
