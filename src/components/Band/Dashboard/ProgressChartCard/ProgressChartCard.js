import React, { memo } from "react";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { TouchableOpacity, View, Text } from "react-native";
import { Divider } from "native-base";
import { ProgressChart } from "react-native-chart-kit";

import { card } from "../../../../styles/Card";
import { TextProps } from "../../../shared/CustomStylings";

const ProgressChartCard = ({ data, open, onProgress, finish }) => {
  const navigation = useNavigation();
  const menuSelector = useSelector((state) => state.user_menu);

  const color = ["rgba(23, 102, 136, 0.2)", "rgba(252, 210, 65, 0.2)", "rgba(255, 150, 93, 0.2)"];

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "#fff",
    backgroundGradientToOpacity: 1,
    color: (opacity = 1, index) => color[index],
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  return (
    <TouchableOpacity style={[card.card, { flex: 1 }]}>
      <View style={{ display: "flex", flexDirection: "column" }}>
        <Text style={[{ fontSize: 20, fontWeight: 500 }, TextProps]}>This Year Tasks</Text>
        <View>
          <ProgressChart
            data={data}
            width={200}
            height={200}
            strokeWidth={16}
            radius={32}
            chartConfig={chartConfig}
            hideLegend={true}
            withCustomBarColorFromData={true}
            center={true}
            style={{
              width: "100%",
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
            }}
          />
        </View>

        <View style={{ display: "flex", flexDirection: "row", gap: 8, justifyContent: "center" }}>
          <View style={{ display: "flex", alignItems: "center" }}>
            <View style={{ width: 8, height: 8, borderRadius: 50, backgroundColor: "#176688" }} />
            <Text style={[{ fontSize: 24, fontWeight: "bold" }, TextProps]}>{open}</Text>
            <Text style={TextProps}>Open</Text>
          </View>

          <View style={{ borderWidth: 1, borderColor: "#f8f8f8" }} />

          <View style={{ display: "flex", alignItems: "center" }}>
            <View style={{ width: 8, height: 8, borderRadius: 50, backgroundColor: "#fcd241" }}></View>
            <Text style={[{ fontSize: 24, fontWeight: "bold" }, TextProps]}>{onProgress}</Text>
            <Text style={TextProps}>In Progress</Text>
          </View>

          <View style={{ borderWidth: 1, borderColor: "#f8f8f8" }} />

          <View style={{ display: "flex", alignItems: "center" }}>
            <View style={{ width: 8, height: 8, borderRadius: 50, backgroundColor: "#FF965D" }}></View>
            <Text style={[{ fontSize: 24, fontWeight: "bold" }, TextProps]}>{finish}</Text>
            <Text style={TextProps}>Finish</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ProgressChartCard);
