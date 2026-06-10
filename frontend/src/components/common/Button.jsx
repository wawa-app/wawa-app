import { Pressable, Text } from 'react-native'

export default function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    fullWidth = false,
}) {
    const variants = {
        primary: 'bg-black',
        secondary: 'bg-gray-300',
        outline: 'border border-gray-400 bg-transparent',
    }
    const textColor = {
        primary: 'text-white',
        secondary: 'text-gray-900',
        outline: 'text-gray-900',
    }
    const sizes = {
        xsmall: 'h-8 px-3',
        small: 'h-10 px-4',
        medium: 'h-14 px-6',
    }
    const textSizes = {
        xsmall: 'text-sm',
        small: 'text-sm',
        medium: 'text-base',
    }

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            className={`
                rounded-2xl
                justify-center
                items-center
                ${sizes[size]}
                ${variants[variant]}
                ${fullWidth ? 'w-full' : ''}
                ${disabled ? 'opacity-50' : ''}
            `}
        >
            <Text className={`text-base ${textColor[variant]}`}>
                {title}
            </Text>
        </Pressable>
    )
}