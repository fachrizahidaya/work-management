import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { Image, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../components/shared/PageHeader";
import { pickImageHandler } from "../../../components/shared/PickImage";
import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";

const NewCustomerScreen = () => {
  const [image, setImage] = useState(null);

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader title="New Customer" onPress={() => navigation.goBack()} />
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
      {/* <View style={styles.form}>
        <TouchableOpacity style={styles.image} onPress={() => pickImageHandler(setImage)}>
          {image ? (
            <Image
              style={{ height: 150, width: 150, borderRadius: 80 }}
              alt="customer-image"
              source={{ uri: image.uri }}
            />
          ) : (
            <View style={{ alignItems: "center", gap: 5 }}>
              <MaterialCommunityIcons name="camera" size={20} color="#FFFFFF" />
              <Text style={{ color: "#FFFFFF" }}>Add image</Text>
            </View>
          )}
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

export default NewCustomerScreen;

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
  image: {
    borderRadius: 80,
    height: 150,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#176688",
  },
  form: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 16,
  },
});
