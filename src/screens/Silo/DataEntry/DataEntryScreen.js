import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import PageHeader from "../../../components/shared/PageHeader";
import DataEntrySessions from "../../../components/Silo/DataEntry/DataEntrySessions";
import { useFetch } from "../../../hooks/useFetch";

const DataEntryScreen = () => {
  const sessions = [
    { date: "2024-05-17", shift: 1, person_in_charge: "Riza" },
    { date: "2024-05-18", shift: 2, person_in_charge: "Huda" },
  ];

  const { data } = useFetch(`/wm/courier-pickup`);

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader title="Data Entry" onPress={() => navigation.goBack()} />
      </View>
      <TouchableOpacity
        style={styles.addIcon}
        onPress={() => {
          navigation.navigate("Entry Session");
        }}
      >
        <MaterialCommunityIcons name="barcode-scan" size={30} color="#FFFFFF" />
      </TouchableOpacity>
      <DataEntrySessions data={data?.data} navigation={navigation} dayjs={dayjs} />
    </SafeAreaView>
  );
};

export default DataEntryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 14,
  },
  scanner: {
    height: 500,
    width: 500,
  },
  addIcon: {
    backgroundColor: "#377893",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 30,
    right: 15,
    zIndex: 2,
    borderRadius: 30,
    shadowOffset: 0,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
});
