import { Dimensions, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { TextProps } from "../../../components/shared/CustomStylings";
import EmptyPlaceholder from "../../../components/shared/EmptyPlaceholder";

const height = Dimensions.get("screen").height - 300;

const SiloDashboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", gap: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: 700, color: "#176688" }}>Warehouse</Text>
        </View>
        <Text style={[{ fontWeight: 700 }, TextProps]}>PT Kolabora Group Indonesia</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          <EmptyPlaceholder text="No Data" height={250} width={250} padding={150} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SiloDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: height,
  },
});
