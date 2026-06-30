import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScroll } from '../../context/ScrollContext';
import { Back } from '../icons';
import Logo from './Logo';

/**
 * AppBar — unified header component
 * - onBack provided → title + back button (child screen)
 * - onBack not provided → logo centered (root screen, replaces StackHeader)
 */
export default function AppBar({ title, onBack }) {
    const insets = useSafeAreaInsets();
    const { scrolled } = useScroll();

    return (
        <View
            style={{
                paddingTop: insets.top + 13,
                paddingBottom: 12,
                paddingHorizontal: onBack ? 16 : 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: onBack ? 'flex-start' : 'center',
                boxShadow: '0px 1px 3px 0px rgba(26, 15, 7, 0.08)',
            }}
            className={scrolled ? 'bg-Base-Surface' : 'bg-Base-Background'}
        >
            {onBack ? (
                <>
                    <Pressable onPress={onBack} hitSlop={8} style={{ marginRight: 16 }}>
                        <Back />
                    </Pressable>
                    <Text
                        style={{
                            flex: 1,
                            color: '#000',
                            fontFamily: 'Geologica-Bold',
                            fontSize: 20,
                            lineHeight: 28,
                        }}
                    >
                        {title}
                    </Text>
                </>
            ) : (
                <Logo width={82} height={32} />
            )}
        </View>
    );
}
