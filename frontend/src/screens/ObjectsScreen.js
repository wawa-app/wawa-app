import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';

import ObjectCard from '../components/ObjectCard';

const mockObjects = [
    {
        id: '1',
        objectName: 'Coffee Mug',
        status: 'Enrolled',
        date: '2026/04/01',
        imageUri: null,
    },
    {
        id: '2',
        objectName: 'Coffee Mug',
        status: 'Updated',
        date: '2026/04/01',
        imageUri: null,
    },
    {
        id: '3',
        objectName: 'Coffee Mug',
        status: 'Updated',
        date: '2026/04/01',
        imageUri: null,
    },
];

const ObjectsScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.screen}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Top status/header mock area */}
                    <View style={styles.topBar}>
                        <Text style={styles.timeText}>9:30</Text>
                        <View style={styles.cameraCutout} />
                        <Text style={styles.statusIcons}>◢ ▮</Text>
                    </View>

                    {/* App header */}
                    <View style={styles.appHeader}>
                        <Text style={styles.appTitle}>WaWa</Text>
                    </View>

                    {/* Page title section */}
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>Objects</Text>
                        <Text style={styles.subtitle}>
                            <Text style={styles.subtitleBold}>12 / 20</Text> Enrolled (2
                            objects you need to check)
                        </Text>
                    </View>

                    {/* Must check section */}
                    <View style={styles.mustCheckSection}>
                        <Text style={styles.sectionTitle}>
                            Are these objects still near you?
                        </Text>

                        <Text style={styles.sectionDescription}>
                            It looks like it's been over a month since the last update.
                        </Text>

                        <View style={styles.cardsContainer}>
                            {mockObjects.slice(0, 2).map(item => (
                                <ObjectCard
                                    key={item.id}
                                    objectName={item.objectName}
                                    status={item.status}
                                    date={item.date}
                                    imageUri={item.imageUri}
                                    onMenuPress={() => console.log('Menu pressed:', item.id)}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Normal objects list */}
                    <View style={styles.allObjectsSection}>
                        {mockObjects.slice(2).map(item => (
                            <ObjectCard
                                key={item.id}
                                objectName={item.objectName}
                                status={item.status}
                                date={item.date}
                                imageUri={item.imageUri}
                                onMenuPress={() => console.log('Menu pressed:', item.id)}
                            />
                        ))}
                    </View>
                </ScrollView>

                {/* Floating add button */}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => console.log('Add object pressed')}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>

                {/* Bottom navigation mock */}
                <View style={styles.bottomNav}>
                    <View style={styles.navItem}>
                        <Text style={styles.navIcon}>☆</Text>
                        <Text style={styles.navLabel}>Alarm</Text>
                    </View>

                    <View style={styles.navItem}>
                        <View style={styles.activeNavIconWrapper}>
                            <Text style={styles.activeNavIcon}>★</Text>
                        </View>
                        <Text style={styles.navLabel}>Objects</Text>
                    </View>

                    <View style={styles.navItem}>
                        <Text style={styles.navIcon}>☆</Text>
                        <Text style={styles.navLabel}>Tracking</Text>
                    </View>

                    <View style={styles.navItem}>
                        <Text style={styles.navIcon}>☆</Text>
                        <Text style={styles.navLabel}>Profile</Text>
                    </View>
                </View>

                <View style={styles.bottomBlackBar} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    screen: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        position: 'relative',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 145,
    },

    topBar: {
        height: 48,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    timeText: {
        fontSize: 14,
        color: '#000000',
    },
    cameraCutout: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#101010',
    },
    statusIcons: {
        fontSize: 16,
        color: '#101010',
    },

    appHeader: {
        height: 52,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    appTitle: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '700',
    },

    titleSection: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 24,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 36,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#000000',
    },
    subtitleBold: {
        fontWeight: '700',
    },

    mustCheckSection: {
        backgroundColor: '#D9D9D9',
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 8,
    },
    sectionDescription: {
        fontSize: 14,
        color: '#000000',
        marginBottom: 16,
    },
    cardsContainer: {
        gap: 16,
        alignItems: 'center',
    },

    allObjectsSection: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingTop: 24,
        gap: 16,
        alignItems: 'center',
    },

    addButton: {
        position: 'absolute',
        right: 24,
        bottom: 118,
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: '#101010',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 36,
        lineHeight: 38,
        fontWeight: '300',
    },

    bottomNav: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 32,
        height: 76,
        backgroundColor: '#D9D9D9',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: 6,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        flex: 1,
    },
    navIcon: {
        fontSize: 26,
        color: '#4A4A4A',
    },
    activeNavIconWrapper: {
        width: 64,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#EBDDF8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeNavIcon: {
        fontSize: 24,
        color: '#4A4A4A',
    },
    navLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4A4A4A',
    },
    bottomBlackBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 32,
        backgroundColor: '#000000',
    },
});

export default ObjectsScreen;