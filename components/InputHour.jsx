import { View, Text, TextInput, Platform, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import DateTimePicker from "@react-native-community/datetimepicker";
import GeneralButton from './GeneralButton';

export default function InputHour({
    label,
    labelIcon,
    value,
    placeholder = "Select Time",
    error,
    touched,
    onChange,
    ...props
}) {
    const [showPicker, setShowPicker] = useState(false);
    const [internalTime, setInternalTime] = useState(new Date());
    
    // Sincronizar el valor inicial
    useEffect(() => {
        if (value) {
            const [hours, minutes] = value.split(':').map(Number);
            const date = new Date();
            date.setHours(hours, minutes);
            setInternalTime(date);
        }
    }, [value]);

    const formatTime = (date) => {
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const handleTimeChange = (event, selectedTime) => {
        if (event.type === "set") {
            // Para Android, cerrar el picker inmediatamente
            if (Platform.OS === 'android') {
                setShowPicker(false);
            }
            
            // Actualizar el estado interno
            setInternalTime(selectedTime);
            
            // Formatear y propagar el valor
            const formattedTime = formatTime(selectedTime);
            onChange?.(formattedTime);
        } else {
            // Si se cancela, cerrar el picker
            setShowPicker(false);
        }
    };

    const confirmIOSDate = () => {
        setShowPicker(false);
        const formattedTime = formatTime(internalTime);
        onChange?.(formattedTime);
    };

    const togglePicker = () => {
        setShowPicker(!showPicker);
    };

    return (
        <View className="mb-4">
            {label && (
                <View className="flex-row gap-2 items-center mb-1">
                    {labelIcon && <View>{labelIcon}</View>}
                    <Text className="text-gray-700 mr-1">{label}</Text>
                </View>
            )}

            <Pressable onPress={togglePicker}>
                <TextInput
                    editable={false}
                    value={value}
                    placeholder={placeholder}
                    className="border border-gray-300 rounded-md px-4 py-3 text-gray-800 bg-white"
                    {...props}
                />
            </Pressable>

            {showPicker && (
                <>
                    <DateTimePicker
                        mode="time"
                        display="default"
                        value={internalTime}
                        onChange={handleTimeChange}
                    />

                    {Platform.OS === "ios" && (
                        <View className="flex-row justify-around mt-2">
                            <View className="w-1/2 pr-1">
                                <GeneralButton
                                    title="Cancelar"
                                    type="secondary"
                                    onPress={() => setShowPicker(false)}
                                />
                            </View>
                            <View className="w-1/2 pl-1">
                                <GeneralButton
                                    title="Confirmar"
                                    type="primary"
                                    onPress={confirmIOSDate}
                                />
                            </View>
                        </View>
                    )}
                </>
            )}

            {touched && error && (
                <Text className="text-red-500 text-sm mt-1">{error}</Text>
            )}
        </View>
    );
}