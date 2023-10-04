import React, { useState, useEffect } from "react";

import { Dimensions } from "react-native";
import { Actionsheet, Box, FlatList, Flex, Icon, Pressable, Text, useToast } from "native-base";

import dayjs from "dayjs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import NewLeaveRequest from "../../Tribe/Leave/NewLeaveRequest/NewLeaveRequest";
import NewReimbursement from "../../Tribe/Reimbursement/NewReimbursement.js/NewReimbursement";
import { SuccessToast, ErrorToast } from "../../shared/ToastDialog";
import { useFetch } from "../../../hooks/useFetch";
import axiosInstance from "../../../config/api";

const AddNewTribeSlider = ({ isOpen, toggle }) => {
  const [newLeaveRequest, setNewLeaveRequest] = useState(false);
  const [newReimbursement, setNewReimbursement] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(dayjs().format("HH:mm"));
  const { height } = Dimensions.get("window");
  const toast = useToast();

  const { data: attendance, refetch } = useFetch("/hr/timesheets/personal/attendance-today");
  const { data: userIp } = useFetch("https://jsonip.com/");
  const { data: profile } = useFetch("/hr/my-profile");
  const { data: personalLeave, refetch: refetchPersonalLeave } = useFetch("/hr/leave-requests/personal");

  const onCloseLeaveRequest = () => {
    setNewLeaveRequest(false);
  };

  const onCloseReimbursement = () => {
    setNewReimbursement(false);
  };

  const items = [
    {
      icons: "clipboard-clock-outline",
      title: "New Leave Request",
    },
    // {
    //   icons: "clipboard-minus-outline",
    //   title: "New Reimbursement",
    // },
    {
      icons: "clock-outline",
      title: "Clock in",
    },
  ];

  const attendanceCheckHandler = async () => {
    try {
      if (dayjs().format("HH:mm") !== attendance?.data?.time_out || !attendance?.data) {
        const res = await axiosInstance.post(`/hr/timesheets/personal/attendance-check`, {
          ip: userIp?.ip,
        });
        toggle();
        toast.show({
          description: !attendance?.data?.time_in ? "Clock-in Success" : "Clock-out Success",
        });
        refetch();
      } else {
        toast.show({ description: "You already checked out at this time" });
      }
    } catch (err) {
      toast.show({
        description: `You're not connected to the proper connection`,
      });
      console.log(err.response.data.message);
    }
  };

  useEffect(() => {
    if (userIp?.ip && isLoading) {
      attendanceCheckHandler().then(() => {
        setIsLoading(false);
      });
    }
  }, [userIp?.ip, isLoading]);

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
                    setNewLeaveRequest(!newLeaveRequest);
                  }
                  // else if (item.title === "New Reimbursement") {
                  //   setNewReimbursement(!newReimbursement);
                  // }
                  else if (item.title === "Clock in") {
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
                    <Flex
                      flexDir="row"
                      bg="#F7F7F7"
                      borderRadius={5}
                      style={{ height: 32, width: 352 }}
                      alignItems="center"
                    >
                      <Box px={1}>
                        <Icon as={<MaterialCommunityIcons name={item.icons} />} size={6} color="#2A7290" />
                      </Box>

                      <Text key={item.title} fontWeight={700} color="#000000" mx={6}>
                        {attendance?.data?.time_in && attendance?.data?.time_out
                          ? "You've attended"
                          : !attendance?.data?.time_in
                          ? "Clock in"
                          : "Clock out"}
                      </Text>
                      {item.title === "Clock in" || item.title === "Clock Out" ? (
                        <Text ml={170} color="#377893">
                          {currentTime}
                        </Text>
                      ) : (
                        <Text ml={130} color="#377893">
                          {currentTime}
                        </Text>
                      )}
                    </Flex>
                  )}
                </Flex>
              </Actionsheet.Item>
            );
          })}
        </Actionsheet.Content>
      </Actionsheet>

      {newLeaveRequest && (
        <NewLeaveRequest
          onClose={onCloseLeaveRequest}
          availableLeavePersonal={profile?.data?.leave_quota}
          pendingApproval={profile?.data?.pending_leave_request}
          approved={profile?.data?.approved_leave_request}
          refetchPersonalLeave={refetchPersonalLeave}
          approver={profile?.data?.supervisor_name}
          approverImage={profile?.data?.supervisor_image}
          employeeId={profile?.data?.id}
        />
      )}
      {/* {newReimbursement && <NewReimbursement onClose={onCloseReimbursement} />} */}
    </>
  );
};

export default AddNewTribeSlider;
