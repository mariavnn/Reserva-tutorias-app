import { View, Text } from 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
import Checkbox from 'expo-checkbox'
import { useState } from 'react';

export default function SelectableCard({ label }) {
    const [isChecked, setChecked] = useState(false);

    return (
        <Pressable 
        className="flex-row items-center bg-secondary-light rounded-md px-4 py-3 mb-3 h-20"
        >
        <Checkbox
            value={isChecked}
            onValueChange={setChecked}
            className='bg-white border border-gray-200 rounded-lg' 
        />
        <Text className="ml-2 text-gray-900 font-medium">{label}</Text>
        </Pressable>
    )
}