import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import ActionSheet from "react-native-actions-sheet";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";

import useCheckAccess from "../../../hooks/useCheckAccess";
import { useFetch } from "../../../hooks/useFetch";
import ClockAttendance from "../../Tribe/Clock/ClockAttendance";
import axiosInstance from "../../../config/api";

const TribeAddNewSheet = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(dayjs().format("HH:mm"));
  const navigation = useNavigation();
  const createLeaveRequestCheckAccess = useCheckAccess("create", "Leave Requests");

  const { data: attendance, refetch: refetchAttendance } = useFetch("/hr/timesheets/personal/attendance-today");
  const { data: profile } = useFetch("/hr/my-profile");
  const { data: personalLeave, refetch: refetchPersonalLeave } = useFetch("/hr/leave-requests/personal");

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
      if (dayjs().format("HH:mm") !== attendance?.time_out || !attendance) {
        const res = await axiosInstance.post(`/hr/timesheets/personal/attendance-check`);

        refetchAttendance();

        Toast.show({
          type: "success",
          text1: !attendance?.data?.time_in ? "Clock-in Success" : "Clock-out Success",
          position: "bottom",
        });
      } else {
        Toast.show({
          type: "success",
          text1: "You already checked out at this time",
          position: "bottom",
        });
      }
    } catch (err) {
      console.log(err.response.data.message);

      Toast.show({
        type: "error",
        text1: err.response.data.message,
        position: "bottom",
      });
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
   * Clock Handler
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(dayjs().format("HH:mm"));
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <ActionSheet ref={props.reference}>
      {items.map((item, idx) => {
        return (
          <TouchableOpacity
            key={idx}
            borderColor="#E8E9EB"
            borderBottomWidth={1}
            style={styles.wrapper}
            onPress={() => {
              if (item.title === "New Leave Request") {
                navigation.navigate("New Leave Request", {
                  employeeId: profile?.data?.id,
                });
              } else if (item.title === "New Reimbursement") {
                navigation.navigate("New Reimbursement");
              } else if (item.title === "Clock in") {
                attendanceCheckHandler();
              }
              props.reference.current?.hide();
            }}
          >
            {item.title !== "Clock in" ? (
              <View style={styles.flex}>
                <View style={styles.item}>
                  <MaterialCommunityIcons name={item.icons} size={20} />
                </View>
                <Text key={item.title} style={styles.text}>
                  {item.title}
                </Text>
              </View>
            ) : (
              <ClockAttendance
                item={item}
                attendance={attendance?.data}
                currentTime={currentTime}
                attendanceCheckHandler={attendanceCheckHandler}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </ActionSheet>
  );
};

export default TribeAddNewSheet;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E9EB",
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
