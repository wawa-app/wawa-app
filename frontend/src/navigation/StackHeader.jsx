import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StackHeader() {
    const insets = useSafeAreaInsets()

    return (
        <View
            style={{ paddingTop: insets.top + 13, paddingBottom: 12 }}
            className="flex-row items-center justify-center px-4"
        >
            {/* Logo: tentative placeholder — swap for <Image source={...} /> later */}
            <Text className="text-2xl">WA</Text>
        </View>
    )
}