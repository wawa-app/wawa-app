import { useState } from 'react'
import { Pressable, Text } from 'react-native'

export default function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    shape = 'square',
    disabled = false,
    fullWidth = true,
}) {
    const [pressed, setPressed] = useState(false)

    const variants = {
        primary: { base: 'bg-Brand-Primary', pressed: 'bg-Uni-700', text: 'text-Base-OnPrimary' },
        secondary: { base: 'bg-Brand-Secondary', pressed: 'bg-Sunlight-800', text: 'text-Base-OnSecondary' },
        filled: { base: 'bg-Brand-Primary', pressed: 'bg-Uni-700', text: 'text-Base-OnPrimary' },
        tonal: { base: 'bg-Brand-Secondary', pressed: 'bg-Sunlight-800', text: 'text-Base-OnSecondary' },
        outline: { base: 'border border-Neutral-Gray-400 bg-transparent', pressed: 'border border-Brand-Primary bg-Uni-50', text: 'text-Base-OnSurface' },
        text: { base: 'bg-transparent', pressed: 'bg-Uni-50', text: 'text-Brand-Primary' },
        'text-variant': { base: 'bg-transparent', pressed: 'bg-Neutral-Gray-300', text: 'text-Base-OnSurface' },
    }

    const sizes = {
        xsmall: 'py-1.5 px-3',   // padding 6px 12px
        small: 'py-2.5 px-4',    // padding 10px 16px
        medium: 'py-4 px-6',     // padding 16px 24px
    }
    const textSizes = {
        xsmall: 'text-label-small font-geologica-medium',   // 11px
        small: 'text-label-large font-geologica-medium',    // 14px
        medium: 'text-label-large font-geologica-bold',     // 14px
    }
    const shapeStyle = {
        round: 'rounded-full',
        square: 'rounded-2xl',
    }

    const v = variants[variant] ?? variants.primary
    const bgClass = disabled ? 'bg-Neutral-Gray-300' : pressed ? v.pressed : v.base
    const textClass = disabled ? 'text-State-Disable' : v.text

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            className={`
                flex-row justify-center items-center
                ${sizes[size]}
                ${shapeStyle[shape]}
                ${fullWidth ? 'w-full' : ''}
                ${bgClass}
            `}
        >
            <Text className={`${textSizes[size]} ${textClass}`}>
                {title}
            </Text>
        </Pressable>
    )
}