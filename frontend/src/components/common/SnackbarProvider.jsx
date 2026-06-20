import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import Close from '../icons/Close';


const SnackbarContext = createContext(null);

const TONE_COLOR = {
    neutral: '#404040', // gray ← default
    success: '#404040', // green
    error: '#404040',   // red
};

export function useSnackbar() {
    const ctx = useContext(SnackbarContext);
    if (!ctx) {
        throw new Error('useSnackbar must be used inside <SnackbarProvider>');
    }
    return ctx;
}

export function SnackbarProvider({ children }) {
    const [snack, setSnack] = useState(null);
    const timerRef = useRef(null);
    const idRef = useRef(0);

    const clearTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const hide = useCallback(() => {
        clearTimer();
        setSnack(null);
    }, []);

    const show = useCallback((options) => {
        clearTimer();
        const config = typeof options === 'string' ? { text: options } : options;
        const id = ++idRef.current;
        setSnack({ id, ...config });

        const duration = config.duration ?? 4000;
        if (duration !== Infinity) {
            timerRef.current = setTimeout(() => {
                setSnack((curr) => (curr && curr.id === id ? null : curr));
            }, duration);
        }
    }, []);

    return (
        <SnackbarContext.Provider value={{ show, hide }}>
            {children}
            {snack && <SnackbarView key={snack.id} {...snack} onClose={hide} />}
        </SnackbarContext.Provider>
    );
}

function SnackbarView({ text, actionLabel, onAction, showClose, tone, onClose }) {
    const wrapAction = !!actionLabel && actionLabel.length > 10;
    const bgColor = TONE_COLOR[tone] ?? TONE_COLOR.neutral;

    const progress = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(progress, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
        }).start();
    }, [progress]);

    const translateY = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0],
    });

    const handleAction = () => {
        onAction?.();
        onClose();
    };

    const ActionBtn = actionLabel ? (
        <Pressable onPress={handleAction} hitSlop={8}>
            <Text className="text-white font-semibold">{actionLabel}</Text>
        </Pressable>
    ) : null;

    const CloseBtn = showClose ? (
        <Pressable onPress={onClose} hitSlop={8} className="ml-4">
            <Close width={20} height={20} color="#fff" />
        </Pressable>
    ) : null;

    return (
        <Animated.View
            pointerEvents="box-none"
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 160,
                paddingHorizontal: 16,
                opacity: progress,
                transform: [{ translateY }],
            }}
        >
            <View className="px-4 py-3" style={{ backgroundColor: bgColor }}>
                {wrapAction ? (
                    <View>
                        <Text className="text-white text-base">{text}</Text>
                        <View className="mt-3 flex-row items-center justify-end">
                            {ActionBtn}
                            {CloseBtn}
                        </View>
                    </View>
                ) : (
                    <View className="flex-row items-center">
                        <Text className="flex-1 text-white text-base">{text}</Text>
                        {actionLabel ? <View className="ml-4">{ActionBtn}</View> : null}
                        {CloseBtn}
                    </View>
                )}
            </View>
        </Animated.View>
    );
}