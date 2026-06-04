import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';

const ObjectCard = ({
    objectName,
    date,
    status,
    imageUri,
    onMenuPress,
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                    <View style={styles.imagePlaceholder} />
                )}
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.name}>{objectName}</Text>

                <View style={styles.dateRow}>
                    <Text style={styles.statusIcon}>
                        {status === 'Enrolled' ? '▣' : '↻'}
                    </Text>

                    <Text style={styles.dateText}>
                        {status} {date}
                    </Text>
                </View>
            </View>

            <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
                <Text style={styles.menuText}>⋮</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 328,
        height: 120,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#191919',
        backgroundColor: '#C1C1C1',
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: {
        width: 88,
        height: 88,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#F2F2F2',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F7F7F7',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        flex: 1,
        marginLeft: 16,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 8,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIcon: {
        fontSize: 16,
        marginRight: 8,
        color: '#4A4A4A',
    },
    dateText: {
        fontSize: 14,
        color: '#4A4A4A',
    },
    menuButton: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    menuText: {
        fontSize: 24,
        color: '#000000',
        lineHeight: 24,
    },
});

export default ObjectCard;