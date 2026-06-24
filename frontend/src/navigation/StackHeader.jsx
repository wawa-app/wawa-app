import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from '../components/common/Logo';

export default function StackHeader() {
    const insets = useSafeAreaInsets()

    return (
        <View
            style={{ paddingTop: insets.top + 13, paddingBottom: 12 }}
            className="flex-row items-center justify-center px-4"
        >
            <Logo width={100} height={39} />
        </View>
    )
}