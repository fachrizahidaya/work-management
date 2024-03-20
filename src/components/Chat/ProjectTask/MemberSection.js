import React from "react";
import { Text, View } from "react-native";
import MemberItem from "./MemberItem";
import { FlashList } from "@shopify/flash-list";
import { TextProps } from "../../shared/CustomStylings";

const MemberSection = ({ member }) => {
  return (
    <View
      style={{
        flex: 0.5,
        borderRadius: 10,
        padding: 10,
        backgroundColor: "#FFFFFF",
        gap: 5,
      }}
    >
      <Text style={[TextProps]}>{member?.length > 1 ? "Members" : "Member"}</Text>
      <FlashList
        data={member}
        estimatedItemSize={50}
        keyExtractor={(item, index) => index}
        onEndReachedThreshold={0.1}
        renderItem={({ item, index }) => <MemberItem key={index} name={item?.user?.name} image={item?.user?.image} />}
      />
    </View>
  );
};

export default MemberSection;
