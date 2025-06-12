import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomTabBar({ navigationState, jumpTo, position }) {
  const { routes, index } = navigationState;

  return (
    <View className="w-full mt-5 flex-row rounded-full bg-[#e5efff] p-1">
      {routes.map((route, i) => {
        const isFocused = index === i;

        return (
          <Pressable
            key={route.key}
            onPress={() => jumpTo(route.key)}
            className={`flex-1 rounded-full py-2 ${
              isFocused ? "bg-[#bfdcff]" : ""
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                isFocused ? "text-black" : "text-gray-400"
              }`}
            >
              {route.title}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
