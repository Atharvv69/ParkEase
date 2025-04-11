import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, Modal, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";  
import { RootStackParamList } from "../(tabs)/index"; 

type FullScreenMapNavigationProp = StackNavigationProp<RootStackParamList, "FullScreenMap">;

const parkingLocations = [
  { id: 1, latitude: 23.2130, longitude: 72.6848, title: "Government Parking", type: "government" },
  { id: 2, latitude: 23.2125, longitude: 72.6835, title: "Private Parking", type: "private" },
  { id: 3, latitude: 23.2118, longitude: 72.6850, title: "Semi-Private Parking", type: "semiprivate" },
];

const FullScreenMap = () => {
  const navigation = useNavigation<FullScreenMapNavigationProp>(); 
  const [modalVisible, setModalVisible] = useState(false); 

  const [bikeSelected, setBikeSelected] = useState(false);
  const [carSelected, setCarSelected] = useState(false);
  const [govSelected, setGovSelected] = useState(false);
  const [privateSelected, setPrivateSelected] = useState(false);
  const [semiPrivateSelected, setSemiPrivateSelected] = useState(false);

  return (
    <View style={styles.container}>
      {/* 🔹 Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("SearchScreen")}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* 🔹 Search Bar (Centered) */}
      <TouchableOpacity style={styles.searchContainer} onPress={() => navigation.navigate("SearchScreen")}>
        <Ionicons name="search" size={25} color="black" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#888"
          editable={false} 
        />
      </TouchableOpacity>

      {/* 🔹 Filter Button */}
      <TouchableOpacity style={styles.filterButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="filter" size={24} color="black" />
      </TouchableOpacity>

      {/* 🔹 MapView */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 23.2123,
          longitude: 72.6843,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* 🔹 Your Location */}
        <Marker
          coordinate={{ latitude: 23.2123, longitude: 72.6843 }}
          title="IIT Gandhinagar"
          description="Indian Institute of Technology Gandhinagar"
          pinColor="red"
        />

        {/* 🔹 Parking Markers */}
        {parkingLocations.map((parking) => (
          <Marker
            key={parking.id}
            coordinate={{ latitude: parking.latitude, longitude: parking.longitude }}
            title={parking.title}
            pinColor={
              parking.type === "government" ? "green" :
              parking.type === "private" ? "blue" :
              "yellow" 
            }
          />
        ))}
      </MapView>

      {/* 🔹 Filter Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Parking Slots</Text>

            {/* 🔹 Filter Options */}
            {[
              { name: "Bike", icon: "two-wheeler", library: MaterialIcons, color: "green", selected: bikeSelected, setSelected: setBikeSelected },
              { name: "Car", icon: "car", library: FontAwesome5, color: "purple", selected: carSelected, setSelected: setCarSelected },
              { name: "Government Parking", icon: "building", library: FontAwesome5, color: "blue", selected: govSelected, setSelected: setGovSelected },
              { name: "Private Parking", icon: "warehouse", library: FontAwesome5, color: "red", selected: privateSelected, setSelected: setPrivateSelected },
              { name: "Semi-Private Parking", icon: "parking", library: FontAwesome5, color: "orange", selected: semiPrivateSelected, setSelected: setSemiPrivateSelected },
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.filterOption} onPress={() => item.setSelected(!item.selected)}>
                <item.library name={item.icon} size={24} color={item.selected ? item.color : "black"} />
                <Text style={styles.optionText}>{item.name}</Text>
                <Ionicons name={item.selected ? "checkbox" : "square-outline"} size={24} color={item.color} />
              </TouchableOpacity>
            ))}

            {/* 🔹 Close Button */}
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// 🔹 Styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: { position: "absolute", top: 40, left: 10, backgroundColor: "white", padding: 10, borderRadius: 25, zIndex: 1, elevation: 5 },
  
  // 🔹 Centered Search Bar
  searchContainer: { 
    position: "absolute", 
    top: 43, 
    left: "18%",  
    right: "50%", 
    width: "65%", 
    backgroundColor: "white", 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 10, 
    paddingVertical: 1, 
    borderRadius: 10, 
    zIndex: 1, 
    elevation: 10 
  },
  searchInput: { flex: 1, marginLeft: 20, height: 38, fontSize: 16, color: "black" },

  filterButton: { position: "absolute", top: 40, right: 10, backgroundColor: "white", padding: 10, borderRadius: 25, zIndex: 1, elevation: 5 },
  map: { width: "100%", height: "100%" },

  modalContainer: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "80%", backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  filterOption: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "80%", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  optionText: { fontSize: 18, fontWeight: "500" },
  modalCloseButton: { marginTop: 20, backgroundColor: "#2196F3", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  modalCloseText: { color: "white", fontSize: 16 },
});

export default FullScreenMap