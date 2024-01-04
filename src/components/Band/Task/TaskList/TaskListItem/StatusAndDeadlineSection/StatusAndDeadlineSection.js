import React from "react";

import dayjs from "dayjs";
import { useSelector } from "react-redux";

import { View, Pressable, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextProps } from "../../../../../shared/CustomStylings";

const StatusAndDeadlineSection = ({ no, task, title, deadline, status, responsibleId, openCloseTaskConfirmation }) => {
  const userSelector = useSelector((state) => state.auth);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ display: "flex", flexDirection: "row", gap: 3, alignItems: "center", flex: 1 }}>
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
          style={[
            {
              width: 190,
              fontSize: 16,
              textDecorationLine: status === "Closed" ? "line-through" : "none",
            },
            TextProps,
          ]}
          numberOfLines={2}
        >
          {title}
          <Text style={{ color: "#176688", fontWeight: 500, fontSize: 16 }}> #{no}</Text>
        </Text>
      </View>

      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
        <MaterialCommunityIcons name="calendar-blank" />
        <Text style={[{ fontSize: 16 }, TextProps]}>{dayjs(deadline).format("MMM DD")}</Text>
      </View>
    </View>
  );
};

export default StatusAndDeadlineSection;
