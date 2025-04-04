import { View, Text } from 'react-native'
import React from 'react'

export default function SizedBox({height, width}) {
  return (
    <View style={{ height, width }} />
  )
}