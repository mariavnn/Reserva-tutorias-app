import React, { useMemo, useState } from 'react';
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SelectorTab({ tabs, onSelect }) {
  const TAB_WIDTH = Dimensions.get('window').width / tabs.length;

  const underlineAnimation = useMemo(() => new Animated.Value(0), []);
  const [activeIndex, setActiveIndex] = useState(0);

  const animateUnderline = (index) => {
    Animated.timing(underlineAnimation, {
      toValue: index,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleTabPress = (index, label) => {
    setActiveIndex(index);
    animateUnderline(index);
    onSelect(label)
  };

  const underlinePosition = underlineAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TAB_WIDTH],
  });

  const renderTabs = () => {
    return tabs.map((label, index) => {
      const isActive = index === activeIndex;
      return (
        <TouchableOpacity
          key={index}
          activeOpacity={0.7}
          onPress={() => handleTabPress(index, label)}
          style={{ width: TAB_WIDTH, alignItems: 'center' }}
        >
          <Text className = {`text-lg mb-1 w-[150px] text-center ${activeIndex === index ? 'text-primary-light' : 'text-black'}`}>
            {label}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={{ position: 'relative' }}>
      <View style={{ flexDirection: 'row' }}>
        {renderTabs()}
      </View>
      <Animated.View
        className="absolute bottom-0 w-[160px] h-[3px] bg-primary-light dark:bg-primary-dark px-6 rounded-sm mx-5"
        style={{
          transform: [{ translateX: underlinePosition }],
        }}
      />
    </View>
  );
}
