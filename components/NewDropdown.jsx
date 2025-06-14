import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const NewDropdown = ({
  label,
  labelIcon,
  options,
  value,
  onValueChange,
  error,
  placeholder = 'Selecciona...',
  disabled = false,
}) => {
  return (
    <View className="w-full py-2">
      {label &&
        <View className="flex-row gap-1 items-center mb-1">
          {labelIcon && <View>{labelIcon}</View>}
          <Text className="text-gray-700 mr-1">{label}</Text>
        </View>
      }
      <Dropdown
        data={options}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onChange={item => item?.value !== undefined && onValueChange(item.value)}
        disable={disabled}
        placeholderStyle={{
          color: '#9CA3AF',
          fontSize: 16,
        }}
        selectedTextStyle={{
          color: '#111827',
          fontWeight: '500',
          fontSize: 16,
        }}
        containerStyle={{
          borderRadius: 8,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        style={{
          borderWidth: 1,
          backgroundColor: 'white',
          borderColor: error ? '#EF4444' : '#3B82F6',

          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 12,
          minHeight: 48,
        }}
        itemTextStyle={{
          fontSize: 13,
          color: '#111827',
        }}
        activeColor="#d4e5ff"
      />

      {error &&
        <Text className="text-red-500 text-sm mt-1 ml-1">
          {error}
        </Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    color: '#333',
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  dropdownError: {
    borderColor: 'red',
  },
  dropdownDisabled: {
    backgroundColor: '#f0f0f0',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#888',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: 'red',
  },
});

export default NewDropdown;
