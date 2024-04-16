import { Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

import { card } from "../../../styles/Card";
import { TextProps } from "../../shared/CustomStylings";

const AnalyticCard = ({ sumByMonth }) => {
  if (!sumByMonth || typeof sumByMonth !== "object") {
    console.log("Invalid data");
    return null;
  }
  const labels = Object.keys(sumByMonth);

  if (!labels.length) {
    console.log("No labels found");
    return null;
  }

  const data = {
    labels: labels,
    datasets: [
      {
        data: [],
        color: (opacity = 1) => `rgba(55, 120, 147, ${opacity})`, // sales
        strokeWidth: 2,
      },
      {
        data: [],
        color: (opacity = 1) => `rgba(255, 150, 93, ${opacity})`, // purchase
        strokeWidth: 2,
      },
    ],
  };

  labels.forEach((label) => {
    const [sales, purchase] = sumByMonth[label];
    if (typeof sales === "number" && typeof purchase === "number") {
      data.datasets[0].data.push(sales);
      data.datasets[1].data.push(purchase);
    } else {
      console.log("Invalid data for label", label);
    }
  });

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(138, 144, 153, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <TouchableOpacity style={[card.card, { flex: 1 }]}>
      <View style={{ gap: 10 }}>
        <Text style={[{ fontSize: 18, fontWeight: 500 }, TextProps]}>Analytics</Text>
        <View style={{ marginVertical: 10 }}>
          <LineChart
            data={data}
            width={330}
            height={220}
            chartConfig={chartConfig}
            withVerticalLines
            withHorizontalLines={false}
            withHorizontalLabels={false}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AnalyticCard;
