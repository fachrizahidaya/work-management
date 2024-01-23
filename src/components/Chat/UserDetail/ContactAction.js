import { View, Text, Pressable, TouchableOpacity } from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { TextProps } from "../../shared/CustomStylings";

const ContactAction = ({ type, active_member, toggleClearChatMessage, toggleExitModal, toggleDeleteGroupModal }) => {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        gap: 5,
      }}
    >
      <TouchableOpacity
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingHorizontal: 5,
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: "#fafafa",
        }}
        onPress={toggleClearChatMessage}
      >
        <Text style={[{ fontSize: 14 }, TextProps]}>Clear Messages</Text>
      </TouchableOpacity>

      {type === "group" && active_member === 1 && (
        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 5,
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: "#fafafa",
          }}
          onPress={toggleExitModal}
        >
          <MaterialIcons name={type === "personal" ? "not-interested" : "exit-to-app"} size={15} color="#3F434A" />
          <Text style={[{ fontSize: 14 }, TextProps]}>Exit Group</Text>
        </TouchableOpacity>
      )}
      {type === "group" && active_member === 0 && (
        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 5,
            paddingVertical: 8,
            gap: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#fafafa",
          }}
          onPress={toggleDeleteGroupModal}
        >
          <MaterialIcons name={type === "personal" ? "not-interested" : "exit-to-app"} size={15} color="#3F434A" />
          <Text style={[{ fontSize: 14 }, TextProps]}>Delete Group</Text>
        </TouchableOpacity>
      )}
      {/* <Pressable display="flex" gap={2} flexDirection="row" alignItems="center" onPress={toggleClearChatMessage}>
        <Text fontSize={14} fontWeight={400}>
          Block {name.length > 30 ? name.split(" ")[0] : name}
        </Text>
      </Pressable> */}
      {/* <Pressable display="flex" gap={2} flexDirection="row" alignItems="center" onPress={toggleClearChatMessage}>
        <Text fontSize={14} fontWeight={400}>
          Report {name.length > 30 ? name.split(" ")[0] : name}
        </Text>
      </Pressable> */}
    </View>
  );
};

export default ContactAction;
