import { Pressable, Text } from 'react-native'

export function Button({ label, onPress, disabled = false }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`bg-blue-500 rounded-2xl px-4 py-3 active:bg-blue-600 ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <Text className="text-white text-center font-semibold">{label}</Text>
    </Pressable>
  )
}