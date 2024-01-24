import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import * as Location from "expo-location";

import ActionSheet from "react-native-actions-sheet";
import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View, AppState } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-root-toast";

import useCheckAccess from "../../../hooks/useCheckAccess";
import { useFetch } from "../../../hooks/useFetch";
import ClockAttendance from "../../Tribe/Clock/ClockAttendance";
import axiosInstance from "../../../config/api";
import { TextProps, ErrorToastProps, SuccessToastProps } from "../CustomStylings";

const TribeAddNewSheet = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState();
  const [status, setStatus] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);

  const navigation = useNavigation();
  const createLeaveRequestCheckAccess = useCheckAccess("create", "Leave Requests");

  const { data: attendance, refetch: refetchAttendance } = useFetch("/hr/timesheets/personal/attendance-today");
  const { data: profile } = useFetch("/hr/my-profile");

  const items = [
    createLeaveRequestCheckAccess && {
      icons: "clipboard-clock-outline",
      title: `New Leave Request`,
    },
    // {
    //   icons: "clipboard-minus-outline",
    //   title: "New Reimbursement",
    // },
    {
      icons: "clock-outline",
      title: `Clock in`,
    },
  ];

  /**
   * Attendance check-in and check-out handler
   */
  const attendanceCheckHandler = async () => {
    try {
      if (!location) {
        Alert.alert(
          "Allow location permission.\nGo to Settigs > Apps & permissions > App manager > Nest > Location > Allow location"
        );
      } else {
        if (dayjs().format("HH:mm") !== attendance?.time_out || !attendance) {
          const res = await axiosInstance.post(`/hr/timesheets/personal/attendance-check`, {
            longitude: location?.coords?.longitude,
            latitude: location?.coords?.latitude,
            check_from: "Mobile App",
          });

          refetchAttendance();

          Toast.show(!attendance?.data?.time_in ? "Clock-in Success" : "Clock-out Success", SuccessToastProps);
        } else {
          Toast.show("You already checked out at this time", ErrorToastProps);
        }
      }
    } catch (err) {
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  /**
   * Handle get location based on permission
   */
  const getLocationPermissions = async () => {
    try {
      if (status === false) {
        await Location.requestForegroundPermissionsAsync();
        console.log("Allow location permission");
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    } catch (err) {
      console.log(err.message);
      Alert.alert(
        "Allow location permission.\nGo to Settigs > Apps & permissions > App manager > Nest > Location > Allow location"
      );
    }
  };

  useEffect(() => {
    if (isLoading) {
      attendanceCheckHandler().then(() => {
        setIsLoading(false);
      });
    }
  }, [isLoading]);

  /**
   * Handle change for the location permission status
   */
  useEffect(() => {
    const runThis = async () => {
      try {
        const { granted } = await Location.getForegroundPermissionsAsync();
        setStatus(granted);
      } catch (err) {
        console.log(err);
      }
    };

    const handleAppStateChange = (nextAppState) => {
      setAppState(nextAppState);
      if (nextAppState === "active") {
        // App has come to the foreground
        runThis();
      }
    };

    AppState.addEventListener("change", handleAppStateChange);
    runThis(); // Initial run when the component mounts
  }, []);

  useEffect(() => {
    getLocationPermissions();
  }, [status]);

  return (
    <ActionSheet ref={props.reference}>
      <View style={styles.container}>
        {items.slice(0, 2).map((item, idx) => {
          return item.title !== "Clock in" ? (
            <TouchableOpacity
              key={idx}
              borderColor="#E8E9EB"
              borderBottomWidth={1}
              style={{ ...styles.wrapper, borderBottomWidth: 1, borderColor: "#E8E9EB" }}
              onPress={() => {
                if (item.title === "New Leave Request") {
                  navigation.navigate("New Leave Request", {
                    employeeId: profile?.data?.id,
                  });
                } else if (item.title === "New Reimbursement") {
                  navigation.navigate("New Reimbursement");
                }

                props.reference.current?.hide();
              }}
            >
              <View style={styles.flex}>
                <View style={styles.item}>
                  <MaterialCommunityIcons name={item.icons} size={20} color="#3F434A" />
                </View>
                <Text key={item.title} style={[{ fontSize: 14 }, TextProps]}>
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            attendance?.data &&
              attendance?.data?.day_type === "Work Day" &&
              attendance?.date?.att_type !== "Leave" &&
              attendance?.data?.att_type !== "Holiday" && (
                <Pressable key={idx} style={{ ...styles.wrapper, borderBottomWidth: 1, borderColor: "#E8E9EB" }}>
                  <ClockAttendance attendance={attendance?.data} onClock={attendanceCheckHandler} location={location} />
                </Pressable>
              )
          );
        })}
      </View>
    </ActionSheet>
  );
};

export default TribeAddNewSheet;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 21,
  },
  item: {
    backgroundColor: "#f7f7f7",
    borderRadius: 5,
    height: 32,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "800",
    color: "black",
  },
});
