import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Text,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";

// 🔹 Define Type for Navigation Stack
export type RootStackParamList = {
  FullScreenMap: undefined;
  Search: undefined;
  Filter: undefined;
};

type FullScreenMapNavigationProp = StackNavigationProp<
  RootStackParamList,
  "FullScreenMap"
>;

// 🔹 Dummy Search Screen
const Search = () => (
  <View style={styles.screenPlaceholder}>
    <Text style={styles.placeholderText}>Search Screen</Text>
  </View>
);

// 🔹 Parking Locations
const parkingLocations = [
  {
    id: 1,
    latitude: 23.213,
    longitude: 72.6848,
    title: "Government Parking",
    type: "government",
  },
  {
    id: 2,
    latitude: 23.2125,
    longitude: 72.6835,
    title: "Private Parking",
    type: "private",
  },
];

// 🔹 Full Screen Map Component
const FullScreenMap = ({ navigation }: { navigation: FullScreenMapNavigationProp }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [govSelected, setGovSelected] = useState(false);
  const [privateSelected, setPrivateSelected] = useState(false);
  const [priceRange, setPriceRange] = useState(1000);

  return (
    <View style={styles.container}>
      {/* 🔹 Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Search")}
      >
        <Image
          source={require("../../assets/images/back.png")}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity>

      {/* 🔹 Search Bar */}
      <TouchableOpacity
        style={styles.searchContainer}
        onPress={() => navigation.navigate("Search")}
      >
        <Ionicons name="search" size={25} color="black" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#888"
          editable={false}
        />
      </TouchableOpacity>

      {/* 🔹 Filter Button */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={require("../../assets/images/filter.png")}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity>

      {/* 🔹 Map View */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 23.2123,
          longitude: 72.6843,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: 23.2123, longitude: 72.6843 }}
          title="IIT Gandhinagar"
          description="Indian Institute of Technology Gandhinagar"
          pinColor="red"
        />
        {parkingLocations.map((parking) => (
          <Marker
            key={parking.id}
            coordinate={{
              latitude: parking.latitude,
              longitude: parking.longitude,
            }}
            title={parking.title}
            pinColor={
              parking.type === "government"
                ? "green"
                : parking.type === "private"
                ? "blue"
                : "yellow"
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
            {[
              {
                name: "Government Parking",
                icon: "building",
                color: "blue",
                selected: govSelected,
                setSelected: setGovSelected,
              },
              {
                name: "Private Parking",
                icon: "warehouse",
                color: "red",
                selected: privateSelected,
                setSelected: setPrivateSelected,
              },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.filterOption}
                onPress={() => item.setSelected(!item.selected)}
              >
                <FontAwesome5
                  name={item.icon}
                  size={24}
                  color={item.selected ? item.color : "black"}
                />
                <Text style={styles.optionText}>{item.name}</Text>
                <Ionicons
                  name={item.selected ? "checkbox" : "square-outline"}
                  size={24}
                  color={item.color}
                />
              </TouchableOpacity>
            ))}
            <View style={styles.separator} />
            <Text style={styles.priceTitle}>Price Range</Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.priceText}>₹ 0</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={2000}
                step={100}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value)}
                minimumTrackTintColor="#2196F3"
                maximumTrackTintColor="#000000"
                thumbTintColor="#2196F3"
              />
              <Text style={styles.priceText}>₹ 2000</Text>
            </View>
            <Text style={styles.priceValue}>Selected: ₹ {priceRange}</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// 🔹 Navigation Setup
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FullScreenMap">
        <Stack.Screen
          name="FullScreenMap"
          component={FullScreenMap}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Filter"
          component={FullScreenMap}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 🔹 Styles (unchanged — as you had it)
const styles = StyleSheet.create({
  // ... [your full styles here, unchanged]
  container: { flex: 1 },
  backButton: {
    position: "absolute",
    top: 40,
    left: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 25,
    zIndex: 1,
    elevation: 5,
  },
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
    elevation: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 20,
    height: 38,
    fontSize: 16,
    color: "black",
  },
  filterButton: {
    position: "absolute",
    top: 40,
    right: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 25,
    zIndex: 1,
    elevation: 5,
  },
  map: { width: "100%", height: "100%" },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: { fontSize: 18, fontWeight: "500" },
  separator: {
    width: "90%",
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 20,
  },
  priceTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },
  slider: { flex: 1, height: 40 },
  priceText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  priceValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalCloseText: { color: "white", fontSize: 16 },
  screenPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },
  placeholderText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#666",
  },
});
