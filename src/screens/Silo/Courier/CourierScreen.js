import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, View } from "react-native";

import CourierList from "../../../components/Silo/Courier/CourierList";
import PageHeader from "../../../components/shared/PageHeader";
import { useFetch } from "../../../hooks/useFetch";

const CourierScreen = () => {
  const navigation = useNavigation();

  const { data } = useFetch(`/wm/courier`);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader title="Courier" onPress={() => navigation.goBack()} />
      </View>
      <CourierList data={data?.data} />
    </SafeAreaView>
  );
};

export default CourierScreen;

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
