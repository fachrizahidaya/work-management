import React, { memo } from "react";

import { TouchableOpacity, View, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useSelector } from "react-redux";

const ActiveTaskList = ({ id, task, title, responsible, status, priority, onPress, onPressItem }) => {
  const userSelector = useSelector((state) => state.auth);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderLeftWidth: 3,
        borderColor: priority === "Low" ? "#49c96d" : priority === "Medium" ? "#ff965d" : "#fd7972",
        paddingHorizontal: 4,
        marginVertical: 5,
      }}
    >
      <TouchableOpacity
        isChecked={status === "Closed"}
        onTouchEnd={() => {
          status === "Finish" && userSelector.id === task?.responsible_id && onPress(task);
        }}
        isDisabled={status !== "Finish" || userSelector.id !== task?.responsible_id}
      >
        <View style={{ display: "flex", flexDirection: "column" }}>
          <Text style={{ opacity: 0.5 }}>{responsible || "TBD"}</Text>
          <Text style={{ textDecorationLine: status === "Closed" ? "line-through" : "none", width: 200 }}>{title}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onPressItem(id)}>
        <MaterialCommunityIcons name="chevron-right" size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default memo(ActiveTaskList);
