import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Pressable } from 'react-native'
import Checkbox from 'expo-checkbox'
import { useState } from 'react';

export default function SelectableCard({ label, value = [], onChange }) {
    const [isChecked, setChecked] = useState(value.includes(label))

    const toggleChecked = () => {
        const newChecked = !isChecked
        setChecked(newChecked)
        if (newChecked) {
          onChange([...value, label]) 
        } else {
          onChange(value.filter(item => item !== label)) 
        }
    }
    
    useEffect(() => {
        setChecked(value.includes(label))
    }, [value])

    return (
        <Pressable 
            onPress={toggleChecked}
            className="flex-row items-center bg-secondary-light rounded-md px-4 py-3 mb-3 h-20"
        >
        <Checkbox
            value={isChecked}
            onValueChange={toggleChecked}
            className='bg-white border border-gray-200 rounded-lg' 
        />
        <Text className="ml-2 text-gray-900 font-medium">{label}</Text>
        </Pressable>
    )
}