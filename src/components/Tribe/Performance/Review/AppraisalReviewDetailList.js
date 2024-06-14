import { Text, View } from "react-native";

import { TextProps } from "../../../shared/CustomStylings";

const AppraisalReviewDetailList = ({ dayjs, begin_date, end_date, target, name }) => {
  return (
    <View style={{ paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1, borderColor: "#E2E2E2" }}>
      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[TextProps]}>{name}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Text style={[{ opacity: 0.5 }, TextProps]}>
              {begin_date ? dayjs(begin_date).format("DD MMM YYYY") : "-"} to
            </Text>
            <Text style={[{ opacity: 0.5 }, TextProps]}>{end_date ? dayjs(end_date).format("DD MMM YYYY") : "-"}</Text>
          </View>
        </View>
        <View>
          <Text style={[{ opacity: 0.5 }, TextProps]}>Position</Text>
          <Text style={[TextProps]}>{target}</Text>
        </View>
      </View>
    </View>
  );
};

export default AppraisalReviewDetailList;
