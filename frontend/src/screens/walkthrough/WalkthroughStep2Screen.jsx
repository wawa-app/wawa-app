import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Stepper, { WALKTHROUGH_STEPS } from '../../components/common/Stepper';
import Button from '../../components/common/Button';
import AddObjectSheet from '../../components/objects/AddObjectSheet';
import apiClient from '../../api/client';

const MAX_PHOTOS = 10;

// Module-level callback so CameraCapture can pass the URI back
// without creating a new WalkthroughStep2 screen instance
let _onPhotoCaptured = null;
export const registerPhotoCapturedCallback = (cb) => { _onPhotoCaptured = cb; };
export const dispatchPhotoCaptured = (uri) => { _onPhotoCaptured?.(uri); };

const XIcon = () => (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
        <Path d="M1.66062 0.300853C1.28073 -0.100024 0.664811 -0.100024 0.284922 0.300853C-0.094967 0.701731 -0.094967 1.35168 0.284922 1.75256L0.972772 1.02671L1.66062 0.300853ZM11.5986 13.6913C11.9785 14.0922 12.5944 14.0922 12.9743 13.6913C13.3542 13.2905 13.3542 12.6405 12.9743 12.2396L12.2865 12.9655L11.5986 13.6913ZM0.284922 12.2396C-0.094967 12.6405 -0.094967 13.2905 0.284922 13.6913C0.664811 14.0922 1.28073 14.0922 1.66062 13.6913L0.972772 12.9655L0.284922 12.2396ZM12.9743 1.75256C13.3542 1.35168 13.3542 0.701731 12.9743 0.300853C12.5944 -0.100024 11.9785 -0.100024 11.5986 0.300853L12.2865 1.02671L12.9743 1.75256ZM0.972772 1.02671L0.284922 1.75256L11.5986 13.6913L12.2865 12.9655L12.9743 12.2396L1.66062 0.300853L0.972772 1.02671ZM0.972772 12.9655L1.66062 13.6913L12.9743 1.75256L12.2865 1.02671L11.5986 0.300853L0.284922 12.2396L0.972772 12.9655Z" fill="#1A0F07" />
    </Svg>
);

const CircleBg = () => (
    <Svg width={24} height={25.326} viewBox="0 0 24 26" fill="none">
        <Path d="M24 12.663C24 19.633 18.627 25.326 12 25.326C5.373 25.326 0 19.633 0 12.663C0 5.693 5.373 0 12 0C18.627 0 24 5.693 24 12.663Z" fill="#FFF8E1" />
    </Svg>
);

