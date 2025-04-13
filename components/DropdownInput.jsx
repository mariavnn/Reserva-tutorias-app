import { View, Text } from 'react-native'
import React from 'react'
import { Picker } from '@react-native-picker/picker'
import AntDesign from '@expo/vector-icons/AntDesign';
import { Dropdown } from 'react-native-element-dropdown';



export default function DropdownInput({ label, selectedValue, onValueChange, items, error, touched, disabled }) {
  return (
    <View className="w-full">
        {label && <Text className="text-gray-700 mb-1">{label}</Text>}
        <Dropdown
            data={items}
            labelField="label"
            valueField="label"
            value={selectedValue}
            placeholder={"Seleccionar..."}
            maxHeight={300}
            disable={disabled}
            onChange={onValueChange}
            placeholderStyle={{ color: '#9CA3AF' }} // gray-400
            selectedTextStyle={{ color: '#111827', fontWeight: '500' }} // gray-900
            inputSearchStyle={{
            backgroundColor: '#F3F4F6', // gray-100
            paddingHorizontal: 12,
            borderRadius: 8,
            }}
            iconStyle={{ width: 20, height: 20 }}
            style={{
                borderWidth: 1,
                borderColor: error && touched ? '#EF4444' : '#D1D5DB', // rojo si error
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                zIndex: 10, 
                position: 'relative'
            }}
        />
    </View>
  )
}