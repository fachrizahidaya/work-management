import ActionSheet from "react-native-actions-sheet";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const BandScreenSheet = (props) => {
  const navigation = useNavigation();
  const menuSelector = useSelector((state) => state.user_menu);

  return (
    <ActionSheet ref={props.reference}>
      {menuSelector.user_menu.menu?.map((item, idx) => {
        return (
          <TouchableOpacity
            key={idx}
            onPress={() => {
              navigation.navigate(item.name);
              props.reference.current?.hide();
            }}
            style={styles.wrapper}
          >
            <View style={styles.flex}>
              <View style={styles.item}>
                <MaterialCommunityIcons size={20} name={item.mobile_icon} />
              </View>
              <Text style={styles.text}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Calendar Band");
          props.reference.current?.hide();
        }}
        style={styles.wrapper}
      >
        <View style={styles.flex}>
          <View style={styles.item}>
            <MaterialCommunityIcons size={20} name="calendar-clock" />
          </View>
          <Text style={styles.text}>Calendar</Text>
        </View>
      </TouchableOpacity>
    </ActionSheet>
  );
};

export default BandScreenSheet;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E9EB",
  },
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
