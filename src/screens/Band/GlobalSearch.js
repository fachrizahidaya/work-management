import React from "react";

import { View, Text, StyleSheet, Pressable, TouchableWithoutFeedback, Keyboard } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Input from "../../components/shared/Forms/Input";

const GlobalSearch = () => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View
          style={{
            display: "flex",
            gap: 15,
            marginHorizontal: 16,
            marginVertical: 13,
            alignItems: "center",
            justifyContent: "center",
            gap: 46,
          }}
        >
          <Input
            placeHolder="Search..."
            startAdornment={
              <Pressable>
                <MaterialCommunityIcons name="magnify" size={20} color="#3F434A" />
              </Pressable>
            }
          />

          <Text style={{ color: "#8A9099" }}>No result</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default GlobalSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
