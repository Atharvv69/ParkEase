import React from "react";  // Import React explicitly
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function ParkingDetails() {
  const { name, latitude, longitude, available } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text>📍 Location: {latitude}, {longitude}</Text>
      <Text>🟢 Availability: {available === "true" ? "Yes" : "No"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold" },
});
