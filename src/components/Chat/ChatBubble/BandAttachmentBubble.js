import { View, Text, Pressable } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const BandAttachmentBubble = ({ id, type, number_id, title, myMessage, navigation }) => {
  const redirectPage = (id, type) => {
    if (type === "Project") {
      return navigation.navigate("Project Detail", { projectId: id });
    } else {
      return navigation.navigate("Task Detail", { taskId: id });
    }
  };

  return (
    <Pressable
      onPress={() => redirectPage(id, type)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: !myMessage ? "#f1f1f1" : "#1b536b",
        borderRadius: 5,
        gap: 5,
        padding: 10,
      }}
    >
      {type === "Project" && (
        <MaterialCommunityIcons name="lightning-bolt" size={20} color={!myMessage ? "#3F434A" : "#FFFFFF"} />
      )}
      {type === "Task" && (
        <MaterialCommunityIcons
          name="checkbox-marked-circle-outline"
          size={20}
          color={!myMessage ? "#3F434A" : "#FFFFFF"}
        />
      )}

      <View>
        <Text style={{ fontSize: 12, fontWeight: "400", color: !myMessage ? "#3F434A" : "#FFFFFF" }}>
          {title.length > 40 ? title.slice(0, 30) + "..." : title}
        </Text>
        <Text style={{ fontSize: 10, fontWeight: "400", color: !myMessage ? "#3F434A" : "#FFFFFF" }}>#{number_id}</Text>
      </View>
    </Pressable>
  );
};

export default BandAttachmentBubble;
