import { View, TextInput } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function SearchBar({ value, onChangeText, placeholder = "Buscar..." }) {
  return (
    <View className="flex-row items-center bg-white px-3 py-2 rounded-xl shadow-sm w-full mt-4">
      <AntDesign name="search1" size={20} color="black" />
      <TextInput
        className="ml-2 flex-1 text-base text-black"
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}
