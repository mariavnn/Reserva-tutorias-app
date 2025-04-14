import { View, Text } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function NotificationCard({ data }) {
  return (
    <View
      className={`rounded-xl px-4 py-3 mb-2 ${data.read ? 'bg-gray-100' : 'bg-white shadow-sm'}`}
    >
      <View className="flex-row items-start space-x-3">
        {!data.read && (
          <FontAwesome name="circle" size={8} color="#3B82F6" style={{ marginTop: 4, marginRight: 5}} />
        )}
        <Text className="text-sm text-gray-800 flex-1">{data.message}</Text>
      </View>
      <Text className="text-xs text-gray-400 mt-1">{data.timeAgo}</Text>
    </View>
  );
}