import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import Stepper, { WALKTHROUGH_STEPS } from '../../components/common/Stepper';
import Button from '../../components/common/Button';

const MAX_PHOTOS = 10;

const XIcon = () => (
    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
        <Path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
);

export default function WalkthroughStep2Screen({ navigation, route }) {
    const [photos, setPhotos] = useState([]);

    // Receive photo from CameraCaptureScreen
    useFocusEffect(
        useCallback(() => {
            const capturedUri = route.params?.capturedPhotoUri;
            if (capturedUri && photos.length < MAX_PHOTOS) {
                setPhotos(prev => {
                    // Avoid duplicates
                    if (prev.find(p => p.uri === capturedUri)) return prev;
                    return [...prev, { uri: capturedUri, id: Date.now().toString() }];
                });
                // Clear param after use
                navigation.setParams({ capturedPhotoUri: null });
            }
        }, [route.params?.capturedPhotoUri])
    );

    const handleTakePhoto = () => {
        if (photos.length >= MAX_PHOTOS) return;
        navigation.navigate('CameraCapture', { fromWalkthrough: true });
    };

    const handleRemovePhoto = (id) => {
        setPhotos(prev => prev.filter(p => p.id !== id));
    };

    const handleNextStep = () => {
        if (photos.length < MAX_PHOTOS) {
            Alert.alert('Not enough photos', `Please take ${MAX_PHOTOS - photos.length} more photo(s).`);
            return;
        }
        navigation.navigate('WalkthroughStep3', { photos: photos.map(p => p.uri) });
    };

    const isDone = photos.length >= MAX_PHOTOS;

    // Build grid items: filled photos + empty slots up to MAX_PHOTOS
    const gridItems = [
        ...photos,
        ...Array(Math.max(0, MAX_PHOTOS - photos.length)).fill(null).map((_, i) => ({
            id: `empty_${i}`,
            uri: null,
        })),
    ];

    const renderItem = ({ item }) => (
        <View
            style={{
                flex: 1,
                aspectRatio: 1,
                margin: 8,
                borderRadius: 8,
                backgroundColor: '#D9D9D9',
                overflow: 'hidden',
            }}
        >
            {item.uri && (
                <TouchableOpacity
                    onPress={() => handleRemovePhoto(item.id)}
                    style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: '#000',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                    }}
                >
                    <XIcon />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View className="flex-1 bg-white">

            {/* Status bar */}
            <View className="h-6" />

            {/* Header zone */}
            <View className="h-16" />

            {/* Stepper */}
            <Stepper currentStep={2} steps={WALKTHROUGH_STEPS} />

            {/* gap: 17px */}
            <View className="h-[17px]" />

            {/* Content */}
            <View className="px-8">

                {/* Title */}
                <Text className="text-[24px] font-bold text-black text-center leading-[24px]">
                    Mission Preparation
                </Text>

                {/* gap: 8px */}
                <View className="h-[8px]" />

                {/* Subtitle */}
                <Text className="text-[14px] font-normal text-black text-center leading-[14px]">
                    Take 10 photos of objects where you typically wake up
                </Text>

                {/* gap: 8px */}
                <View className="h-[8px]" />

                {/* Counter */}
                <Text className="text-[14px] font-normal text-black text-center leading-[14px]">
                    {photos.length}/{MAX_PHOTOS}
                </Text>

            </View>

            {/* gap: 30px */}
            <View className="h-[30px]" />

            {/* Photo grid */}
            <FlatList
                data={gridItems}
                keyExtractor={(item) => item.id}
                numColumns={2}
                scrollEnabled={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                renderItem={renderItem}
            />

            {/* Bottom spacer */}
            <View className="flex-1" />

            {/* Button */}
            <View className="w-[296px] self-center pb-[101px]">
                {isDone ? (
                    <Button title="Next Step" onPress={handleNextStep} fullWidth />
                ) : (
                    <Button title="Take Photo" onPress={handleTakePhoto} fullWidth />
                )}
            </View>

        </View>
    );
}
