import React from "react";

import { Pressable, Text, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../../styles/Card";
import { TextProps } from "../../../shared/CustomStylings";

const ConfirmedCommentDetailItem = ({
  id,
  subject,
  grade,
  total_score,
  employeeKPI,
  supervisorKPI,
  employeeAppraisal,
  supervisorAppraisal,
  navigation,
  appraisalData,
  type,
}) => {
  return (
    <Pressable
      style={{
        ...card.card,
        marginVertical: 14,
        marginBottom: 2,
        elevation: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 5,
      }}
      onPress={() => {
        if (employeeKPI && supervisorKPI) {
          navigation.navigate("KPI Employee", {
            id: id,
            type: type,
          });
        } else {
          navigation.navigate("Appraisal Employee", {
            id: id,
            type: type,
          });
        }
      }}
    >
      <View style={{ flexDirection: "column", gap: 5 }}>
        <Text style={[{ fontSize: 16, fontWeight: "700" }, TextProps]}>
          {employeeKPI?.item
            ? employeeKPI?.item || supervisorKPI?.item
            : employeeAppraisal?.item || supervisorAppraisal?.item}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[{ fontSize: 14, fontWeight: "700" }, TextProps]}>
            Grade:{" "}
          </Text>
          <Text style={[TextProps]}>{grade}</Text>
        </View>
        {employeeKPI && supervisorKPI ? (
          <>
            <Text style={[TextProps]}>
              Employee Score: {employeeKPI?.score}
            </Text>
            <Text style={[TextProps]}>
              Supervisor Score: {supervisorKPI?.score}
            </Text>
          </>
        ) : (
          <>
            <Text style={[TextProps]}>
              Employee Score: {employeeAppraisal?.score}
            </Text>
            <Text style={[TextProps]}>
              Supervisor Score: {supervisorAppraisal?.score}
            </Text>
          </>
        )}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[{ fontSize: 14, fontWeight: "700" }, TextProps]}>
            Total Score:{" "}
          </Text>
          <Text style={[{}, TextProps]}>{total_score}</Text>
        </View>
      </View>
      <MaterialCommunityIcons
        name={"chevron-right"}
        size={20}
        style={{ opacity: 0.5 }}
      />
    </Pressable>
  );
};

export default ConfirmedCommentDetailItem;
