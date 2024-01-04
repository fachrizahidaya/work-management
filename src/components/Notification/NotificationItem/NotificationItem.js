import React from "react";
import { useNavigation } from "@react-navigation/native";

import RenderHtml from "react-native-render-html";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { TextProps } from "../../shared/CustomStylings";

const NotificationItem = ({ name, modul, content, itemId, time, isRead }) => {
  const { width } = Dimensions.get("screen");
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        if (modul === "Task") {
          navigation.navigate("Task Detail", { taskId: itemId });
        } else if (modul === "Project") {
          navigation.navigate("Project Detail", { projectId: itemId });
        }
      }}
    >
      <View style={{ display: "flex", flexDirection: "row", gap: 12, alignItems: "center", marginBottom: 25 }}>
        <Text style={[{ width: 42, fontWeight: !isRead ? "bold" : 400 }, TextProps]}>{time.split(" ")[1]}</Text>

        <View
          style={{
            borderWidth: 2,
            borderRadius: 10,
            height: "100%",
            borderColor: modul === "Task" ? "#FF965D" : "#49C96D",
          }}
        />

        <View style={{ flex: 1, display: "flex" }}>
          <Text style={[{ fontWeight: !isRead ? "bold" : 400 }, TextProps]}>{name}</Text>
          <View>
            <RenderHtml
              contentWidth={width}
              source={{
                html: !isRead ? `<span style="fontWeight: bold; color: #3F434A;">${content}<span>` : content,
              }}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationItem;
