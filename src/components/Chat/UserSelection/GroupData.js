import React from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Input from "../../shared/Forms/Input";

const GroupData = ({ pickImageHandler, image, formik }) => {
  return (
    <View style={styles.groupData}>
      <TouchableOpacity style={styles.groupImage} onPress={pickImageHandler}>
        {image ? (
          <Image style={{ height: 150, width: 150, borderRadius: 80 }} alt="group-image" source={{ uri: image.uri }} />
        ) : (
          <View style={{ alignItems: "center", gap: 5 }}>
            <MaterialCommunityIcons name="camera" size={20} color="#FFFFFF" />
            <Text style={{ color: "#FFFFFF" }}>Add group icon</Text>
          </View>
        )}
      </TouchableOpacity>

      <Input
        placeHolder="Group name"
        value={formik.values.name}
        onChangeText={(value) => formik.setFieldValue("name", value)}
      />
      {formik.errors.name && <Text style={{ fontSize: 12, color: "#F44336" }}>{formik.errors.name}</Text>}
      <Pressable
        style={{
          backgroundColor: formik.isSubmitting ? "#757575" : "#176688",
          padding: 20,
          shadowOffset: 0,
          borderWidth: 5,
          borderColor: "#FFFFFF",
          borderRadius: 40,
        }}
        onPress={formik.handleSubmit}
        disabled={formik.isSubmitting}
      >
        {formik.isSubmitting ? (
          <ActivityIndicator />
        ) : (
          <MaterialCommunityIcons name="check" size={25} color="#FFFFFF" />
        )}
      </Pressable>
    </View>
  );
};

export default GroupData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  groupImage: {
    borderRadius: 80,
    height: 150,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#176688",
  },
  groupData: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 16,
  },
});