export default function WalkthroughStep2Screen({ navigation }) {
    const [photos, setPhotos] = useState([]);
    const [pendingPhotoUri, setPendingPhotoUri] = useState(null);
    const [showAddSheet, setShowAddSheet] = useState(false);

    // Register callback so CameraCapture can deliver URIs to THIS instance
    useEffect(() => {
        registerPhotoCapturedCallback((uri) => {
            setPendingPhotoUri(uri);
            setShowAddSheet(true);
        });
        return () => registerPhotoCapturedCallback(null);
    }, []);

    const handleTakePhoto = () => {
        if (photos.length >= MAX_PHOTOS) return;
        navigation.navigate('CameraCapture', { fromWalkthrough: true });
    };

    const handleRemovePhoto = (id) => {
        setPhotos(prev => prev.filter(p => p.id !== id));
    };

    const handleCancelAddSheet = () => {
        setShowAddSheet(false);
        setPendingPhotoUri(null);
    };

    const handleSavePhoto = async ({ objectName, imageUri }) => {
        if (photos.length >= MAX_PHOTOS) {
            setShowAddSheet(false);
            setPendingPhotoUri(null);
            return;
        }
        let savedId = null;
        try {
            const res = await apiClient.post('/api/onboarding/photo-challenge', {
                name: objectName,
                localRef: [imageUri],
            });
            savedId = res.data?.data?._id ?? null;
        } catch (err) {
            console.error('[WalkthroughStep2] save object error:', err?.response?.data || err.message);
        }
        setPhotos(prev => [
            ...prev,
            { id: savedId || Date.now().toString(), uri: imageUri, label: objectName },
        ]);
        setShowAddSheet(false);
        setPendingPhotoUri(null);
    };

    const handleNextStep = () => {
        if (photos.length < MAX_PHOTOS) {
            Alert.alert('Not enough photos', `Please take ${MAX_PHOTOS - photos.length} more photo(s).`);
            return;
        }
        navigation.navigate('WalkthroughStep3', { photos: photos.map(p => ({ id: p.id, uri: p.uri, label: p.label })) });
    };

    const isDone = photos.length >= MAX_PHOTOS;

    const CELL_SIZE = 114;

    const gridItems = [
        ...photos,
        ...Array(Math.max(0, MAX_PHOTOS - photos.length)).fill(null).map((_, i) => ({
            id: `empty_${i}`,
            uri: null,
        })),
    ];

    // Pair items into rows of 2
    const rows = [];
    for (let i = 0; i < gridItems.length; i += 2) {
        rows.push(gridItems.slice(i, i + 2));
    }

    const renderCell = (item, colIndex = 0) => (
        <View
            key={item.id}
            style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                marginLeft: colIndex === 1 ? 8 : 0,
                borderRadius: 16,
                borderWidth: 0.2,
                borderColor: '#939393',
                backgroundColor: '#FFFBF0',
                overflow: 'hidden',
            }}
        >
            {item.uri && (
                <>
                    <Image
                        source={{ uri: item.uri }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                    />
                    {item.label ? (
                        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 4, paddingVertical: 2 }}>
                            <Text style={{ color: '#fff', fontSize: 9, fontFamily: 'Geologica-Regular', textAlign: 'center' }} numberOfLines={1}>{item.label}</Text>
                        </View>
                    ) : null}
                    <TouchableOpacity
                        onPress={() => handleRemovePhoto(item.id)}
                        style={{
                            position: 'absolute',
                            top: 6,
                            right: 6,
                            width: 24,
                            height: 26,
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                        }}
                    >
                        <CircleBg />
                        <View style={{ position: 'absolute' }}>
                            <XIcon />
                        </View>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFBF0' }}>

            <View className="h-6" />
            <View className="h-16" />

            <Stepper currentStep={2} steps={WALKTHROUGH_STEPS} />

            <View style={{ height: 24 }} />

            <View style={{ paddingHorizontal: 32 }}>
                <Text style={{ color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Bold', fontSize: 24, lineHeight: 32 }}>
                    Get Ready
                </Text>
                <View style={{ height: 8 }} />
                <View style={{ width: 277, height: 40, justifyContent: 'center', alignSelf: 'center' }}>
                    <Text style={{ color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Light', fontSize: 14, lineHeight: 20 }}>
                        Take 10 photos of objects where you typically wake up
                    </Text>
                </View>
                <View style={{ height: 8 }} />
                <Text style={{ color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Medium', fontSize: 12, lineHeight: 16, letterSpacing: 0.06 }}>
                    {photos.length}/{MAX_PHOTOS}
                </Text>
            </View>

            <View style={{ height: 16 }} />

            {/* Photo grid: 261×378, gap 8, scrollable */}
            <View style={{ width: 261, height: 378, alignSelf: 'center' }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {rows.map((row, rowIndex) => (
                        <View
                            key={rowIndex}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginBottom: rowIndex < rows.length - 1 ? 8 : 0,
                            }}
                        >
                            {row.map((item, colIndex) => renderCell(item, colIndex))}
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View className="flex-1" />

            <View style={{ width: 292, alignSelf: 'center', paddingBottom: 104 }}>
                {isDone ? (
                    <Button title="Next Step" onPress={handleNextStep} fullWidth />
                ) : (
                    <Button title="Take Photo" onPress={handleTakePhoto} fullWidth />
                )}
            </View>

            <AddObjectSheet
                visible={showAddSheet}
                imageUri={pendingPhotoUri}
                onCancel={handleCancelAddSheet}
                onSave={handleSavePhoto}
            />

        </View>
    );
}
