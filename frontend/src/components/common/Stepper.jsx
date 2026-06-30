import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const CheckIcon = () => (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
        <Path d="M20 6L9 17L4 12" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// Default 4-step config (general use)
const DEFAULT_STEPS = [
    { label: 'Setting\nCamera' },
    { label: 'Prepare for\nMission' },
    { label: 'Setting\nNotification' },
    { label: 'Setting\nAlarm' },
];

// 3-step config for walkthrough
export const WALKTHROUGH_STEPS = [
    { label: 'Camera' },
    { label: 'Mission\nPreparation' },
    { label: 'Set Alarm' },
];

export default function Stepper({ currentStep = 1, steps = DEFAULT_STEPS }) {
    return (
        <View className="flex-row items-start justify-center self-stretch px-4">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;
                const isLast = index === steps.length - 1;

                return (
                    <React.Fragment key={stepNumber}>
                        {/* Step item */}
                        <View style={{ flex: 2, alignItems: 'center', gap: 8 }}>

                            {/* Circle */}
                            <View
                                style={{
                                    minWidth: 32,
                                    minHeight: 32,
                                    borderRadius: 9999,
                                    backgroundColor: isCompleted ? '#FF8400' : isActive ? '#FF8400' : '#FFE0B2',
                                    borderWidth: isActive || isCompleted ? 0 : 1,
                                    borderColor: '#FFF3CD',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                }}
                            >
                                {isCompleted ? (
                                    <CheckIcon />
                                ) : (
                                    <Text style={{ color: isActive ? '#fff' : '#1A0F07', fontSize: 13, fontWeight: '600' }}>
                                        {stepNumber}
                                    </Text>
                                )}
                            </View>

                            {/* Label */}
                            <Text
                                style={{
                                    color: isActive || isCompleted ? '#FF8400' : '#1A0F07',
                                    textAlign: 'center',
                                    fontSize: 11,
                                    fontWeight: '400',
                                    lineHeight: 16,
                                }}
                            >
                                {step.label}
                            </Text>

                        </View>

                        {/* Connector line */}
                        {!isLast && (
                            <View style={{ flex: 2, height: 2, backgroundColor: isCompleted || isActive ? '#FF8400' : '#FFF3CD', marginTop: 15 }} />
                        )}
                    </React.Fragment>
                );
            })}
        </View>
    );
}
