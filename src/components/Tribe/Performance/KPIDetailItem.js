import React, { useRef } from "react";

import { Pressable, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../styles/Card";
import { TextProps } from "../../shared/CustomStylings";
import { SheetManager } from "react-native-actions-sheet";
import PerformanceForm from "./PerformanceForm";

const KPIDetailItem = ({ question, target, reference, actual, description, threshold, weight, type }) => {
  const thisRef = useRef(null);

  return (
    <Pressable
      style={{
        ...card.card,
        marginVertical: 5,
        elevation: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
      }}
      onPress={() =>
        SheetManager.show("form-sheet", {
          payload: {
            children: (
              <PerformanceForm threshold={threshold} weight={weight} measurement={question} description={description} />
            ),
          },
        })
      }
    >
      <Text style={[TextProps]}>{description}</Text>
      {type == "kpi" ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <MaterialCommunityIcons name={"chart-bar"} size={15} style={{ opacity: 0.5 }} />

          <Text style={[TextProps]}>{actual || 0} of</Text>
          <Text style={[TextProps]}>{target}</Text>
        </View>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <MaterialCommunityIcons name={"widgets-outline"} size={15} style={{ opacity: 0.5 }} />

          <Text style={[TextProps]}>{target}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default KPIDetailItem;
