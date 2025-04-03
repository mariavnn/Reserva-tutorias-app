import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';

const TabMenu = ({ tabs, onTabSelect }) => {
  const [activeTab, setActiveTab] = useState(0);
  const underlineAnim = useRef(new Animated.Value(0)).current;

  const handleTabPress = (index) => {
    setActiveTab(index);
    Animated.timing(underlineAnim, {
      toValue: index,
      duration: 300,
      useNativeDriver: false,
    }).start();
    onTabSelect && onTabSelect(index);
  };

  return (
    <View className="flex-row border-b border-gray-300">
      {tabs.map((label, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleTabPress(index)}
          className="flex-1 items-center py-2"
        >
          <Text className={`text-lg font-semibold ${activeTab === index ? 'text-blue-600' : 'text-gray-500'}`}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
      {/* Línea animada debajo del tab activo */}
      <Animated.View
        className="absolute bottom-0 h-1 bg-blue-600"
        style={{
          width: `${100 / tabs.length}%`,
          left: underlineAnim.interpolate({
            inputRange: tabs.map((_, i) => i),
            outputRange: tabs.map((_, i) => `${(i * 100) / tabs.length}%`),
          }),
        }}
      />
    </View>
  );
};

export default TabMenu;


