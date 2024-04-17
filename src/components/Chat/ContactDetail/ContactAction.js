import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { TextProps } from "../../shared/CustomStylings";

const ContactAction = ({ type, active_member, toggleClearChatMessage, toggleExitModal, toggleDeleteGroupModal }) => {
  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        ...styles.container,
      }}
    >
      <View
        style={{
          backgroundColor: "#f5f5f5",
          ...styles.container,
        }}
      >
        <TouchableOpacity style={{ ...styles.wrapper }} onPress={toggleClearChatMessage}>
          <Text style={[{ fontSize: 14, fontWeight: "400", color: "#EB0E29" }]}>Clear Messages</Text>
          <MaterialCommunityIcons name={"close-circle-outline"} size={15} color="#EB0E29" />
        </TouchableOpacity>

        {type === "group" && active_member === 1 && (
          <TouchableOpacity
            style={{ ...styles.wrapper, borderTopWidth: 1, borderTopColor: "#fafafa" }}
            onPress={toggleExitModal}
          >
            <Text style={[{ fontSize: 14 }, TextProps]}>Exit Group</Text>
            <MaterialCommunityIcons
              name={type === "personal" ? "not-interested" : "exit-to-app"}
              size={15}
              color="#3F434A"
            />
          </TouchableOpacity>
        )}
        {type === "group" && active_member === 0 && (
          <TouchableOpacity
            style={{ ...styles.wrapper, borderTopWidth: 1, borderTopColor: "#fafafa" }}
            onPress={toggleDeleteGroupModal}
          >
            <Text style={[{ fontSize: 14, fontWeight: "400", color: "#EB0E29" }]}>Delete Group</Text>
            <MaterialCommunityIcons
              name={type === "personal" ? "not-interested" : "trash-can-outline"}
              size={15}
              color="#EB0E29"
            />
          </TouchableOpacity>
        )}
        {/* <TouchableOpacity
          style={{ ...styles.wrapper, borderTopWidth: 1, borderTopColor: "#fafafa" }}
          onPress={toggleClearChatMessage}
        >
          <Text fontSize={14} fontWeight={400}>
            Block {name.length > 30 ? name.split(" ")[0] : name}
          </Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          style={{ ...styles.wrapper, borderTopWidth: 1, borderTopColor: "#fafafa" }}
          onPress={toggleClearChatMessage}
        >
          <Text fontSize={14} fontWeight={400}>
            Report {name.length > 30 ? name.split(" ")[0] : name}
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default ContactAction;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    marginHorizontal: 10,
    paddingVertical: 10,
    gap: 5,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 5,
    paddingVertical: 8,
  },
});
