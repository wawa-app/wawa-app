import React, { useEffect, useRef, useState } from 'react'
import { Pressable, View, Animated } from 'react-native'

export default function Toggle({ value, onValueChange }) {
    const anim = useRef(new Animated.Value(value ? 1 : 0)).current
    const [pressed, setPressed] = useState(false)

    useEffect(() => {
        Animated.timing(anim, {
            toValue: value ? 1 : 0,
            duration: 150,
            useNativeDriver: true,
        }).start()
    }, [value, anim])

    const translateX = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 32],
    })

    return (
        <Pressable
            onPress={() => onValueChange(!value)}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            hitSlop={8}
        >
            <View
                className={`${value ? 'bg-Brand-Primary' : 'bg-State-Disable'}`}
                style={{ width: 56, height: 24, borderRadius: 24, paddingHorizontal: 2, justifyContent: 'center' }}
            >
                <Animated.View
                    style={{ width: 20, height: 20, transform: [{ translateX }] }}
                >
                    {pressed && (
                        <View
                            style={{
                                position: 'absolute',
                                top: -10,
                                left: -10,
                                width: 40,
                                height: 40,
                                borderRadius: 100,
                                backgroundColor: value ? 'rgba(255,109,0,0.20)' : 'rgba(97,97,97,0.10)',
                            }}
                        />
                    )}
                    <View
                        className="bg-Neutral-brandWarm-50"
                        style={{ width: 20, height: 20, borderRadius: 24 }}
                    />
                </Animated.View>
            </View>
        </Pressable>
    )
}