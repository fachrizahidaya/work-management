import React, { useState } from "react";
import { Dimensions } from "react-native";
import { Box, FlatList, Flex, Icon, Pressable, Text, useToast } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useFetch } from "../../../hooks/useFetch";
import dayjs from "dayjs";
import { useEffect } from "react";
import axiosInstance from "../../../config/api";
import NewLeaveRequest from "../../Tribe/Leave/NewLeaveRequest/NewLeaveRequest";
import NewReimbursement from "../../Tribe/Reimbursement/NewReimbursement.js/NewReimbursement";

const AddNewTribeSlider = ({ toggle }) => {
  const [newLeaveRequest, setNewLeaveRequest] = useState(false);
  const [newReimbursement, setNewReimbursement] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(dayjs().format("HH:mm"));
  const { height } = Dimensions.get("window");
  const toast = useToast();

  const { data: attendance, refetch } = useFetch("/hr/timesheets/personal/attendance-today");
  const { data: userIp } = useFetch("https://jsonip.com/");
  const { data: profile } = useFetch("/hr/my-profile");
  const { data: personalLeave, refetchPersonalLeave } = useFetch("/hr/leave-requests/personal");
  console.log("pers", personalLeave?.data);

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
    {
      icons: "clipboard-minus-outline",
      title: "New Reimbursement",
    },
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
        toast.show({
          description:
            attendance?.data?.time_in && attendance?.data?.time_out
              ? `You've both Clocked in and out`
              : !attendance?.data?.time_out
              ? "Clock-in Success"
              : "Clock-out Success",
        });
        toggle();
        refetch();
      } else {
        toast.show({ description: "You already checked out at this time" });
        throw new Error(`You already checked out at this time`);
      }
    } catch (err) {
      console.log(err);
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
      <Box>
        <Pressable position="absolute" bottom={79} height={height} width="100%" zIndex={2} onPress={toggle}></Pressable>
        <Box position="absolute" bottom={79} width="100%" bgColor="white" zIndex={3}>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  if (item.title === "New Leave Request") {
                    setNewLeaveRequest(!newLeaveRequest);
                  } else if (item.title === "New Reimbursement") {
                    setNewReimbursement(!newReimbursement);
                  } else if (item.title === "Clock in") {
                    attendanceCheckHandler();
                  }
                }}
              >
                <Flex
                  flexDir="row"
                  alignItems="center"
                  gap={25}
                  px={8}
                  py={4}
                  borderColor="#E8E9EB"
                  borderBottomWidth={1}
                  borderTopWidth={item.icons === "home" ? 1 : 0}
                >
                  {item.title !== "Clock in" ? (
                    <>
                      <Box
                        bg="#f7f7f7"
                        borderRadius={5}
                        style={{ height: 32, width: 32 }}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={<MaterialCommunityIcons name={item.icons} />} size={6} color="#2A7290" />
                      </Box>
                      <Text key={item.title} fontWeight={700} color="black">
                        {item.title}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Flex
                        bg="#f7f7f7"
                        borderRadius={5}
                        style={{ height: 32, width: "100%" }}
                        flexDir="row"
                        gap={25}
                        alignItems="center"
                        justifyContent="space-around"
                      >
                        <Box style={{ height: 32, width: 32 }} alignItems="center" justifyContent="center">
                          <Icon as={<MaterialCommunityIcons name={item.icons} />} size={6} color="#2A7290" />
                        </Box>

                        <Text key={item.title} fontWeight={700} color="black" mr={140}>
                          {attendance?.data?.time_in && attendance?.data?.time_out
                            ? "You've attended"
                            : attendance?.data?.time_in
                            ? "Clock out"
                            : "Clock in"}
                        </Text>
                        <Text mr={2}>{currentTime}</Text>
                      </Flex>
                    </>
                  )}
                </Flex>
              </Pressable>
            )}
          />
        </Box>
      </Box>

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
      {newReimbursement && <NewReimbursement onClose={onCloseReimbursement} />}
    </>
  );
};

export default AddNewTribeSlider;
