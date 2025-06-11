import { View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native';


export default function PopularTutorias({ data, onJoin }) {
  return (
    <View className="w-[48%] bg-white rounded-xl shadow-sm mb-4 overflow-hidden flex flex-col">
      <View className="p-3 flex-1">
        <View className="flex-row justify-between items-start">
          <Text className="text-base font-semibold flex-1">{data?.materia?.nombreMateria}</Text>
        </View>
        <Text className="text-gray-500 text-sm mt-1">{data?.usuario?.nombre} {data?.usuario?.apellido}</Text>
      </View>

      <TouchableOpacity
        onPress={onJoin}
        className="bg-blue-500 py-2 justify-center items-center"
      >
        <Text className="text-white font-medium">Unirse</Text>
      </TouchableOpacity>
    </View>
  )
}