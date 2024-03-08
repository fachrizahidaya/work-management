import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import * as Location from "expo-location";
import { startActivityAsync, ActivityAction } from "expo-intent-launcher";

import ActionSheet from "react-native-actions-sheet";
import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View, AppState, Platform, Linking } from "react-native";
import Toast from "react-native-root-toast";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import useCheckAccess from "../../../hooks/useCheckAccess";
import { useFetch } from "../../../hooks/useFetch";
import ClockAttendance from "../../Tribe/Clock/ClockAttendance";
import { TextProps, ErrorToastProps, SuccessToastProps } from "../CustomStylings";
import { useDisclosure } from "../../../hooks/useDisclosure";
import SuccessModal from "../Modal/SuccessModal";
import ConfirmationModal from "../ConfirmationModal";

const TribeAddNewSheet = (props) => {
  const [location, setLocation] = useState();
  const [status, setStatus] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [locationOn, setLocationOn] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigation = useNavigation();
  const createLeaveRequestCheckAccess = useCheckAccess("create", "Leave Requests");

  const { data: attendance, refetch: refetchAttendance } = useFetch("/hr/timesheets/personal/attendance-today");
  const { data: profile } = useFetch("/hr/my-profile");

  const { toggle: toggleClockModal, isOpen: clockModalIsOpen } = useDisclosure(false);
  const { toggle: toggleNewLeaveRequestModal, isOpen: newLeaveRequestModalIsOpen } = useDisclosure(false);
  const { isOpen: attendanceModalIsopen, toggle: toggleAttendanceModal } = useDisclosure(false);

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
   * Handle open setting to check location service
   */
  const openSetting = () => {
    if (Platform.OS == "ios") {
      Linking.openURL("app-settings:");
    } else {
      startActivityAsync(ActivityAction.LOCATION_SOURCE_SETTINGS);
    }
  };

  /**
   * Handle modal to turn on location service
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

  /**
   * Handle modal to allow location permission
   */
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
   * Handle submit attendance clock-in and out
   */
  const attendanceCheckHandler = async () => {
    try {
      if (!locationOn) {
        showAlertToActivateLocation();
      } else if (!location) {
        await Location.requestForegroundPermissionsAsync();
        showAlertToAllowPermission();
      } else if (location && locationOn) {
        if (dayjs().format("HH:mm") !== attendance?.data?.time_out || !attendance) {
          toggleAttendanceModal();

          // Toast.show(!attendance?.data?.time_in ? "Clock-in Success" : "Clock-out Success", SuccessToastProps);
        } else {
          // Toast.show("You already checked out at this time", ErrorToastProps);
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
      // const { granted } = await Location.getForegroundPermissionsAsync();

      const currentLocation = await Location.getCurrentPositionAsync({});
      // setStatus(granted)
      setLocation(currentLocation);
    } catch (err) {
      console.log(err.message);
    }
  };

  /**
   * Handle change for the location permission status
   */
  useEffect(() => {
    const runThis = async () => {
      try {
        const isLocationEnabled = await Location.hasServicesEnabledAsync();
        setLocationOn(isLocationEnabled);

        const { granted } = await Location.getForegroundPermissionsAsync();
        const currentLocation = await Location.getCurrentPositionAsync({});

        setStatus(granted);
        setLocation(currentLocation);
      } catch (err) {
        console.log(err);
      }
    };

    /**
     * Handle device state change
     * @param {*} nextAppState
     */
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        // App has come to the foreground
        runThis();
      } else if (nextAppState !== "active") {
        setLocation(null);
        setStatus(null);
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
          {createLeaveRequestCheckAccess
            ? items.slice(0, 2).map((item, idx) => {
                return item.title !== "Clock in" ? (
                  <TouchableOpacity
                    key={idx}
                    borderColor="#E8E9EB"
                    borderBottomWidth={1}
                    style={{
                      ...styles.wrapper,
                      borderBottomWidth: 1,
                      borderColor: "#E8E9EB",
                    }}
                    onPress={() => {
                      if (item.title === "New Leave Request") {
                        navigation.navigate("New Leave Request", {
                          employeeId: profile?.data?.id,
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
                    (attendance?.data?.day_type === "Work Day" || attendance?.data?.day_type === "Day Off") &&
                    attendance?.date?.att_type !== "Leave" &&
                    attendance?.data?.att_type !== "Holiday" && (
                      <Pressable
                        key={idx}
                        style={{
                          ...styles.wrapper,
                          borderBottomWidth: 1,
                          borderColor: "#E8E9EB",
                        }}
                      >
                        <ClockAttendance
                          attendance={attendance?.data}
                          onClock={attendanceCheckHandler}
                          location={location}
                          locationOn={locationOn}
                          modalIsOpen={attendanceModalIsopen}
                        />
                      </Pressable>
                    )
                );
              })
            : items.slice(1, 2).map((item, idx) => {
                return item.title !== "Clock in" ? (
                  <TouchableOpacity
                    key={idx}
                    borderColor="#E8E9EB"
                    borderBottomWidth={1}
                    style={{
                      ...styles.wrapper,
                      borderBottomWidth: 1,
                      borderColor: "#E8E9EB",
                    }}
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
                    (attendance?.data?.day_type === "Work Day" || attendance?.data?.day_type === "Day Off") &&
                    attendance?.date?.att_type !== "Leave" &&
                    attendance?.data?.att_type !== "Holiday" && (
                      <Pressable
                        key={idx}
                        style={{
                          ...styles.wrapper,
                          borderBottomWidth: 1,
                          borderColor: "#E8E9EB",
                        }}
                      >
                        <ClockAttendance
                          attendance={attendance?.data}
                          onClock={attendanceCheckHandler}
                          location={location}
                          locationOn={locationOn}
                          modalIsOpen={attendanceModalIsopen}
                        />
                      </Pressable>
                    )
                );
              })}
        </View>

        <ConfirmationModal
          isOpen={attendanceModalIsopen}
          toggle={toggleAttendanceModal}
          apiUrl={`/hr/timesheets/personal/attendance-check`}
          body={{
            longitude: location?.coords?.longitude,
            latitude: location?.coords?.latitude,
            check_from: "Mobile App",
          }}
          header={`Confirm ${attendance?.data?.att_type === "Alpa" ? "Clock-in" : "Clock-out"}`}
          hasSuccessFunc={true}
          onSuccess={() => {
            setSuccess(true);
            refetchAttendance();
          }}
          description={`Are you sure want to ${attendance?.data?.att_type === "Alpa" ? "Clock-in" : "Clock-out"}?`}
          successMessage={`Process success`}
          isDelete={false}
          isGet={false}
          isPatch={false}
          otherModal={true}
          toggleOtherModal={toggleClockModal}
          successStatus={success}
          showSuccessToast={false}
        />

        <SuccessModal
          isOpen={clockModalIsOpen}
          toggle={toggleClockModal}
          onSuccess={setSuccess}
          multipleModal={true}
          topElement={
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: attendance?.data?.time_in ? "#FCFF58" : "#92C4FF",
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                {attendance?.data?.time_in ? "Clock-in" : "Clock-out"}{" "}
              </Text>
              <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "500" }}>success!</Text>
            </View>
          }
          bottomElement={
            <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "400" }}>
              at{" "}
              {attendance?.data?.time_in
                ? dayjs(attendance?.data?.time_in).format("HH:mm")
                : dayjs(attendance?.data?.time_out).format("HH:mm") || dayjs().format("HH:mm")}
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
