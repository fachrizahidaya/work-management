import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StackedBarChart } from "react-native-chart-kit";

import { card } from "../../../styles/Card";
import { TextProps } from "../../shared/CustomStylings";

const screenWidth = Dimensions.get("window").width;

const StatisticCard = ({ sumByMonth }) => {
  const labels = Object.keys(sumByMonth);
  const valuePerMonth = [];

  for (const monthYear in sumByMonth) {
    valuePerMonth.push(sumByMonth[monthYear]);
  }

  const data = {
    labels: labels,
    data: valuePerMonth,
    barColors: ["#377893", "#FF965D"],
  };

  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    color: (opacity = 1) => `rgba(138, 144, 153, ${opacity})`,
    barPercentage: 0.6,
    propsForBackgroundLines: {
      stroke: "#f8f8f8",
    },
  };

  return (
    <TouchableOpacity style={[card.card, { flex: 1 }]}>
      <View style={{ gap: 10 }}>
        <Text style={[{ fontSize: 18, fontWeight: 500 }, TextProps]}>Statistics</Text>
        <View style={{ marginVertical: 10 }}>
          <StackedBarChart data={data} width={330} height={220} chartConfig={chartConfig} hideLegend />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StatisticCard;

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
  },
});
