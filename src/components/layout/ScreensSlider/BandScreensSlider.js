import React from "react";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { StyleSheet, Text, View } from "react-native";
import { Actionsheet, Icon } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const BandScreensSlider = ({ isOpen, toggle }) => {
  const navigation = useNavigation();
  const menuSelector = useSelector((state) => state.user_menu);

  return (
    <Actionsheet isOpen={isOpen} onClose={toggle}>
      <Actionsheet.Content>
        {menuSelector.user_menu.menu?.map((item, idx) => {
          return (
            <Actionsheet.Item
              key={idx}
              borderColor="#E8E9EB"
              borderBottomWidth={1}
              onPress={() => {
                navigation.navigate(item.name);
                toggle();
              }}
              _pressed={{ bgColor: "#f1f1f1" }}
            >
              <View style={styles.flex}>
                <View style={styles.item}>
                  <Icon as={<MaterialCommunityIcons name={item.mobile_icon} />} size={6} color="#2A7290" />
                </View>
                <Text style={styles.text}>{item.name}</Text>
              </View>
            </Actionsheet.Item>
          );
        })}
        <Actionsheet.Item
          borderColor="#E8E9EB"
          borderBottomWidth={1}
          onPress={() => {
            navigation.navigate("Calendar Band");
            toggle();
          }}
        >
          <View style={styles.flex}>
            <View style={styles.item}>
              <Icon as={<MaterialCommunityIcons name="calendar-clock" />} size={6} color="#2A7290" />
            </View>
            <Text style={styles.text}>Calendar</Text>
          </View>
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default BandScreensSlider;

const styles = StyleSheet.create({
  flex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 21,
  },
  item: {
    backgroundColor: "#f7f7f7",
    borderRadius: 5,
    height: 32,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "800",
    color: "black",
  },
});
