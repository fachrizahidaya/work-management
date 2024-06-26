import { Pressable, Text, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../../styles/Card";
import { TextProps } from "../../../shared/CustomStylings";

const AppraisalResultDetailItem = ({
  id,
  employeeKPI,
  supervisorKPI,
  employeeAppraisal,
  supervisorAppraisal,
  navigation,
  type,
  employee_score,
  supervisor_score,
}) => {
  return (
    <Pressable
      style={[
        card.card,
        {
          marginVertical: 4,
          marginHorizontal: 14,
          marginBottom: 2,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
      ]}
      onPress={() => navigation.navigate("Appraisal Employee", { id: id, type: type })}
    >
      <View style={{ flexDirection: "column", gap: 10 }}>
        <Text style={[{ fontSize: 16, fontWeight: "700" }, TextProps]}>
          {employeeKPI?.item
            ? employeeKPI?.item || supervisorKPI?.item
            : employeeAppraisal?.item || supervisorAppraisal?.item}
        </Text>
        <View style={{ gap: 5 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[TextProps]}>Employee Score: </Text>
            <Text style={[TextProps]}>{employee_score?.toFixed(1)}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[TextProps]}>Supervisor Score: </Text>
            <Text style={[TextProps]}>{supervisor_score?.toFixed(1)}</Text>
          </View>
        </View>
      </View>
      <MaterialCommunityIcons name={"chevron-right"} size={20} style={{ opacity: 0.5 }} />
    </Pressable>
  );
};

export default AppraisalResultDetailItem;
