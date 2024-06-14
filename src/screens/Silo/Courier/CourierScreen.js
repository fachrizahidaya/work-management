import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, View } from "react-native";

import CourierList from "../../../components/Silo/Courier/CourierList";
import PageHeader from "../../../components/shared/PageHeader";
import { useFetch } from "../../../hooks/useFetch";
import CardSkeleton from "../../../components/Coin/shared/CardSkeleton";

const CourierScreen = () => {
  const navigation = useNavigation();

  const { data, isFetching, isLoading, refetch } = useFetch(`/wm/courier`);

  const renderSkeletons = () => {
    const skeletons = [];
    for (let i = 0; i < 2; i++) {
      skeletons.push(<CardSkeleton key={i} />);
    }
    return skeletons;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader title="Courier" onPress={() => navigation.goBack()} />
      </View>
      <CourierList
        data={data?.data}
        isFetching={isFetching}
        refetch={refetch}
        isLoading={isLoading}
        renderSkeletons={renderSkeletons}
      />
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
