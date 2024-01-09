import React from "react";
import { Dimensions, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

const PerformanceStatistic = () => {
  const screenWidth = Dimensions.get("window").width;

  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "#FFFFFF",
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(63,67,74, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  const data = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        data: [60, 90, 50, 80],
      },
    ],
  };

  return (
    <View
      style={{
        paddingHorizontal: 15,
        borderRadius: 15,
        backgroundColor: "#FFFFFF",
        marginVertical: 10,
        marginHorizontal: 10,
      }}
    >
      <Text>Performance Statistic</Text>
      <View>
        <BarChart
          style={{
            width: "100%",
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
          }}
          fromZero={true}
          data={data}
          width={screenWidth}
          height={300}
          chartConfig={chartConfig}
          withInnerLines={false}
          withCustomBarColorFromData={true}
        />
      </View>
    </View>
  );
};

export default PerformanceStatistic;
