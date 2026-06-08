import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';

export default function AlarmMenu({ visible, onClose, onEdit, onDelete }) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* onClose */}
            <Pressable
                className="flex-1 bg-black/40 justify-center items-center"
                onPress={onClose}
            >
                {/* menu */}
                <Pressable className="bg-white">
                    <Pressable onPress={onEdit} className="py-3">
                        <Text>Edit</Text>
                    </Pressable>
                    <Pressable onPress={onDelete} className="py-3">
                        <Text>Delete</Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    )
}