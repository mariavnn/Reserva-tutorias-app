import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Pressable } from "react-native";
import Checkbox from "expo-checkbox";
import { useState } from "react";

export default function SelectableCard({
  label,
  subject,
  value = [],
  onChange,
  disabled = false,
  assignedSubjects = [], 
}) {
  const isAlreadyAssigned = assignedSubjects.some(
    (s) => s.subjectId === subject.idMateria
  );

  const isChecked = !isAlreadyAssigned && value.some(
    (s) => s.idMateria === subject.idMateria
  );

  const toggleChecked = () => {
    if (disabled) return;

    if (isChecked) {
      onChange(value.filter((s) => s.idMateria !== subject.idMateria));
    } else {
      onChange([...value, subject]);
    }
  };

  return (
    <Pressable
      onPress={toggleChecked}
      className={`flex-row items-center ${
        disabled ? "bg-gray-300" : "bg-secondary-light"
      } rounded-md px-4 py-3 mb-3 h-20`}
    >
      <Checkbox
        value={isChecked}
        onValueChange={toggleChecked}
        className="bg-white border border-gray-200 rounded-lg"
        disabled={disabled}
      />
      <Text className="ml-2 text-gray-900 font-medium">{label}</Text>
    </Pressable>
  );
}
