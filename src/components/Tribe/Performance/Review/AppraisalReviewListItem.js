import { Pressable, Text, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../../styles/Card";
import { TextProps } from "../../../shared/CustomStylings";

const AppraisalReviewListItem = ({
  id,
  start_date,
  end_date,
  navigation,
  name,
  target,
  dayjs,
  target_level,
  description,
}) => {
  return (
    <Pressable
      style={[card.card, { marginHorizontal: 14, marginVertical: 4, marginBottom: 4, gap: 10 }]}
      onPress={() => navigation.navigate("Review Appraisal Detail", { id: id })}
    >
      <Text style={[TextProps]}>{description}</Text>
      {target_level === "Employee" ? null : <Text style={[TextProps]}>{name}</Text>}
      <View>
        <Text style={[{ opacity: 0.5 }, TextProps]}>{target_level}</Text>
        <Text style={[TextProps]}>{target}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <MaterialCommunityIcons name="calendar-month" size={15} style={{ opacity: 0.5 }} />
        <Text style={[{ opacity: 0.5 }, TextProps]}>{dayjs(start_date).format("DD MMM YYYY")} to</Text>
        <Text style={[{ opacity: 0.5 }, TextProps]}>{dayjs(end_date).format("DD MMM YYYY")}</Text>
      </View>
    </Pressable>
  );
};

export default AppraisalReviewListItem;
