import { StyleSheet, Text, View } from "react-native";
import React from "react";

const NotificationScreen = ({ route }) => {
  const { module } = route.params;

  return (
    <View>
      <Text>NotificationScreen</Text>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({});
