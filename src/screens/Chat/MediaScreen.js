import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/core";

import { SafeAreaView, View, Pressable, StyleSheet, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import MediaList from "../../components/Chat/Media/MediaList";
import { TextProps } from "../../components/shared/CustomStylings";

const MediaScreen = () => {
  const [tabValue, setTabValue] = useState("photos");
  const [photos, setPhotos] = useState([]);
  const [documents, setDocuments] = useState([]);

  const navigation = useNavigation();
  const route = useRoute();

  const { media, docs } = route.params;

  const changeBandType = () => {
    if (tabValue === "photos") {
      setTabValue("documents");
      setDocuments([]);
    } else {
      setTabValue("photos");
      setPhotos([]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#FFFFFF",
          padding: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Pressable onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={20} color="#3F434A" />
          </Pressable>
        </View>
        <View
          style={{
            flex: 0,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
            marginLeft: 90,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#FAFAFA",
              padding: 5,
              marginVertical: 5,
              gap: 5,
              borderRadius: 10,
            }}
          >
            <Pressable
              style={{
                backgroundColor: tabValue === "project" ? "#E6E6E6" : null,
                borderRadius: 10,
                padding: 5,
              }}
              onPress={changeBandType}
            >
              <Text style={[{ fontSize: 12 }, TextProps]}>Project</Text>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: tabValue === "task" ? "#E6E6E6" : null,
                borderRadius: 10,
                padding: 5,
              }}
              onPress={changeBandType}
            >
              <Text style={[{ fontSize: 12 }, TextProps]}>Ad Hoc</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <MediaList media={media} docs={docs} />
    </SafeAreaView>
  );
};

export default MediaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
});
