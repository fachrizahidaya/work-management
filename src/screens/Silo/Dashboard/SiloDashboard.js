import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import { TextProps } from "../../../components/shared/CustomStylings";

const SiloDashboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", gap: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: 700, color: "#176688" }}>Warehouse</Text>
        </View>
        <Text style={[{ fontWeight: 700 }, TextProps]}>PT Kolabora Group Indonesia</Text>
      </View>

      <ScrollView
        style={{ paddingHorizontal: 14 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl />}
      >
        <View style={styles.wrapper}></View>
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
    flex: 1,
    gap: 14,
    marginVertical: 14,
  },
});
