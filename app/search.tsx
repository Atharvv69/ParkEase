import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
  Text,
  FlatList,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Search() {
  const router = useRouter();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");

  // Load recent searches on screen open
  useEffect(() => {
    loadRecentSearches();
  }, []);

  // Load recent searches from AsyncStorage
  const loadRecentSearches = async () => {
    const storedSearches = await AsyncStorage.getItem("recentSearches");
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  };

  // Function to handle search input
  const handleSearch = async () => {
    if (searchText.trim() === "") return;

    // Update recent searches
    const updatedSearches = [searchText, ...recentSearches.filter(item => item !== searchText)].slice(0, 3);

    setRecentSearches(updatedSearches);
    await AsyncStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

    // Hide Keyboard after search
    Keyboard.dismiss();
    setSearchText("");
  };

  // Clear all recent searches
  const clearRecentSearches = async () => {
    await AsyncStorage.removeItem("recentSearches");
    setRecentSearches([]);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable
        style={styles.backButtonContainer}
        onPress={() => router.back()}
      >
        <Image
          source={require("../assets/images/back.png")}
          style={styles.backButton}
          resizeMode="contain"
        />
      </Pressable>

      {/* App Logo Top Right */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Search Row */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search location or area..."
          style={styles.input}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          autoFocus={true}
        />
        <Pressable onPress={() => console.log("Filter button pressed")}>
          <Image
            source={require("../assets/images/filter.png")}
            style={styles.filterIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      {/* My Current Location Row */}
      <View style={styles.currentLocationRow}>
        <Image
          source={require("../assets/images/location.png")}
          style={styles.locationIcon}
        />
        <Text style={styles.currentLocationText}>My Current Location</Text>
      </View>

      {/* Recent Searches List */}
      <View style={{ marginTop: 20 }}>
        <Text style={styles.recentTitle}>Recent Searches</Text>

        <FlatList
          data={recentSearches}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.recentItem}>
              <Text style={styles.recentText}>{item}</Text>
            </View>
          )}
        />

        {/* Clear Recent Searches */}
        {recentSearches.length > 0 && (
          <Pressable onPress={clearRecentSearches}>
            <Text style={styles.clearText}>Clear Recent Searches</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButtonContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    width: 30,
    height: 30,
    top: -30,
  },
  logoContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  logo: {
    width: 50,
    height: 75,
    top: -50,
    right: -15,
  },
  searchRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    fontSize: 16,
    top: -20,
  },
  filterIcon: {
    width: 40,
    height: 40,
    marginLeft: 10,
    top: -20,
  },
  currentLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  locationIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  currentLocationText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  recentItem: {
    paddingVertical: 8,
  },
  recentText: {
    fontSize: 16,
    color: "#555",
  },
  clearText: {
    color: "red",
    marginTop: 10,
    fontSize: 14,
  },
});
