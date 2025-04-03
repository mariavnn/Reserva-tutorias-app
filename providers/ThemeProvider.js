import React, { createContext } from "react";
import { View } from "react-native";
import { useColorScheme } from "nativewind";
import { themes } from "../constants/Colors"

export const ThemeContext = createContext({
  theme: "light",
});

export const ThemeProvider = ({ children }) => {
  const { colorScheme } = useColorScheme();
  
  return (
    <ThemeContext.Provider value={{ theme: colorScheme }}>
      <View style={themes[colorScheme]} className="flex-1">
        {children}
      </View>
    </ThemeContext.Provider>
  );
};