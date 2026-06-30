import React, { useState } from 'react'
import { Pressable, View } from 'react-native'
import Plus from '../icons/Plus'

const ICON = { regular: 48, small: 24 }

const SHADOW = {
    rest: '0px 8px 16px 0px rgba(26, 15, 7, 0.16)',    // shadow-lg
    pressed: '0px 4px 8px 0px rgba(26, 15, 7, 0.12)',  // shadow-md
}

export default function Fab({
    onPress,
    variant = 'primary',   // 'primary' | 'secondary'
    size = 'regular',      // 'regular' | 'small'
    disabled = false,
}) {
    const [pressed, setPressed] = useState(false)

    const bgClass = disabled
        ? 'bg-State-Disable'
        : variant === 'secondary'
            ? 'bg-Brand-Secondary'
            : 'bg-Brand-Primary'

    const sizeClass = size === 'small' ? 'w-[40px] h-[40px]' : 'w-[56px] h-[56px]'

    return (
        <Pressable
            onPress={disabled ? undefined : onPress}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            disabled={disabled}
        >
            <View
                className={`items-center justify-center rounded-Radius-radius-full ${sizeClass} ${bgClass}`}
                style={{ boxShadow: pressed ? SHADOW.pressed : SHADOW.rest }}
            >
                <Plus size={ICON[size]} />
            </View>
        </Pressable>
    )
}