import React from "react";

import { Pressable, Text, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../../styles/Card";
import { TextProps } from "../../../shared/CustomStylings";

const OngoingReviewKPIListItem = ({
  id,
  start_date,
  end_date,
  navigation,
  name,
  target,
  dayjs,
  target_level,
}) => {
  return (
    <Pressable
      style={{
        ...card.card,
        marginVertical: 14,
        marginBottom: 4,
        elevation: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
      }}
      onPress={() =>
        navigation.navigate("Review KPI Detail", {
          id: id,
        })
      }
    >
      <Text style={[{}, TextProps]}>{name}</Text>
      <View>
        <Text style={[{ opacity: 0.5 }, TextProps]}>{target_level}</Text>
        <Text style={[TextProps]}>{target}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <MaterialCommunityIcons
          name="calendar-month"
          size={15}
          style={{ opacity: 0.5 }}
        />
        <Text style={[{ opacity: 0.5 }, TextProps]}>
          {dayjs(start_date).format("DD MMM YYYY")} to
        </Text>
        <Text style={[{ opacity: 0.5 }, TextProps]}>
          {dayjs(end_date).format("DD MMM YYYY")}
        </Text>
      </View>
    </Pressable>
  );
};

export default OngoingReviewKPIListItem;
