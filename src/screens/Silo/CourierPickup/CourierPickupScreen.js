import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../components/shared/PageHeader";
import CourierPickupList from "../../../components/Silo/DataEntry/CourierPickupList";
import { useFetch } from "../../../hooks/useFetch";
import CourierPickupFilter from "../../../components/Silo/DataEntry/CourierPickupFilter";
import { TextProps } from "../../../components/shared/CustomStylings";
import EmptyPlaceholder from "../../../components/shared/EmptyPlaceholder";

const CourierPickupScreen = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const navigation = useNavigation();

  const fetchDataParameters = {
    begin_date: startDate,
    end_date: endDate,
  };

  const { data, isFetching } = useFetch(`/wm/courier-pickup`, [startDate, endDate], fetchDataParameters);

  /**
   * Handle start and end date archived
   * @param {*} date
   */
  const startDateChangeHandler = (date) => {
    setStartDate(date);
  };
  const endDateChangeHandler = (date) => {
    setEndDate(date);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: startDate && endDate ? "#f8f8f8" : "#FFFFFF" }]}>
      <View style={styles.header}>
        <PageHeader title="Courier Pickup" onPress={() => navigation.goBack()} />
      </View>
      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingVertical: 14,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: startDate && endDate ? "space-between" : "flex-end",
          }}
        >
          {startDate && endDate && (
            <View>
              <Text>Total AWB: {data?.data?.length}</Text>
            </View>
          )}
          <CourierPickupFilter
            startDate={startDate}
            endDate={endDate}
            startDateChangeHandler={startDateChangeHandler}
            endDateChangeHandler={endDateChangeHandler}
          />
        </View>
        {startDate && endDate ? (
          isFetching ? (
            <ActivityIndicator />
          ) : data?.data?.length > 0 ? (
            <CourierPickupList data={data?.data} />
          ) : (
            <ScrollView
            // refreshControl={<RefreshControl />}
            >
              <View style={styles.content}>
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            </ScrollView>
          )
        ) : (
          <ScrollView
          // refreshControl={<RefreshControl />}
          >
            <View style={styles.content}>
              <View style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, gap: 10 }}>
                <Image
                  style={{ height: 250, width: 250, resizeMode: "contain" }}
                  source={require("../../../assets/vectors/items.jpg")}
                  alt="empty"
                  resizeMode="contain"
                />
                <Text style={[TextProps]}>Please adjust filter to get the data</Text>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
      <TouchableOpacity
        style={styles.addIcon}
        onPress={() => {
          navigation.navigate("Entry Session");
        }}
      >
        <MaterialCommunityIcons name="barcode-scan" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CourierPickupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

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
  content: {
    marginTop: 20,
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
