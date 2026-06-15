//AlarmMenu.jsx
import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { Check } from '../components/icons'

export default function AlarmMenu({ visible, onClose, items = [] }) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* backdrop */}
            <Pressable
                className="flex-1 bg-black/40 justify-center items-center px-10"
                onPress={onClose}
            >
                {/* menu card — w-52 = 208px, rounded-2xl = 16px (Corner-Large) */}
                <Pressable
                    onPress={() => { }}
                    style={{ elevation: 6 }}
                    className="w-52 items-start rounded-2xl bg-white overflow-hidden py-2"
                >
                    {items.map((item, i) => (
                        <Pressable
                            key={i}
                            onPress={item.onPress}
                            className="w-full flex-row items-center gap-3 px-5 py-4 active:bg-black/5"
                        >
                            {item.icon}
                            <Text className="text-base text-black">{item.label}</Text>
                        </Pressable>
                    ))}
                </Pressable>
            </Pressable>
        </Modal>
    )
}