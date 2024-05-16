import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import * as Location from "expo-location";
import { startActivityAsync, ActivityAction } from "expo-intent-launcher";

import ActionSheet from "react-native-actions-sheet";
import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View, AppState, Platform, Linking } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import useCheckAccess from "../../../hooks/useCheckAccess";
import { useFetch } from "../../../hooks/useFetch";
import ClockAttendance from "../../Tribe/Clock/ClockAttendance";
import { TextProps, ErrorToastProps } from "../CustomStylings";
import { useDisclosure } from "../../../hooks/useDisclosure";
import SuccessModal from "../Modal/SuccessModal";
import ConfirmationModal from "../ConfirmationModal";

const TribeAddNewSheet = (props) => {
  const [location, setLocation] = useState({});
  const [locationOn, setLocationOn] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [requestType, setRequestType] = useState("");

  const navigation = useNavigation();
  const createLeaveRequestCheckAccess = useCheckAccess("create", "Leave Requests");

  const { data: attendance, refetch: refetchAttendance } = useFetch("/hr/timesheets/personal/attendance-today");
  const { data: profile } = useFetch("/hr/my-profile");

  const { toggle: toggleClockModal, isOpen: clockModalIsOpen } = useDisclosure(false);
  const { toggle: toggleNewLeaveRequestModal, isOpen: newLeaveRequestModalIsOpen } = useDisclosure(false);
  const { isOpen: attendanceModalIsopen, toggle: toggleAttendanceModal } = useDisclosure(false);

  const items = [
    {
      icons: "clipboard-clock-outline",
      title: `New Leave Request ${createLeaveRequestCheckAccess ? "" : "(No access)"}`,
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

  // const leaveCondition =
  //   attendance?.data?.att_type === "Leave" &&
  //   (attendance?.data?.day_type === "Work Day" || attendance?.data?.day_type === "Day Off");

  // const holidayCondition =
  //   (attendance?.data?.att_type === "Holiday" &&
  //     (attendance?.data?.day_type === "Work Day" || attendance?.data?.day_type === "Day Off")) ||
  //   attendance?.data?.day_type === "Holiday";

  // const weekend = attendance?.data?.day_type === "Weekend";

  // const dayoff = attendance?.data?.day_type === "Day Off";

  const checkIsLocationActiveAndLocationPermissionAndGetCurrentLocation = async () => {
    try {
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      setLocationOn(isLocationEnabled);

      if (!isLocationEnabled) {
        showAlertToActivateLocation();
        return;
      } else {
        const { granted } = await Location.getForegroundPermissionsAsync();
        setLocationPermission(granted);

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation?.coords);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Handle submit attendance clock-in and out
   */
  const attendanceSubmit = () => {
    if (!locationOn) {
      showAlertToActivateLocation();
      return;
    }
    if (!locationPermission) {
      showAlertToAllowPermission();
      return;
    }
    if (dayjs().format("HH:mm") !== attendance?.data?.time_out || !attendance) {
      toggleAttendanceModal();
    }
  };

  useEffect(() => {
    const checkPermissionRequest = async () => {
      if (!locationPermission) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          showAlertToAllowPermission();
          return;
        }
      }
    };

    checkPermissionRequest();
  }, [locationPermission]);

  useEffect(() => {
    /**
     * Handle device state change
     * @param {*} nextAppState
     */
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState == "active") {
        checkIsLocationActiveAndLocationPermissionAndGetCurrentLocation();
      } else {
        checkIsLocationActiveAndLocationPermissionAndGetCurrentLocation();
      }
    };

    AppState.addEventListener("change", handleAppStateChange);
    checkIsLocationActiveAndLocationPermissionAndGetCurrentLocation(); // Initial run when the component mounts
  }, [locationOn, locationPermission]);

  return (
    <>
      <ActionSheet ref={props.reference}>
        <View style={styles.container}>
          {items.map((item, idx) => {
            return item.title !== "Clock in" ? (
              <TouchableOpacity
                key={idx}
                style={styles.wrapper}
                onPress={() => {
                  if (item.title === "New Leave Request ") {
                    navigation.navigate("New Leave Request", {
                      employeeId: profile?.data?.id,
                      toggle: toggleNewLeaveRequestModal,
                      setRequestType: setRequestType,
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
            ) : !attendance?.data ? null : (
              <Pressable key={idx} style={styles.wrapper}>
                <ClockAttendance
                  attendance={attendance?.data}
                  onClock={attendanceSubmit}
                  location={location}
                  locationOn={locationOn}
                  modalIsOpen={attendanceModalIsopen}
                />
              </Pressable>
            );
          })}
        </View>

        <ConfirmationModal
          isOpen={attendanceModalIsopen}
          toggle={toggleAttendanceModal}
          apiUrl={`/hr/timesheets/personal/attendance-check`}
          body={{
            longitude: location?.longitude,
            latitude: location?.latitude,
            check_from: "Mobile App",
          }}
          hasSuccessFunc={true}
          onSuccess={() => {
            setRequestType("clock");
            refetchAttendance();
          }}
          description={`Are you sure want to ${attendance?.data?.att_type === "Alpa" ? "Clock-in" : "Clock-out"}?`}
          successMessage={`Process success`}
          isDelete={false}
          isGet={false}
          isPatch={false}
          toggleOtherModal={toggleClockModal}
          showSuccessToast={false}
        />

        <SuccessModal
          isOpen={clockModalIsOpen}
          toggle={toggleClockModal}
          title={`${attendance?.data?.time_in ? "Clock-in" : "Clock-out"} success!`}
          description={`at ${
            attendance?.data?.time_in
              ? dayjs(attendance?.data?.time_in).format("HH:mm")
              : dayjs(attendance?.data?.time_out).format("HH:mm") || dayjs().format("HH:mm")
          }`}
          color={attendance?.data?.time_in ? "#FCFF58" : "#92C4FF"}
        />
      </ActionSheet>

      <SuccessModal
        isOpen={newLeaveRequestModalIsOpen}
        toggle={toggleNewLeaveRequestModal}
        type={requestType}
        title="Request sent!"
        description="Please wait for approval"
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
    borderBottomWidth: 1,
    borderColor: "#E8E9EB",
  },
  flex: {
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
});
