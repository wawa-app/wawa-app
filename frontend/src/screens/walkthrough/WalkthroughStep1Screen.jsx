import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import Stepper, { WALKTHROUGH_STEPS } from '../../components/common/Stepper';
import Button from '../../components/common/Button';

import { Mask, Rect, Circle } from 'react-native-svg';

const ListIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Mask id="m1" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
            <Rect width="24" height="24" fill="#D9D9D9" />
        </Mask>
        <G mask="url(#m1)">
            <Path d="M6 17H18" stroke="#1A0F07" strokeWidth="2" strokeLinecap="round" />
            <Path d="M6 12H18" stroke="#1A0F07" strokeWidth="2" strokeLinecap="round" />
            <Path d="M9 7L18 7" stroke="#1A0F07" strokeWidth="2" strokeLinecap="round" />
            <Circle cx="6" cy="7" r="1" fill="#1A0F07" />
        </G>
    </Svg>
);

const ScanIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Mask id="m2" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
            <Rect width="24" height="24" fill="#D9D9D9" />
        </Mask>
        <G mask="url(#m2)">
            <Path d="M3.80762 8.76709V5.25977C3.80762 4.98362 4.03147 4.75977 4.30762 4.75977H7.80762" stroke="#1A0F07" strokeWidth="1.5" strokeLinecap="round" />
            <Path d="M20.2422 8.76709V5.25977C20.2422 4.98362 20.0183 4.75977 19.7422 4.75977H16.2422" stroke="#1A0F07" strokeWidth="1.5" strokeLinecap="round" />
            <Path d="M20.2422 15.5698V19.0771C20.2422 19.3533 20.0183 19.5771 19.7422 19.5771H16.2422" stroke="#1A0F07" strokeWidth="1.5" strokeLinecap="round" />
            <Path d="M3.80762 15.5698V19.0771C3.80762 19.3533 4.03147 19.5771 4.30762 19.5771H7.80762" stroke="#1A0F07" strokeWidth="1.5" strokeLinecap="round" />
            <Path d="M3 12H21" stroke="#1A0F07" strokeWidth="1.5" strokeLinecap="round" />
        </G>
    </Svg>
);

const ImageIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Mask id="m3" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
            <Rect width="24" height="24" fill="#D9D9D9" />
        </Mask>
        <G mask="url(#m3)">
            <Path d="M17.5 4.5C19.1569 4.5 20.5 5.84315 20.5 7.5V16.5C20.5 18.1569 19.1569 19.5 17.5 19.5H6.5C4.84315 19.5 3.5 18.1569 3.5 16.5V7.5C3.5 5.84315 4.84315 4.5 6.5 4.5H17.5ZM11.917 14.9766C11.5189 15.5734 10.7009 15.7136 10.127 15.2832L7.19336 13.082L5.0498 16.4062C5.03447 16.43 5.01746 16.4522 5 16.4736V16.5C5 17.3284 5.67157 18 6.5 18H17.5L17.6533 17.9922C18.4097 17.9154 19 17.2767 19 16.5V15.2568C18.9088 15.2086 18.8252 15.1424 18.7578 15.0557L15.0469 10.2812L11.917 14.9766ZM6.5 6C5.67157 6 5 6.67157 5 7.5V13.7178L6.0791 12.0449L6.15723 11.9355C6.57399 11.4188 7.33509 11.3141 7.87891 11.7217L10.8154 13.9238L13.9912 9.16113L14.0859 9.03613C14.5574 8.48846 15.4041 8.45778 15.9141 8.96973L16.0176 9.08789L19 12.9229V7.5C19 6.72334 18.4097 6.08461 17.6533 6.00781L17.5 6H6.5Z" fill="#1A0F07" />
        </G>
    </Svg>
);

const TIPS = [
    { icon: <ListIcon />, text: 'Keep object in place' },
    { icon: <ScanIcon />, text: 'Ensure that you have good lightening' },
    { icon: <ImageIcon />, text: 'Keep the objects within a frame' },
];

export default function WalkthroughStep1Screen({ navigation }) {
    return (
        <View style={{ flex: 1, backgroundColor: '#FFFBF0' }}>

            {/* Status bar */}
            <View style={{ height: 24 }} />

            {/* Stepper */}
            <View style={{ paddingTop: 24 }}>
                <Stepper currentStep={1} steps={WALKTHROUGH_STEPS} />
            </View>

            {/* gap: 24px */}
            <View style={{ height: 24 }} />

            {/* Content frame */}
            <View style={{ paddingHorizontal: 16 }}>

                {/* Title */}
                <Text style={{ color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Bold', fontSize: 24, lineHeight: 32 }}>
                    Let's prepare for mission
                </Text>

                {/* gap: 9px */}
                <View style={{ height: 9 }} />

                {/* Subtitle */}
                <Text style={{ color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Light', fontSize: 14, lineHeight: 20 }}>
                    Take 10 photos of your objects
                </Text>


                {/* gap: 40px */}
                <View style={{ height: 40 }} />

                {/* Tips card */}
                <View style={{ borderRadius: 12, paddingHorizontal: 16, paddingVertical: 24, gap: 32, backgroundColor: '#FFE0B2' }}>

                    {/* Tips title */}
                    <Text style={{ color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Bold', fontSize: 20, lineHeight: 28 }}>
                        Tips for capture
                    </Text>

                    {/* Tip items */}
                    {TIPS.map((tip, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                            {tip.icon}
                            <Text style={{ flex: 1, color: '#1A0F07', fontFamily: 'Geologica-Light', fontSize: 15 }}>
                                {tip.text}
                            </Text>
                        </View>
                    ))}
                </View>

            </View>

            {/* Bottom spacer */}
            <View style={{ flex: 1 }} />

            {/* Button pinned to bottom */}
            <View style={{ paddingHorizontal: 34, paddingBottom: 104 }}>
                <Button
                    title="Go to Setting"
                    onPress={() => navigation.navigate('WalkthroughStep2')}
                    fullWidth
                    shape="square"
                />
            </View>

        </View>
    );
}
