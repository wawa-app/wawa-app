import React from 'react';
import { View, Text } from 'react-native';
import Svg, { G, Path, Rect, Mask, Circle } from 'react-native-svg';
import Button from '../../components/common/Button';

// Camera icon (24x24)
const CameraIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Mask id="mask0" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
            <Rect width="24" height="24" fill="#D9D9D9" />
        </Mask>
        <G mask="url(#mask0)">
            <Path d="M17.5 4.5C19.1569 4.5 20.5 5.84315 20.5 7.5V16.5C20.5 18.1569 19.1569 19.5 17.5 19.5H6.5C4.84315 19.5 3.5 18.1569 3.5 16.5V7.5C3.5 5.84315 4.84315 4.5 6.5 4.5H17.5ZM11.917 14.9766C11.5189 15.5734 10.7009 15.7136 10.127 15.2832L7.19336 13.082L5.0498 16.4062C5.03447 16.43 5.01746 16.4522 5 16.4736V16.5C5 17.3284 5.67157 18 6.5 18H17.5L17.6533 17.9922C18.4097 17.9154 19 17.2767 19 16.5V15.2568C18.9088 15.2086 18.8252 15.1424 18.7578 15.0557L15.0469 10.2812L11.917 14.9766ZM6.5 6C5.67157 6 5 6.67157 5 7.5V13.7178L6.0791 12.0449L6.15723 11.9355C6.57399 11.4188 7.33509 11.3141 7.87891 11.7217L10.8154 13.9238L13.9912 9.16113L14.0859 9.03613C14.5574 8.48846 15.4041 8.45778 15.9141 8.96973L16.0176 9.08789L19 12.9229V7.5C19 6.72334 18.4097 6.08461 17.6533 6.00781L17.5 6H6.5Z" fill="#1A0F07" />
        </G>
    </Svg>
);

// Clock icon (24x24)
const ClockIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Mask id="mask1" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
            <Rect width="24" height="24" fill="#D9D9D9" />
        </Mask>
        <G mask="url(#mask1)">
            <Circle cx="12" cy="12.7373" r="5.75" stroke="#1A0F07" strokeWidth="1.5" />
            <Path d="M12 9.18262V13.0001C12 13.2762 12.2239 13.5001 12.5 13.5001H14.1667" stroke="#1A0F07" strokeLinecap="round" />
            <Path d="M16.6582 4C17.8547 4.00004 18.8251 4.95708 18.8252 6.1377C18.8252 7.0177 18.2855 7.77264 17.5156 8.10059C16.733 7.15793 15.6893 6.44066 14.4951 6.05859C14.5375 4.91464 15.4885 4 16.6582 4Z" fill="#1A0F07" />
            <Path d="M7.16602 4C5.96964 4.00017 5.00014 4.95716 5 6.1377C5 7.01781 5.53957 7.77173 6.30957 8.09961C7.09227 7.15724 8.13603 6.44046 9.33008 6.05859C9.28774 4.91463 8.33569 4 7.16602 4Z" fill="#1A0F07" />
        </G>
    </Svg>
);

export default function WalkthroughIntroScreen({ navigation }) {
    return (
        <View style={{ flex: 1, backgroundColor: '#FFFBF0', alignItems: 'center' }}>

            {/* Top spacer */}
            <View style={{ flex: 1 }} />

            {/* Content frame */}
            <View style={{ paddingHorizontal: 34 }}>

                {/* Title */}
                <Text style={{ color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Bold', fontSize: 28, lineHeight: 36, marginBottom: 16 }}>
                    Welcome to WaWa!
                </Text>

                {/* Steps card */}
                <View style={{ backgroundColor: '#FFE0B2', borderRadius: 12, padding: 16, alignSelf: 'stretch' }}>
                    {/* Subtitle */}
                    <Text style={{ width: 296, color: '#1A0F07', textAlign: 'center', fontFamily: 'Geologica-Light', fontSize: 14, lineHeight: 20, alignSelf: 'center' }}>
                        Let's set up our app in just a few single steps
                    </Text>

                    {/* gap: 27.5px */}
                    <View style={{ height: 27.5 }} />

                    {/* Steps - left aligned, icons at same start point */}
                    <View style={{ paddingLeft: 40 }}>
                        {/* Step 1 */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                            <CameraIcon />
                            <Text style={{ color: '#1A0F07', fontFamily: 'Geologica-Light', fontSize: 15 }}>
                                Take  photos of objects
                            </Text>
                        </View>

                        {/* Step 2 */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                            <ClockIcon />
                            <Text style={{ color: '#1A0F07', fontFamily: 'Geologica-Light', fontSize: 15 }}>
                                Set your alarm
                            </Text>
                        </View>
                    </View>
                </View>

            </View>

            {/* Bottom spacer */}
            <View style={{ flex: 1 }} />

            {/* Buttons pinned to bottom */}
            <View style={{ width: '100%', paddingHorizontal: 34, paddingBottom: 104, gap: 8 }}>
                <Button
                    title="Start Walkthrough"
                    onPress={() => navigation.navigate('WalkthroughStep1')}
                    fullWidth
                    shape="square"
                />
                <Button
                    title="Skip"
                    onPress={() => navigation.navigate('Main', { screen: 'Objects' })}
                    fullWidth
                    shape="square"
                    variant="secondary"
                />
            </View>

        </View>
    );
}
