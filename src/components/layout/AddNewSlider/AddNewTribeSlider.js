import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { Actionsheet, Box, Flex, Icon, Text, useToast } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../hooks/useFetch";
import axiosInstance from "../../../config/api";
import { useDisclosure } from "../../../hooks/useDisclosure";
import ClockAttendance from "../../Tribe/Clock/ClockAttendance";
import useCheckAccess from "../../../hooks/useCheckAccess";
import { ErrorToast, SuccessToast } from "../../shared/ToastDialog";

const AddNewTribeSlider = ({ isOpen, toggle }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(dayjs().format("HH:mm"));
  const createLeaveRequestCheckAccess = useCheckAccess("create", "Leave Requests");

  const { data: attendance, refetch: refetchAttendance } = useFetch("/hr/timesheets/personal/attendance-today");
  const { data: profile } = useFetch("/hr/my-profile");
  const { data: personalLeave, refetch: refetchPersonalLeave } = useFetch("/hr/leave-requests/personal");

  const { data: userIp } = useFetch("https://jsonip.com/");

  const toast = useToast();

  const navigation = useNavigation();

  const { isOpen: newReimbursementIsOpen, toggle: toggleNewReimbursement } = useDisclosure(false);

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
        const res = await axiosInstance.post(`/hr/timesheets/personal/attendance-check`, {
          ip: userIp?.ip,
        });
        toggle();
        refetchAttendance();
        toast.show({
          render: ({ id }) => {
            return (
              <Box zIndex={2}>
                <SuccessToast
                  message={!attendance?.data?.time_in ? "Clock-in Success" : "Clock-out Success"}
                  close={() => toast.close(id)}
                />
              </Box>
            );
          },
        });
      } else {
        toast.show({
          render: ({ id }) => {
            return (
              <Box zIndex={2}>
                <ErrorToast message={"You already checked out at this time"} close={() => toast.close(id)} />;
              </Box>
            );
          },
        });
      }
    } catch (err) {
      console.log(err.response.data.message);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={`You're not connected to the proper connection`} close={() => toast.close(id)} />;
        },
      });
    }
  };

  useEffect(() => {
    if (userIp?.ip && isLoading) {
      attendanceCheckHandler().then(() => {
        setIsLoading(false);
      });
    }
  }, [userIp?.ip, isLoading]);

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
    <>
      <Actionsheet isOpen={isOpen} onClose={toggle}>
        <Actionsheet.Content>
          {items.map((item, idx) => {
            return (
              <Actionsheet.Item
                key={idx}
                borderColor="#E8E9EB"
                borderBottomWidth={1}
                onPress={() => {
                  if (item.title === "New Leave Request") {
                    navigation.navigate("New Leave Request", {
                      employeeId: profile?.data?.id,
                    });
                    toggle();
                  } else if (item.title === "New Reimbursement") {
                    navigation.navigate("New Reimbursement", { onClose: toggleNewReimbursement });
                    toggle();
                  } else if (item.title === "Clock in") {
                    attendanceCheckHandler();
                  }
                }}
              >
                <Flex flexDir="row" alignItems="center" gap={21}>
                  {item.title !== "Clock in" ? (
                    <>
                      <Box
                        bg="#F7F7F7"
                        borderRadius={5}
                        style={{ height: 32, width: 32 }}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={<MaterialCommunityIcons name={item.icons} />} size={6} color="#2A7290" />
                      </Box>
                      <Text key={item.title} fontWeight={700} color="#000000">
                        {item.title}
                      </Text>
                    </>
                  ) : (
                    <ClockAttendance
                      item={item}
                      attendance={attendance?.data}
                      currentTime={currentTime}
                      attendanceCheckHandler={attendanceCheckHandler}
                    />
                  )}
                </Flex>
              </Actionsheet.Item>
            );
          })}
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};

export default AddNewTribeSlider;
