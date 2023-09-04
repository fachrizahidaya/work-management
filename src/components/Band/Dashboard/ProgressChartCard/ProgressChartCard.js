import React from "react";
import { Dimensions } from "react-native";
import { Box, Divider, Flex, Text } from "native-base";
import { ProgressChart } from "react-native-chart-kit";
import { card } from "../../../../styles/Card";

const ProgressChartCard = ({ data, open, onProgress, finish }) => {
  const screenWidth = Dimensions.get("window").width;

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
    <Flex flexDir="column" style={card.card}>
      <Text fontSize={20}>This Year Tasks</Text>

      <ProgressChart
        data={data}
        width={screenWidth - 70}
        height={200}
        strokeWidth={16}
        radius={32}
        chartConfig={chartConfig}
        hideLegend={true}
        withCustomBarColorFromData={true}
        center={true}
        style={{ width: "100%" }}
      />

      <Flex flexDir="row" gap={5} justifyContent="center">
        <Flex alignItems="center">
          <Box w={2} h={2} borderRadius={50} bgColor="#176688"></Box>
          <Text fontSize={24} bold>
            {open}
          </Text>
          <Text fontWeight={400}>Open</Text>
        </Flex>

        <Divider orientation="vertical" />

        <Flex alignItems="center">
          <Box w={2} h={2} borderRadius={50} bgColor="#fcd241"></Box>
          <Text fontSize={24} bold>
            {onProgress}
          </Text>
          <Text fontWeight={400}>In Progress</Text>
        </Flex>

        <Divider orientation="vertical" />

        <Flex alignItems="center">
          <Box w={2} h={2} borderRadius={50} bgColor="#FF965D"></Box>
          <Text fontSize={24} bold>
            {finish}
          </Text>
          <Text fontWeight={400}>Finish</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProgressChartCard;
