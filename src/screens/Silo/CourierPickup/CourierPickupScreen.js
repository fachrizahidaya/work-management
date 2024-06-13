import { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import {
  ActivityIndicator,
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../components/shared/PageHeader";
import CourierPickupList from "../../../components/Silo/DataEntry/CourierPickupList";
import { useFetch } from "../../../hooks/useFetch";
import CourierPickupFilter from "../../../components/Silo/DataEntry/CourierPickupFilter";
import EmptyPlaceholder from "../../../components/shared/EmptyPlaceholder";
import CourierPickupCountList from "../../../components/Silo/DataEntry/CourierPickupCountList";
import CardSkeleton from "../../../components/Coin/shared/CardSkeleton";

const height = Dimensions.get("screen").height - 450;

const CourierPickupScreen = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState("00:00:01");
  const [endTime, setEndTime] = useState("23:59:59");
  const [fullDateStart, setFullDateStart] = useState("");
  const [fullDateEnd, setFullDateEnd] = useState("");
  const [hideScanIcon, setHideScanIcon] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(null);

  const navigation = useNavigation();
  const scrollOffsetY = useRef(0);
  const SCROLL_THRESHOLD = 20;

  const fetchDataParameters =
    Platform.OS === "ios"
      ? {
          begin_date: startDate || dayjs().format("YYYY-MM-DD 00:00:01"),
          end_date: endDate || dayjs().format("YYYY-MM-DD 23:59:00"),
        }
      : {
          begin_date: fullDateStart || dayjs().format("YYYY-MM-DD 00:00:01"),
          end_date: fullDateEnd || dayjs().format("YYYY-MM-DD 23:59:00"),
        };

  const { data, isFetching, isLoading, refetch } = useFetch(
    `/wm/courier-pickup`,
    [startDate, endDate],
    fetchDataParameters
  );

  const updateFullDateStart = (date, time) => {
    if (date && time) {
      setFullDateStart(`${date} ${time}`);
    }
  };

  const updateFullDateEnd = (date, time) => {
    if (date && time) {
      setFullDateEnd(`${date} ${time}`);
    }
  };

  const startDateChangeHandler = (date) => {
    setStartDate(date);
    if (Platform.OS === "android") {
      updateFullDateStart(date, startTime);
    }
  };

  const endDateChangeHandler = (date) => {
    setEndDate(date);
    if (Platform.OS === "android") {
      updateFullDateEnd(date, endTime);
    }
  };

  const startTimeChangeHandler = (time) => {
    setStartTime(time);
    if (Platform.OS === "android") {
      updateFullDateStart(startDate, time);
    }
  };

  const endTimeChangeHandler = (time) => {
    setEndTime(time);
    if (Platform.OS === "android") {
      updateFullDateEnd(endDate, time);
    }
  };

  const scrollHandler = (event) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    const offsetDifference = currentOffsetY - scrollOffsetY.current;

    if (Math.abs(offsetDifference) < SCROLL_THRESHOLD) {
      return; // Ignore minor scrolls
    }

    if (currentOffsetY > scrollOffsetY.current) {
      if (scrollDirection !== "down") {
        setHideScanIcon(true); // Scrolling down
        setScrollDirection("down");
      }
    } else {
      if (scrollDirection !== "up") {
        setHideScanIcon(false); // Scrolling up
        setScrollDirection("up");
      }
    }

    scrollOffsetY.current = currentOffsetY;
  };

  const renderSkeletons = () => {
    const skeletons = [];
    for (let i = 0; i < 2; i++) {
      skeletons.push(<CardSkeleton key={i} />);
    }
    return skeletons;
  };

  useEffect(() => {
    if (startDate && startTime) {
      updateFullDateStart(startDate, startTime);
    }
    if (endDate && endTime) {
      updateFullDateEnd(endDate, endTime);
    }
  }, [startDate, startTime, endDate, endTime]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#f8f8f8" }]}>
      <View style={styles.header}>
        <PageHeader title="Courier Pickup" onPress={() => navigation.goBack()} />
        <CourierPickupFilter
          startDate={startDate}
          endDate={endDate}
          startDateChangeHandler={startDateChangeHandler}
          endDateChangeHandler={endDateChangeHandler}
          startTime={startTime}
          endTime={endTime}
          startTimeChangeHandler={startTimeChangeHandler}
          endTimeChangeHandler={endTimeChangeHandler}
        />
      </View>
      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingVertical: 14,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <CourierPickupCountList totalData={data?.total_data} />
        </View>
        {isLoading ? (
          <View style={{ paddingHorizontal: 2, gap: 2 }}>{renderSkeletons()}</View>
        ) : data?.data?.length > 0 ? (
          <CourierPickupList data={data?.data} handleScroll={scrollHandler} />
        ) : (
          <ScrollView refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}>
            <View style={styles.content}>
              <EmptyPlaceholder height={250} width={250} text="No Data" />
            </View>
          </ScrollView>
        )}
      </View>
      {hideScanIcon ? null : (
        <TouchableOpacity
          style={styles.addIcon}
          onPress={() => {
            navigation.navigate("Entry Session");
          }}
        >
          <MaterialCommunityIcons name="barcode-scan" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      )}
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
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
    height: height,
  },
  image: {
    height: 250,
    width: 250,
    resizeMode: "contain",
  },
});
