import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/core";

import { SafeAreaView, View, Pressable, StyleSheet, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import MediaList from "../../components/Chat/Media/MediaList";
import { TextProps } from "../../components/shared/CustomStylings";
import ImageFullScreenModal from "../../components/shared/ImageFullScreenModal";

const MediaScreen = () => {
  const [tabValue, setTabValue] = useState("photos");
  const [photos, setPhotos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();

  const { media, docs } = route.params;

  const imageArray = media.map((item) => {
    return item?.file_path;
  });

  const toggleFullScreen = (image) => {
    setSelectedImage(image);
    setIsFullScreen(!isFullScreen);
  };

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
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
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
                backgroundColor: tabValue === "photos" ? "#E6E6E6" : null,
                borderRadius: 10,
                padding: 5,
              }}
              onPress={changeBandType}
            >
              <Text style={[{ fontSize: 14 }, TextProps]}>Media</Text>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: tabValue === "documents" ? "#E6E6E6" : null,
                borderRadius: 10,
                padding: 5,
              }}
              onPress={changeBandType}
            >
              <Text style={[{ fontSize: 14 }, TextProps]}>Docs</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <MediaList media={media} docs={docs} tabValue={tabValue} toggleFullScreen={toggleFullScreen} />
      <ImageFullScreenModal
        isFullScreen={isFullScreen}
        setIsFullScreen={setIsFullScreen}
        file_path={selectedImage}
        images={imageArray}
        media={true}
      />
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
