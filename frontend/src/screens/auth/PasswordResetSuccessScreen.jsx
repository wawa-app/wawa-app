import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Button from '../../components/common/Button';

const CheckIcon = () => (
    <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
        <Path
            d="M5 13l4 4L19 7"
            stroke="#1A0F07"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default function PasswordResetSuccessScreen({ navigation }) {
    return (
        <View style={{ flex: 1, backgroundColor: '#FFFBF0', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>

            {/* Circle with checkmark */}
            <View style={{ width: 110, height: 110, borderRadius: 55, backgroundColor: '#FFE0B2', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <CheckIcon />
            </View>

            {/* Title */}
            <Text style={{ width: 231, color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Light', fontSize: 16, lineHeight: 24, alignSelf: 'center', flexShrink: 0, marginBottom: 64 }}>
                Your Password was Reset Successfully
            </Text>

            {/* Button */}
            <View style={{ width: 292, alignSelf: 'center' }}>
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
