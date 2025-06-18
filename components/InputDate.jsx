import React, { useState, useEffect } from "react";
import { View, TextInput, Text, Pressable, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import GeneralButton from "./GeneralButton";

export default function InputDate({
  label,
  labelIcon,
  type = "date",
  value,
  placeholder = "Select Date/Time",
  error,
  touched,
  onChange,
  ...props
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
    }
  }, [value]);

  const formatDateTime = (rawDate) => {
    let date = new Date(rawDate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${day}-${month}-${year}`;
  };

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  }

  const confirmIOSDate = () => {
    setSelectedDate(formatDateTime(date));
    onChange?.(formatDateTime(date));
    toggleDatePicker();
  }

  const onChangeAndroid = ({ type }, selectedDate) => {
    if (type === "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (Platform.OS === 'android') {
        const formatted = formatDateTime(currentDate);
        setSelectedDate(formatted);
        onChange?.(formatted);
      }
    }
    toggleDatePicker();
  }

  return (
    <View className="mb-4">
      {label && (
        <View className="flex-row gap-2 items-center mb-1">
          {labelIcon && <View>{labelIcon}</View>}
          <Text className="text-gray-700 mr-1">{label}</Text>
        </View>
      )}

      {showPicker && (<DateTimePicker
        mode="date"
        display="default"
        value={date}
        onChange={onChangeAndroid}
        className="h-28 mt-1"
      />
      )}

      {showPicker && Platform.OS === "ios" && (
        <View className="flex-row justify-around w-full">
          <View className="w-1/2">
            <GeneralButton
              title={"Cancel"}
              type="secondary"
              onPress={toggleDatePicker}
            />

          </View>
          <View className="w-1/2">
            <GeneralButton
              title={"Confirm"}
              type="primary"
              onPress={confirmIOSDate}
            />
          </View>
        </View>
      )}

      {!showPicker && (
        <Pressable
          onPress={toggleDatePicker}
        >
          <TextInput
            editable={false}
            value={selectedDate}
            onPressIn={toggleDatePicker}
            placeholder={placeholder}
            onChangeText={setSelectedDate}
            className="border border-gray-300 rounded-md px-4 py-3 text-gray-800 bg-white"
            {...props}
          />
        </Pressable>
      )}

      {touched && error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
}
