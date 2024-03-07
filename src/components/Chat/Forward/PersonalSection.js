import React from "react";
import PersonalListItem from "./PersonalListItem";
import { StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

const PersonalSection = ({ personalChats, navigation, message }) => {
  return (
    <>
      <View style={styles.header}>
        <Text style={{ fontWeight: "500", opacity: 0.5 }}>PERSONAL</Text>
      </View>

      <FlashList
        estimatedItemSize={200}
        data={personalChats}
        keyExtractor={(item, index) => index}
        onEndReachedThreshold={0.1}
        renderItem={({ item, index }) => (
          <View style={{ marginBottom: 10 }}>
            <PersonalListItem
              key={index}
              name={item?.user?.name}
              image={item?.user?.image}
              user_id={item?.user?.id}
              room_id={item?.id}
              active_member={0}
              userType={item?.user?.user_type}
              email={item?.user?.email}
              type="personal"
              navigation={navigation}
              message={message}
            />
          </View>
        )}
      />
    </>
  );
};

export default PersonalSection;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
});
