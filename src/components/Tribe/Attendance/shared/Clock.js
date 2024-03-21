import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextProps } from "../../../shared/CustomStylings";

const Clock = ({ titleDuty, timeDuty, titleClock, timeInOrTimeOut, lateOrEarly }) => {
  return (
    <View style={styles.clock}>
      <View>
        <Text style={[{ fontSize: 12 }, TextProps]}>{titleDuty}</Text>
        <Text style={[{ fontSize: 12 }, TextProps]}>{timeDuty}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <View>
          <Text style={[{ fontSize: 12 }, TextProps]}>{titleClock}</Text>
          <Text style={[{ fontSize: 12 }, TextProps]}>
            {timeInOrTimeOut} ({lateOrEarly})
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Clock;

const styles = StyleSheet.create({
  clock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
