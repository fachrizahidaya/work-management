import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import HistoryPerformanceListItem from "./HistoryPerformanceListItem";

const HistoryPerformanceList = ({ data }) => {
  const navigation = useNavigation();

  return (
    <View style={{ height: 240, gap: 5 }}>
      <FlashList
        data={data}
        estimatedItemSize={50}
        onEndReachedThreshold={0.1}
        keyExtractor={(item, index) => index}
        renderItem={({ item, index }) => (
          <HistoryPerformanceListItem
            key={index}
            period={item?.period}
            start_date={item?.startDate}
            end_date={item?.endDate}
            navigation={navigation}
          />
        )}
      />
    </View>
  );
};

export default HistoryPerformanceList;
