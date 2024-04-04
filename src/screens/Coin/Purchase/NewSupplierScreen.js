import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../components/shared/PageHeader";
import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import { pickImageHandler } from "../../../components/shared/PickImage";

const NewSupplierScreen = () => {
  const [image, setImage] = useState(null);

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader title="New Supplier" onPress={() => navigation.goBack()} />
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {!image ? (
            <AvatarPlaceholder size="xl" name={null} image={!image ? image : image.uri} />
          ) : (
            <Image
              source={{
                uri: `${image?.uri}`,
              }}
              alt="profile picture"
              style={{
                width: 80,
                height: 80,
                resizeMode: "contain",
                borderRadius: 40,
              }}
            />
          )}
          <Pressable
            style={styles.editPicture}
            onPress={!image ? () => pickImageHandler(setImage) : () => setImage(null)}
          >
            <MaterialCommunityIcons name={!image ? "camera-outline" : "close"} size={20} color="#3F434A" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NewSupplierScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    position: "relative",
  },
  header: {
    gap: 15,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  editPicture: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 2,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#C6C9CC",
    shadowOffset: 0,
  },
});
