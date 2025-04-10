import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Feather } from "@expo/vector-icons";

export default function HomeScreen() {
  const router = useRouter();
  const [mapFullScreen, setMapFullScreen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [parkingData, setParkingData] = useState<null | {
    name: string;
    distance: string;
    availableSlots: number;
    floors: Record<string, string[]>; // floor -> array of slot ids
    bookedSlots: string[];
  }>(null);

  // 🔁 Simulate fetching data from backend
  useEffect(() => {
    // TODO: Replace with your backend call
    // fetch("<YOUR_BACKEND_ENDPOINT>")
    //   .then(res => res.json())
    //   .then(data => setParkingData(data))
    //   .catch(err => console.error(err));
  }, []);

  if (!parkingData) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Waiting for parking data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔍 Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.circleButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchBar}
          placeholder="Search parking slots..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.circleButton} onPress={() => console.log("Filter Clicked")}> 
          <Feather name="sliders" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* 🗺️ Clickable Map */}
      <TouchableOpacity onPress={() => setMapFullScreen(true)} style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 23.2145,
            longitude: 72.6347,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          <Marker
            coordinate={{ latitude: 23.2145, longitude: 72.6347 }}
            title={parkingData.name}
          />
        </MapView>
      </TouchableOpacity>

      {/* 📍 Parking Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.parkingTitle}>{parkingData.name}</Text>
        <Text style={styles.details}>Distance: {parkingData.distance}</Text>
        <Text style={styles.details}>Available Slots: {parkingData.availableSlots}</Text>
      </View>

      {/* 🏢 Floor & Slot Display */}
      <ScrollView style={styles.floorsContainer}>
        {Object.keys(parkingData.floors).map((floor) => (
          <View key={floor} style={styles.floorContainer}>
            <Text style={styles.floorTitle}>{floor.toUpperCase()} Floor</Text>
            <View style={styles.slotRow}>
              {parkingData.floors[floor].map((slot) => (
                <View
                  key={slot}
                  style={[styles.slot, parkingData.bookedSlots.includes(slot) ? styles.booked : styles.free]}
                >
                  <Text style={styles.slotText}>{slot}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 🗺️ Full-Screen Map Modal */}
      <Modal visible={mapFullScreen} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.mapBackButton} onPress={() => setMapFullScreen(false)}>
            <Feather name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
          <MapView
            style={styles.fullScreenMap}
            initialRegion={{
              latitude: 23.2145,
              longitude: 72.6347,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{ latitude: 23.2145, longitude: 72.6347 }}
              title={parkingData.name}
            />
          </MapView>
        </View>
      </Modal>

      <TouchableOpacity style={styles.locateButton} onPress={() => console.log("Locate Parking")}> 
        <Text style={styles.locateButtonText}>Locate Parking</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBar: { flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "#fff" },
  circleButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#ddd", justifyContent: "center", alignItems: "center", marginHorizontal: 5 },
  searchBar: { flex: 1, height: 40, backgroundColor: "#eee", borderRadius: 10, paddingHorizontal: 10 },
  mapContainer: { width: "100%", height: "30%" },
  map: { flex: 1 },
  infoContainer: { padding: 20, backgroundColor: "#fff" },
  parkingTitle: { fontSize: 20, fontWeight: "bold" },
  details: { fontSize: 16, color: "#555" },
  floorsContainer: { flex: 1, padding: 10 },
  floorContainer: { marginBottom: 10 },
  floorTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 5 },
  slotRow: { flexDirection: "row", flexWrap: "wrap" },
  slot: { width: 50, height: 50, margin: 5, justifyContent: "center", alignItems: "center", borderRadius: 5 },
  booked: { backgroundColor: "grey" },
  free: { backgroundColor: "green" },
  slotText: { color: "white", fontWeight: "bold" },
  modalContainer: { flex: 1 },
  fullScreenMap: { flex: 1 },
  mapBackButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 10,
    borderRadius: 20,
  },
  locateButton: {
    position: "absolute",
    bottom: 20,
    left: "10%",
    width: "80%",
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  locateButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
