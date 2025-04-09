import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

function MapScreen() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <>
          {/* Search Bar with Search Icon + Filter Button */}
          <View style={styles.searchContainer}>
            {/* Search Icon */}
            <Image
              source={require("../assets/images/search.png")}
              style={styles.searchIcon}
            />
            {/* Search Input */}
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => navigation.navigate("search")}
            >
              <TextInput
                placeholder="Search here"
                placeholderTextColor="gray"
                style={styles.searchInput}
                editable={false} // Make TextInput non-editable
                pointerEvents="none" // Disable keyboard
              />
            </TouchableOpacity>
            {/* Filter Button */}
            <TouchableOpacity style={styles.filterButton}>
              <Image
                source={require("../assets/images/filter.png")}
                style={{ width: 25, height: 25 }}
              />
            </TouchableOpacity>
          </View>

          {/* Map View */}
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
          >
            <Marker coordinate={location} />
          </MapView>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require("../assets/images/back.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f000",
    top: 50,
  },
  map: {
    flex: 1,
    backgroundColor: "white",
  },
  searchContainer: {
    position: "absolute",
    top: -45,
    right: 15,
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    elevation: 5,
    width: "85%",
    alignItems: "center",
    zIndex: 1,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  filterButton: {
    marginLeft: 10,
    right: -10,
    top: 0.5,
    backgroundColor: "white",
    padding: 6,
    borderRadius: 20,
  },
  backButton: {
    position: "absolute",
    top: -40,
    left: 5,
    backgroundColor: "white",
    borderRadius: 25,
    elevation: 5,
  },
});

export default MapScreen;
