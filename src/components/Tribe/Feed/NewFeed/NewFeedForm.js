import { useState } from "react";

import { StyleSheet, View, Pressable, Image, ActivityIndicator } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import NewFeedInput from "./NewFeedInput";

const NewFeedForm = ({ formik, image, setImage, pickImageHandler, employees }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={styles.container}>
      <View>
        <NewFeedInput employees={employees} formik={formik} />

        <View style={styles.boxImage}>
          {image ? (
            <View style={{ alignSelf: "center" }}>
              <Image source={{ uri: image.uri }} style={styles.image} alt="image selected" />
              <Pressable style={styles.close} onPress={() => setImage(null)}>
                <MaterialCommunityIcons name="close" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>
      <View style={styles.action}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          <Pressable onPress={pickImageHandler}>
            <MaterialCommunityIcons
              name="attachment"
              size={25}
              color="#3F434A"
              style={{ transform: [{ rotate: "-35deg" }] }}
            />
          </Pressable>
        </View>

        <Pressable
          style={{ ...styles.submit, opacity: formik.values.content === "" ? 0.5 : 1 }}
          onPress={
            formik.values.content === ""
              ? null
              : () => {
                  setIsLoading(true);
                  formik.handleSubmit();
                }
          }
          disabled={formik.values.content === "" ? true : false}
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <MaterialCommunityIcons
              name={formik.values.type === "Public" ? "send" : "bullhorn-variant"}
              size={25}
              color="#FFFFFF"
              style={{ transform: [{ rotate: "-45deg" }] }}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default NewFeedForm;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#dfdfdf",
    marginTop: 20,
  },
  close: {
    position: "absolute",
    top: 5,
    right: 5,
    padding: 5,
    borderRadius: 30,
    backgroundColor: "#4b4f53",
  },
  submit: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    backgroundColor: "#377893",
    width: 50,
    height: 50,
  },
  action: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  boxImage: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  image: {
    width: 300,
    height: 250,
    borderRadius: 10,
  },
});
