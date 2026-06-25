import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from '../components/common/Logo';
import { useScroll } from '../context/ScrollContext';

export default function StackHeader() {
    const insets = useSafeAreaInsets()
    const { scrolled } = useScroll()

    return (
        <View
            style={{ paddingTop: insets.top + 13, paddingBottom: 12 }}
            className={`flex-col items-center justify-center ${scrolled ? 'bg-Base-Surface' : 'bg-Base-Background'
                }`}
        >
            <Logo width={82} height={32} />
        </View>
    )
}