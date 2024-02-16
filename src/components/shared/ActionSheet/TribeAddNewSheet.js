import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import * as Location from "expo-location";
import { startActivityAsync, ActivityAction } from "expo-intent-launcher";

import ActionSheet from "react-native-actions-sheet";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AppState,
  Platform,
  Linking,
} from "react-native";
import Toast from "react-native-root-toast";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import useCheckAccess from "../../../hooks/useCheckAccess";
import { useFetch } from "../../../hooks/useFetch";
import ClockAttendance from "../../Tribe/Clock/ClockAttendance";
import axiosInstance from "../../../config/api";
import { TextProps, ErrorToastProps, SuccessToastProps } from "../CustomStylings";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { useLoading } from "../../../hooks/useLoading";
import SuccessModal from "../Modal/SuccessModal";

const TribeAddNewSheet = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState();
  const [status, setStatus] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [locationOn, setLocationOn] = useState(null);
  const [filledLocation, setFilledLocation] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigation = useNavigation();
  const createLeaveRequestCheckAccess = useCheckAccess("create", "Leave Requests");

  const { data: attendance, refetch: refetchAttendance } = useFetch("/hr/timesheets/personal/attendance-today");
  const { data: profile } = useFetch("/hr/my-profile");

  const { toggle: toggleClockModal, isOpen: clockModalIsOpen } = useDisclosure(false);
  const { toggle: toggleNewLeaveRequestModal, isOpen: newLeaveRequestModalIsOpen } = useDisclosure(false);

  const { isLoading: attendanceIsLoading, toggle: toggleAttendance } = useLoading(false);

  

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
   * Open settings for location
   */
  const openSetting = () => {
    if (Platform.OS == "ios") {
      Linking.openURL("app-settings:");
    } else {
      startActivityAsync(ActivityAction.LOCATION_SOURCE_SETTINGS);
    }
  };

  /**
   * Handle modal for turn on location
   */
  const showAlertToActivateLocation = () => {
    Alert.alert(
      "Activate location",
      "In order to clock-in or clock-out, you must turn the location on.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Go to Settings",
          onPress: () => openSetting(),
          style: "default",
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  const showAlertToAllowPermission = () => {
    Alert.alert(
      "Permission needed",
      "In order to clock-in or clock-out, you must give permission to access the location. You can grant this permission in the Settings app.",
      [
        {
          text: "OK",
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  /**
   * Attendance check-in and check-out handler
   */
  const attendanceCheckHandler = async () => {
    try {
      toggleAttendance();
      if (locationOn === false  ) {
        showAlertToActivateLocation();
      } else if (status === false) {
        await Location.requestForegroundPermissionsAsync();
        showAlertToAllowPermission();
      } else {
        if (dayjs().format("HH:mm") !== attendance?.time_out || !attendance) {
          const res = await axiosInstance.post(`/hr/timesheets/personal/attendance-check`, {
            longitude: location?.coords?.longitude,
            latitude: location?.coords?.latitude,
            check_from: "Mobile App",
          });

          toggleAttendance();
          refetchAttendance();
          if (location && locationOn) { 
            toggleClockModal();

          }
          // Toast.show(!attendance?.data?.time_in ? "Clock-in Success" : "Clock-out Success", SuccessToastProps);
        } else {
          // Toast.show("You already checked out at this time", ErrorToastProps);
        }
      }
    } catch (err) {
      toggleAttendance();
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  /**
   * Handle get location based on permission
   */
  const getLocation = async () => {
    try {
      if ((locationOn == false && status == false) || (locationOn == false && status == true)) {
        showAlertToActivateLocation();
        return;
      }

      if (locationOn == true && status == false) {
        await Location.requestForegroundPermissionsAsync();
        showAlertToAllowPermission();
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setFilledLocation(currentLocation);
    } catch (err) {
      console.log(err.message);
    }
  };

  // useEffect(() => {
  //   if (isLoading) {
  //     attendanceCheckHandler().then(() => {
  //       setIsLoading(false);
  //     });
  //   }
  // }, [isLoading]);

  /**
   * Handle change for the location permission status
   */
  useEffect(() => {
    const runThis = async () => {
      try {
        const isLocationEnabled = await Location.hasServicesEnabledAsync();
        setLocationOn(isLocationEnabled);

        const { granted } = await Location.getForegroundPermissionsAsync();

        setStatus(granted);
        setLocation(filledLocation);
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
    getLocation();
  }, [status, locationOn]);

  return (
    <>
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
                      isOpen: newLeaveRequestModalIsOpen,
                      toggle: toggleNewLeaveRequestModal,
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
                    <ClockAttendance
                      attendance={attendance?.data}
                      onClock={attendanceCheckHandler}
                      location={location}
                      locationOn={locationOn}
                      success={success}
                      setSuccess={setSuccess}
                      isLoading={attendanceIsLoading}
                    />
                  </Pressable>
                )
            );
          })}
        </View>
      <SuccessModal
        isOpen={clockModalIsOpen}
        toggle={toggleClockModal}
        topElement={
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{ color: !attendance?.data?.time_in ? "#FCFF58" : "#92C4FF", fontSize: 16, fontWeight: "500" }}
            >
              {!attendance?.data?.time_in ? "Clock-in" : "Clock-out"}{" "}
            </Text>
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "500" }}>success!</Text>
          </View>
        }
        bottomElement={
          <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "400" }}>
            at {!attendance?.data?.time_out ? attendance?.data?.time_in : attendance?.data?.time_out}
          </Text>
        }
      />
      </ActionSheet>


      <SuccessModal
        isOpen={newLeaveRequestModalIsOpen}
        toggle={toggleNewLeaveRequestModal}
        topElement={
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "#CFCFCF", fontSize: 16, fontWeight: "500" }}>Request </Text>
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "500" }}>sent!</Text>
          </View>
        }
        bottomElement={
          <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "400" }}>Please wait for approval</Text>
        }
      />
    </>
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