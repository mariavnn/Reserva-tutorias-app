import { View, Text, Modal } from 'react-native'
import React from 'react'
import { useEffect } from 'react';

export default function ConfirmModal({visible, onClose, message}) {
    useEffect(() => {
        if (visible) {
          const timer = setTimeout(() => {
            onClose();
          }, 2000);
    
          return () => clearTimeout(timer);
        }
      }, [visible]);
    
      if (!visible) return null;

    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View className="flex-1 justify-center items-center pb-20 bg-transparent">
            <View className="bg-green-500 px-6 py-3 rounded-lg shadow-md">
                <Text className="text-white font-medium">{message}</Text>
            </View>
            </View>
        </Modal>
    )
}