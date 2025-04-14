import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function SelectorTabStudent( { tabs = [], selectedTab, onSelect } ) {
  return (
    <View className="flex-row justify-between bg-[#e5efff] p-1 rounded-xl mt-5">
      {tabs.map((tab) => {
        const isSelected = selectedTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onSelect(tab)}
            className={`flex-1 items-center py-2 rounded-xl ${
              isSelected ? "bg-[#bfdcff]" : ""
            }`}
          >
            <Text className={`text-sm font-medium ${isSelected ? "text-black" : "text-gray-600"}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  )
}