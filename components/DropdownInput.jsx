import React, { useState, useMemo } from 'react';
import { View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export default function DropdownInput({
  label,
  placeholder = "Selecciona...",
  labelIcon,
  selectedValue,
  onValueChange,
  items = [],
  error,
  touched,
  disabled = false
}) {
  const [isFocus, setIsFocus] = useState(false);

  // Memoizar los items para evitar re-renderizados innecesarios
  const memoizedItems = useMemo(() => items, [items]);

  // Encontrar el valor actual basado en el selectedValue
  const currentValue = useMemo(() => {
    if (!selectedValue || !memoizedItems.length) return null;

    // Si selectedValue es un objeto, usar su valor
    if (typeof selectedValue === 'object' && selectedValue.value) {
      return selectedValue.value;
    }

    // Si selectedValue es un string, buscar el item correspondiente
    const foundItem = memoizedItems.find(item =>
      item.value === selectedValue || item.label === selectedValue
    );

    return foundItem ? foundItem.value : selectedValue;
  }, [selectedValue, memoizedItems]);

  const handleValueChange = (item) => {
    setIsFocus(false);

    // Llamar onValueChange con el item completo
    if (onValueChange) {
      onValueChange(item);
    }
  };

  return (
    <View className="w-full">
      {label && (
        <View className="flex-row gap-1 items-center mb-1">
          {labelIcon && <View>{labelIcon}</View>}
          <Text className="text-gray-700 mr-1">{label}</Text>
        </View>
      )}
      <View className="relative">
        <Dropdown
          data={memoizedItems}
          labelField="label"
          valueField="value"
          value={currentValue}
          placeholder={placeholder}
          maxHeight={300}
          disable={disabled}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={handleValueChange}
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
            borderColor: error && touched ? '#EF4444' :
              isFocus ? '#3B82F6' : '#D1D5DB',
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
      </View>

      {error && touched && (
        <Text className="text-red-500 text-sm mt-1 ml-1">
          {error}
        </Text>
      )}
    </View>
  );
}