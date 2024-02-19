import React from "react";
import { Text, View } from "react-native";
import { TextProps } from "../../../shared/CustomStylings";

const ConfirmedCommentDetailList = ({ dayjs, begin_date, end_date, target, name, title, type }) => {
  return (
    <View
style={{
  paddingVertical: 14,
  paddingHorizontal: 16,
  borderWidth: 1,
  borderColor: "#E2E2E2",
}}
>
<View style={{ gap: type === 'personal' ? null : 10 }}>
  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
    <Text
      style={[
        {
        },
        TextProps,
      ]}
    >
      {type === 'personal' ? title : name }
    </Text>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
      <Text style={[{ opacity: 0.5 }, TextProps]}>
        {begin_date ? type === 'personal' ? dayjs(begin_date).format("DD-MM-YY") : dayjs(begin_date).format("DD MMM YYYY") : "-"} to
      </Text>
      <Text style={[{ opacity: 0.5 }, TextProps]}>{end_date ? type === 'personal' ? dayjs(end_date).format("DD-MM-YY") : dayjs(end_date).format("DD MMM YYYY") : "-"}</Text>
    </View>
  </View>
  <View>
    <Text style={[TextProps]}>{type === 'personal' ? null : title}</Text>
  </View>
</View>
</View>
  );
};

export default ConfirmedCommentDetailList;
