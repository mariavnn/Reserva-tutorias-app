import { View, Text } from "react-native";
import React from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import InfoTutoria from "./InfoTutoria";


export default function InfoHomeAdmin({data}) {
  return (
    <View className="w-full border rounded-xl border-gray-300 p-3 mt-2">
        <View className='w-full flex flex-row justify-between'>
            <View>
                <Text className='font-medium mb-1'>{data.room}</Text>
                <Text className="text-gray-500">{data.block}</Text>
            </View>
            <View>
                <View className='flex flex-row gap-1 items-center mb-1'>
                    <Text className='text-gray-500'>Capacidad: <Text>{data.capacity}</Text></Text>
                </View>
                <Text className="text-sm text-gray-500">{data.sessions.length} <Text> Tutorias</Text></Text>
            </View>
        </View>
        <View className='w-full'>
            {data.sessions.map((session) => (
                <InfoTutoria
                    key={session.id}
                    data={session}
                />
            ))}
        </View>
    </View>
  );
}
