import React from "react";
import { Text, View } from "react-native";
import { TextProps } from "../../shared/CustomStylings";

const KPIDetailList = ({ dayjs, question }) => {
  return (
    <View
      style={{
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: "#E2E2E2",
      }}
    >
      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={[
              {
                paddingVertical: 5,
                paddingHorizontal: 15,
                backgroundColor: "#D9D9D9",
                borderRadius: 15,
                textAlign: "center",
              },
              TextProps,
            ]}
          >
            {question.status}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Text style={[{ opacity: 0.5 }, TextProps]}>{dayjs(question.startDate).format("DD MMM YYYY")} to</Text>
            <Text style={[{ opacity: 0.5 }, TextProps]}>{dayjs(question.endDate).format("DD MMM YYYY")}</Text>
          </View>
        </View>
        <View>
          <Text style={[{ opacity: 0.5 }, TextProps]}>Position</Text>
          <Text style={[TextProps]}>{question.position?.position_name}</Text>
        </View>
      </View>
    </View>
  );
};

export default KPIDetailList;
