import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextProps } from "../../../../shared/CustomStylings";

const AllGood = ({ date }) => {
  return (
    <View style={{ gap: 10 }}>
      <View
        style={{
          gap: 1,
          backgroundColor: "#F5F5F5",
          borderRadius: 10,
        }}
      >
        <View
          style={{
            ...styles.content,
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: "#FFFFFF",
          }}
        >
          <Text style={[{ fontSize: 12 }, TextProps]}>Clock-in Time</Text>
          <Text style={[{ fontSize: 12 }, TextProps]}>{date?.timeIn}</Text>
        </View>
        {!date?.timeOut ? null : (
          <View
            style={{
              ...styles.content,
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#FFFFFF",
            }}
          >
            <Text style={[{ fontSize: 12 }, TextProps]}>Clock-out Time</Text>
            <Text style={[{ fontSize: 12 }, TextProps]}>{date?.timeOut}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default AllGood;

const styles = StyleSheet.create({
  clock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    height: 50,
    padding: 10,
    borderRadius: 10,
  },
});
