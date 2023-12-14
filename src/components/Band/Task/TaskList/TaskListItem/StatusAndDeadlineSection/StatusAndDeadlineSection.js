import React from "react";

import dayjs from "dayjs";
import { useSelector } from "react-redux";

import { View, Pressable, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const StatusAndDeadlineSection = ({ no, task, title, deadline, status, responsibleId, openCloseTaskConfirmation }) => {
  const userSelector = useSelector((state) => state.auth);

  return (
    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <View style={{ display: "flex", flexDirection: "row", gap: 3, alignItems: "center" }}>
        {status === "Closed" || status === "Finish" ? (
          <Pressable
            onPress={() => {
              if (status === "Finish" && userSelector.id === responsibleId) {
                openCloseTaskConfirmation(task);
              }
            }}
          >
            <MaterialCommunityIcons name={status === "Closed" ? "check-circle-outline" : "circle-outline"} size={20} />
          </Pressable>
        ) : null}

        <Text
          style={{
            fontWeight: 500,
            width: 190,
            fontSize: 16,
            textDecorationLine: status === "Closed" ? "line-through" : "none",
          }}
          numberOfLines={2}
        >
          {title}
          <Text style={{ color: "#176688", fontWeight: 500, fontSize: 16 }}> #{no}</Text>
        </Text>

        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
          <MaterialCommunityIcons name="calendar-blank" />
          <Text style={{ fontWeight: 500, fontSize: 16 }}>{dayjs(deadline).format("MMM DD")}</Text>
        </View>
      </View>
    </View>
  );
};

export default StatusAndDeadlineSection;
