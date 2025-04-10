import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Region } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'; // or react-native


const { height } = Dimensions.get("window");

export default function Index() {
  // State to hold user location region
  const [region, setRegion] = useState<Region | null>(null);

  // State to show splash screen for 2 seconds
  const [loading, setLoading] = useState(true);

  // Navigation hook
  const navigation = useNavigation();

  // Splash screen timer
  useEffect(() => {
    const showSplash = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false); // After 2 seconds, hide splash
    };
    showSplash();
  }, []);

  // Get user's current location
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }

      // Get current location and update region
      let userLocation = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    };
    getLocation();
  }, []);

  // Splash screen view
  if (loading) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require("../../assets/images/logo.png")} // Replace with your logo
          style={styles.splashLogo}
        />
        <Text style={styles.splashText}>ParkEase</Text>
      </View>
    );
  }

  // Main app screen
  return (
    <View style={styles.container}>
      {/* Search bar with filter button */}
      <TouchableOpacity
        style={styles.searchContainer}
        onPress={() => navigation.navigate('search')} // Navigate to search screen
      >
        <Ionicons name="search" size={20} color="gray" style={styles.icon} />
        <Text style={styles.searchInput}>Search parking...</Text>

        {/* Filter button with custom logo */}
        <TouchableOpacity style={styles.filterButton}>
          <Image
            source={require("../../assets/images/filter.png")} // Your custom filter icon
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Map view showing user location */}
      {region && (
        
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          onPress={() => navigation.navigate('map')} // Navigate to map.tsx page
        >
          <Marker coordinate={region} />
        </MapView>
      )}

      {/* App logo below map */}
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />

      {/* Fancy message */}
      <Text style={styles.fancyText}>Worried about parking? We've got you.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Splash screen styles
  splashContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  splashLogo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  splashText: {
    fontSize: 28,
    fontWeight: "bold",
  },

  // Main container
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },

  // Search bar styles
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 5,
    height: 50,
    marginTop: -25,
  },
  icon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#555",
  },
  filterButton: {
    padding: 6,
    marginLeft: 10,
  },
  filterIcon: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },

  // Map styles
  map: {
    height: height * 0.5, // 50% of screen height
    marginTop: 15,
    marginHorizontal: 5,
    borderRadius: 15,
  },

  // Logo below the map
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginTop: 15,
  },

  // Fancy text below logo
  fancyText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
  },
});
