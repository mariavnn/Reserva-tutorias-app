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
    <View style={styles.container}>
      {label &&
        <View className="flex-row gap-1 items-center mb-1">
          {labelIcon && <View>{labelIcon}</View>}
          <Text className="text-gray-700 mr-1">{label}</Text>
        </View>
      }

      <Dropdown
        style={[
          styles.dropdown,
          error ? styles.dropdownError : null,
          disabled ? styles.dropdownDisabled : null,
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={options}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onChange={item => item?.value !== undefined && onValueChange(item.value)}
        disable={disabled}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
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
