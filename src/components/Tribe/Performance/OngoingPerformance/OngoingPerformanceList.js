import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { FlashList } from "@shopify/flash-list";
import OngoingPerformanceListItem from "./OngoingPerformanceListItem";

const OngoingPerformanceList = ({ data }) => {
  const navigation = useNavigation();
  return (
    <View style={{ height: 240, gap: 5 }}>
      <FlashList
        data={data}
        estimatedItemSize={50}
        onEndReachedThreshold={0.1}
        keyExtractor={(item, index) => index}
        renderItem={({ item, index }) => (
          <OngoingPerformanceListItem
            key={index}
            type={item?.type}
            period={item?.period}
            start_date={item?.startDate}
            end_date={item?.endDate}
          />
        )}
      />
    </View>
  );
};

export default OngoingPerformanceList;
