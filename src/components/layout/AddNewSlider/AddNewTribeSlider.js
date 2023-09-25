import dayjs from "dayjs";
import { Box, FlatList, Flex, Icon, Slide, Pressable, Text, useToast } from "native-base";
import { useEffect } from "react";
import { useState } from "react";
import { Dimensions } from "react-native";
import { useFetch } from "../../../hooks/useFetch";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axiosInstance from "../../../config/api";
import NewLeaveRequest from "../../Tribe/Leave/NewLeaveRequest/NewLeaveRequest";
import NewProjectSlider from "../../Band/Project/NewProjectSlider/NewProjectSlider";

const AddNewTribeSlider = ({ toggle }) => {
  const { height } = Dimensions.get("window");
  const [newLeaveIsOpen, setNewLeaveIsOpen] = useState(false);
  const [newReimbursementIsOpen, setNewReimbursementIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userIp, setUserIp] = useState(null);
  const [currentTime, setCurrentTime] = useState(dayjs().format("HH:mm"));
  const [attendanceToday, setAttendanceToday] = useState(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const toast = useToast();

  const { data: attendance, refetch } = useFetch("/hr/timesheets/personal/attendance-today");
  const { data: ipUser } = useFetch("https://jsonip.com/");
  // console.log("ip", ipUser?.ip);
  // console.log(attendance?.data);
  const onCloseLeaveRequestForm = () => {
    setNewLeaveIsOpen(false);
  };

  const onCloseReimbursementForm = () => {
    setNewReimbursementIsOpen(false);
  };

  const items = [
    {
      icons: "clipboard-clock-outline",
      title: "Leave Request",
    },
    {
      icons: "clipboard-minus-outline",
      title: "New Reimbursement",
    },
    {
      icons: "clock-outline",
      title: "Clock in",
    },
    // {
    //   icons: "clock-outline",
    //   title: "Clock out",
    // },
  ];

  const clockButtonTitle = isClockedIn ? "Clock out" : "Clock in";

  const fetchUserIp = () => {
    if (!isLoading) {
      fetch("https://jsonip.com/")
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setUserIp(ipUser?.ip);
          setIsLoading(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const attendanceCheckHandler = async () => {
    try {
      if (dayjs().format("HH:mm") !== attendance?.data?.time_out || !attendance?.data) {
        const res = await axiosInstance.post(`/hr/timesheets/personal/attendance-check`, {
          ip: userIp,
        });
        console.log(res);
        toast.show({ description: "Success" });
        refetch();
      } else {
        throw new Error(`You already checked out at this time`);
      }
    } catch (err) {
      console.log(err);
      throw new Error(`You're not connected to the proper connection`);
    }
  };

  useEffect(() => {
    if (userIp && isLoading) {
      attendanceCheckHandler().then(() => {
        setIsLoading(false);
      });
    }
  }, [userIp, isLoading]);

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
        <Box position="absolute" bottom={79} width="100%" bgColor="white">
          <FlatList
            data={items.slice(0, 2)}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  if (item.title === "Leave Request") {
                    setNewLeaveIsOpen(!newLeaveIsOpen);
                    console.log(newLeaveIsOpen);
                  } else if (item.title === "New Reimbursement") {
                    setNewReimbursementIsOpen(!newReimbursementIsOpen);
                  }
                  // else if (item.title === "Clock in") {
                  //   attendanceCheckHandler();
                  // }
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
                  {/* {item.title !== "Clock in" ? ( */}
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
                  {/* ) : ( */}
                  {/* <>
                    <Flex
                      bg="#f7f7f7"
                      borderRadius={5}
                      style={{ height: 32, width: "100%" }}
                      flexDir="row"
                      gap={25}
                      alignItems="center"
                    >
                      <Box style={{ height: 32, width: 32 }} alignItems="center" justifyContent="center">
                        <Icon as={<MaterialCommunityIcons name={item.icons} />} size={6} color="#2A7290" />
                      </Box>

                      <Text key={item.title} fontWeight={700} color="black">
                        {attendance?.data?.time_in && attendance?.data?.time_out
                          ? "You've attended"
                          : attendance?.data?.time_in
                          ? "Clock out"
                          : "Clock in"}
                      </Text>
                      <Flex>{attendance?.data?.time_in && attendance?.data?.time_out ? "" : currentTime}</Flex>
                    </Flex>
                  </> */}
                  {/* )} */}
                </Flex>
              </Pressable>
            )}
          />
        </Box>
      </Box>

      {newLeaveIsOpen && <NewLeaveRequest onClose={onCloseLeaveRequestForm} />}
    </>
  );
};

export default AddNewTribeSlider;
