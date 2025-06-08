import { View, Text } from 'react-native'
import React from 'react'
import { Picker } from '@react-native-picker/picker'
import AntDesign from '@expo/vector-icons/AntDesign';
import { Dropdown } from 'react-native-element-dropdown';



export default function DropdownInput({ 
  label, placeholder = "Selecciona...", labelIcon, selectedValue, onValueChange, items, error, touched, disabled}) {
  return (
    <View className="w-full">
        {label && (
          <View className="flex-row gap-1 items-center mb-1">
            {labelIcon && <View>{labelIcon}</View>}
            <Text className="text-gray-700 mr-1">{label}</Text>
          </View>
        )}
        <Dropdown
            data={items}
            labelField="label"
            valueField="value"
            value={selectedValue}
            placeholder={placeholder}
            maxHeight={300}
            disable={disabled}
            onChange={item => onValueChange(item)} 
            placeholderStyle={{ color: '#9CA3AF' }} 
            selectedTextStyle={{ color: '#111827', fontWeight: '500' }} 
            inputSearchStyle={{
            paddingHorizontal: 12,
            borderRadius: 8,
            }}
            iconStyle={{ width: 20, height: 20 }}
            style={{
                borderWidth: 1,
                backgroundColor:'white',
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