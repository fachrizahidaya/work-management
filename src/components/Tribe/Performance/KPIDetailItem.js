import React from "react";

import { Pressable, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { card } from "../../../styles/Card";
import { TextProps } from "../../shared/CustomStylings";
import { FlashList } from "@shopify/flash-list";

const KPIDetailItem = ({ question, navigation }) => {
  return (
    <FlashList
      data={question}
      estimatedItemSize={50}
      onEndReachedThreshold={0.1}
      keyExtractor={(item, index) => index}
      renderItem={({ item, index }) => (
        <Pressable
          style={{
            ...card.card,
            marginVertical: 5,
            elevation: 1,
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 10,
          }}
          onPress={() => navigation.navigate("KPI Detail")}
        >
          <Text style={[TextProps]}>{item?.title}</Text>
          <MaterialCommunityIcons name="calendar-month" size={15} style={{ opacity: 0.5 }} />
        </Pressable>
      )}
    />
  );
};

export default KPIDetailItem;
