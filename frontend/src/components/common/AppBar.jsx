import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScroll } from '../../context/ScrollContext';
import { Back } from '../icons';

/**
 * AppBar — Child variant
 * Matches StackHeader style: bg-Base-Surface on scroll, bg-Base-Background flat
 */
export default function AppBar({ title, onBack }) {
    const insets = useSafeAreaInsets();
    const { scrolled } = useScroll();

    return (
        <View
            style={{
                paddingTop: insets.top + 13,
                paddingBottom: 12,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
                boxShadow: '0px 1px 3px 0px rgba(26, 15, 7, 0.08)',
            }}
            className={scrolled ? 'bg-Base-Surface' : 'bg-Base-Background'}
        >
            <Pressable onPress={onBack} hitSlop={8} style={{ marginRight: 16 }}>
                <Back />
            </Pressable>

            <Text
                style={{
                    flex: 1,
                    color: '#000',
                    fontFamily: 'Geologica',
                    fontSize: 20,
                    fontWeight: '700',
                    lineHeight: 28,
                }}
            >
                {title}
            </Text>
        </View>
    );
}
