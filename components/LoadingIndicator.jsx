import { View, Text, Modal, ActivityIndicator } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";

export default function LoadingIndicator() {
  return (
    <Modal transparent animationType="fade">
      <BlurView
        intensity={50}
        tint="light"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#2673DD" />
      </BlurView>
    </Modal>
  );
}
