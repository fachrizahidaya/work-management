import { View, Text, Pressable } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const UserAction = ({ type, active_member, toggleClearChatMessage, toggleExitModal, toggleDeleteGroupModal }) => {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        gap: 5,
      }}
    >
      <Pressable
        style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}
        onPress={toggleClearChatMessage}
      >
        <Text style={{ fontSize: 14, fontWeight: "400" }}>Clear Messages</Text>
      </Pressable>

      {type === "group" && active_member === 1 && (
        <Pressable
          style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}
          onPress={toggleExitModal}
        >
          <MaterialIcons name={type === "personal" ? "not-interested" : "exit-to-app"} size={10} />
          <Text style={{ fontSize: 14, fontWeight: "400" }}>Exit Group</Text>
        </Pressable>
      )}
      {type === "group" && active_member === 0 && (
        <Pressable
          style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}
          onPress={toggleDeleteGroupModal}
        >
          <MaterialIcons name={type === "personal" ? "not-interested" : "exit-to-app"} size={10} />
          <Text style={{ fontSize: 14, fontWeight: "400" }}>Delete Group</Text>
        </Pressable>
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

export default UserAction;
