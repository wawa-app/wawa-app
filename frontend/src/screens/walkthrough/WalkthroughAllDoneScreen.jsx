import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Mask, Rect, G, Path } from 'react-native-svg';
import Stepper, { WALKTHROUGH_STEPS } from '../../components/common/Stepper';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const CheckIcon = () => (
    <Svg width={72} height={72} viewBox="0 0 72 72" fill="none">
        <Mask id="mask0" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="72" height="72">
            <Rect width="72" height="72" fill="#D9D9D9" />
        </Mask>
        <G mask="url(#mask0)">
            <Path
                d="M18 39L27.5175 48.5175C28.821 49.821 30.9807 49.6515 32.065 48.1606L54 18"
                stroke="#1A0F07"
                strokeWidth="6"
                strokeLinecap="round"
            />
        </G>
    </Svg>
);

export default function WalkthroughAllDoneScreen({ navigation }) {
    const { setIsFirstLogin } = useAuth();

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFBF0' }}>

            {/* Status bar */}
            <View style={{ height: 24 }} />

            {/* Stepper — all steps completed */}
            <View style={{ paddingTop: 24 }}>
                <Stepper currentStep={4} steps={WALKTHROUGH_STEPS} />
            </View>

            {/* gap: 160px */}
            <View style={{ height: 160 }} />

            {/* Check icon in circle frame */}
            <View style={{ alignItems: 'center' }}>
                <View style={{
                    padding: 19,
                    borderRadius: 55,
                    borderWidth: 0.1,
                    borderColor: '#595858',
                    backgroundColor: '#FFE0B2',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <CheckIcon />
                </View>
            </View>

            {/* gap: 24px */}
            <View style={{ height: 24 }} />

            {/* Text content */}
            <Text style={{ height: 33, textAlignVertical: 'center', alignSelf: 'stretch', color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Light', fontSize: 16, lineHeight: 24 }}>
                You're all set!
            </Text>

            <Text style={{ alignSelf: 'stretch', color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Light', fontSize: 16, lineHeight: 24 }}>
                WaWa now is ready for a new challenge
            </Text>

            {/* Bottom spacer */}
            <View style={{ flex: 1 }} />

            {/* Button */}
            <View style={{ paddingHorizontal: 34, paddingBottom: 104 }}>
                <Button
                    title="Go to Home"
                    onPress={() => {
                        setIsFirstLogin(false);
                        navigation.navigate('Main');
                    }}
                    fullWidth
                    shape="square"
                />
            </View>

        </View>
    );
}
