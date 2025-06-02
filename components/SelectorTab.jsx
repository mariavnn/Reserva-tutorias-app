import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SelectorTab({ tabs, onSelect, selectedTab, disabled = false }) {
  const TAB_WIDTH = Dimensions.get('window').width / tabs.length;
  const defaultSelectedTab = selectedTab || tabs[0];

  const underlineAnimation = useMemo(() => new Animated.Value(0), []);
  const getTabIndex = (label) => tabs.findIndex((tab) => tab === label);
  const [activeIndex, setActiveIndex] = useState(getTabIndex(selectedTab));

  const animateUnderline = (index) => {
    Animated.timing(underlineAnimation, {
      toValue: index,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    const newIndex = getTabIndex(selectedTab || defaultSelectedTab);
    setActiveIndex(newIndex);
    animateUnderline(newIndex);
  }, [selectedTab, tabs]);

  const handleTabPress = (index, label) => {
    if (disabled) return;
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
          disabled={disabled}
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
