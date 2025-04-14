import { View, Text, TextInput, Platform } from 'react-native'
import React from 'react'
import { useState } from 'react';
import GeneralButton from './GeneralButton';
import { Pressable } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";

export default function InputHour({
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
    const [selectedTime, setSelectedTime] = useState(value);
    const [time, setTime ] = useState(new Date());
  
  
    const handleDateChange = (event, time) => {
      if (event.type === "set" && time) {
        setSelectedTime(time);
      }
      setPickerVisibility(false);
    };
  
    const toggleDatePicker = () =>{
      setShowPicker(!showPicker);
    }
  
    const confirmIOSDate = () => {
      const formattedTime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
      setSelectedTime(formattedTime);
      onChange?.(formattedTime);
      toggleDatePicker();
    }
  
    const onChangeAndroid = ({ type }, selectedTime) => {
      if (type === "set") {
          const currentTime = selectedTime;
          setTime(currentTime);
          if(Platform.OS === 'android'){
            const formatted = formatDateTime(currentTime);
            setSelectedTime(formatted);
            onChange?.(formatted);
            toggleDatePicker();
          }
      }else {
  
      }
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
              mode="time"
              display="default"
              value={time}
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
                  value={selectedTime}
                  onPressIn={toggleDatePicker}
                  placeholder={placeholder}
                  onChangeText={setSelectedTime}
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