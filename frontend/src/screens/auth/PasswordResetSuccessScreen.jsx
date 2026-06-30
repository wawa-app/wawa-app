import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Rect, Mask, G } from 'react-native-svg';
import Button from '../../components/common/Button';

const CheckIcon = () => (
    <Svg width={72} height={72} viewBox="0 0 72 72" fill="none">
        <Mask id="mask0" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="72" height="72">
            <Rect width={72} height={72} fill="#D9D9D9" />
        </Mask>
        <G mask="url(#mask0)">
            <Path
                d="M18 39L27.5175 48.5175C28.821 49.821 30.9807 49.6515 32.065 48.1606L54 18"
                stroke="#1A0F07"
                strokeWidth={6}
                strokeLinecap="round"
            />
        </G>
    </Svg>
);

export default function PasswordResetSuccessScreen({ navigation }) {
    return (
        <View style={{ flex: 1, backgroundColor: '#FFFBF0', alignItems: 'center' }}>

            {/* Top spacer */}
            <View style={{ flex: 1 }} />

            {/* Circle with checkmark */}
            <View style={{ padding: 19, borderRadius: 55, borderWidth: 0.1, borderColor: '#595858', backgroundColor: '#FFE0B2', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                <CheckIcon />
            </View>

            {/* Text */}
            <View style={{ width: 231, flexDirection: 'column', justifyContent: 'center', flexShrink: 0, alignSelf: 'center' }}>
                <Text style={{ color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Light', fontSize: 16, lineHeight: 24 }}>
                    Your Password was Reset Successfully
                </Text>
            </View>

            {/* Bottom spacer */}
            <View style={{ flex: 1 }} />

            {/* Button */}
            <View style={{ width: 292, alignSelf: 'center', paddingBottom: 104 }}>
                <Button
                    title="Back to Sign In"
                    onPress={() => navigation.navigate('SignIn')}
                    fullWidth
                    shape="square"
                />
            </View>

        </View>
    );
}
