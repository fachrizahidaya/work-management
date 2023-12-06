import { memo, useState, useMemo, useCallback, useEffect } from "react";
import dayjs from "dayjs";

import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { Badge, Flex, Icon, Image, Pressable, Text, VStack } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Tabs from "../../shared/Tabs";
import { card } from "../../../styles/Card";

const LeaveRequestList = ({
  pendingLeaveRequests,
  approvedLeaveRequests,
  rejectedLeaveRequests,
  pendingCount,
  approvedCount,
  rejectedCount,
  onSelect,
  personalLeaveRequest,
  refetchPersonalLeaveRequest,
  personalLeaveRequestIsFetching,
}) => {
  const [tabValue, setTabValue] = useState("pending");

  const tabs = useMemo(() => {
    return [{ title: "pending" }, { title: "approved" }, { title: "rejected" }];
  }, []);

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
  }, []);

  useEffect(() => {
    return () => {
      setTabValue("pending");
    };
  }, [personalLeaveRequest]);

  return (
    <>
      <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} justifyContent="space-evenly" />
      <Flex backgroundColor="#f1f1f1" px={3} flex={1} flexDir="column">
        <ScrollView
          refreshControl={
            <RefreshControl onRefresh={refetchPersonalLeaveRequest} refreshing={personalLeaveRequestIsFetching} />
          }
        >
          {tabValue === "pending" ? (
            pendingLeaveRequests.length > 0 ? (
              pendingLeaveRequests.map((item, index) => {
                {
                  /* Pending Leave */
                }
                return (
                  <Flex key={index} my={2} flexDir="column" style={card.card}>
                    <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                      <Text fontWeight={500} fontSize={14} color="#3F434A">
                        {item?.leave_name}
                      </Text>
                      <Pressable
                        onPress={() => {
                          onSelect(item);
                        }}
                      >
                        <Icon
                          as={<MaterialCommunityIcons name="dots-vertical" />}
                          size="md"
                          borderRadius="full"
                          color="#000000"
                        />
                      </Pressable>
                    </Flex>
                    <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                      <Flex flex={1}>
                        <Text color="#595F69" fontSize={12} fontWeight={400}>
                          {item?.reason}
                        </Text>
                      </Flex>
                      <Badge borderRadius={10} w={20}>
                        <Flex gap={2} flexDir="row">
                          <Icon as={<MaterialCommunityIcons name="clock-outline" />} size={5} color="#186688" />
                          {item?.days > 1 ? `${item?.days} days` : `${item?.days} day`}
                        </Flex>
                      </Badge>
                    </Flex>
                    <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                      <Text color="#595F69" fontSize={12} fontWeight={400}>
                        {dayjs(item?.begin_date).format("DD.MM.YYYY")} - {dayjs(item?.end_date).format("DD.MM.YYYY")}
                      </Text>
                      <Text color={"#FF6262"}>{item?.status}</Text>
                    </Flex>
                  </Flex>
                );
              })
            ) : (
              <VStack space={2} alignItems="center" justifyContent="center">
                <Image
                  source={require("../../../assets/vectors/empty.png")}
                  alt="empty"
                  resizeMode="contain"
                  size="2xl"
                />
                <Text>No Data</Text>
              </VStack>
            )
          ) : tabValue === "approved" ? (
            approvedLeaveRequests.length > 0 ? (
              approvedLeaveRequests.map((item, index) => {
                {
                  /* Approved Leave */
                }
                return (
                  <Flex key={index} my={1} flexDir="column" style={card.card}>
                    <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                      <Text fontWeight={500} fontSize={14} color="#3F434A">
                        {item?.leave_name}
                      </Text>
                    </Flex>
                    <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                      <Flex flex={1}>
                        <Text color="#595F69" fontSize={12} fontWeight={400}>
                          {item?.reason}
                        </Text>
                      </Flex>
                      <Badge borderRadius={10} w={20}>
                        <Flex gap={2} flexDir="row">
                          <Icon as={<MaterialCommunityIcons name="clock-outline" />} size={5} color="#186688" />
                          {item?.days > 1 ? `${item?.days} days` : `${item?.days} day`}
                        </Flex>
                      </Badge>
                    </Flex>
                    <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                      <Text color="#595F69" fontSize={12} fontWeight={400}>
                        {dayjs(item?.begin_date).format("DD.MM.YYYY")} - {dayjs(item?.end_date).format("DD.MM.YYYY")}
                      </Text>
                      <Text color={"#FF6262"}>{item?.status}</Text>
                    </Flex>
                  </Flex>
                );
              })
            ) : (
              <VStack space={2} alignItems="center" justifyContent="center">
                <Image
                  source={require("../../../assets/vectors/empty.png")}
                  alt="empty"
                  resizeMode="contain"
                  size="2xl"
                />
                <Text>No Data</Text>
              </VStack>
            )
          ) : rejectedLeaveRequests.length > 0 ? (
            rejectedLeaveRequests.map((item, index) => {
              {
                /* Rejected Leave */
              }
              return (
                <Flex key={index} my={2} flexDir="column" style={card.card}>
                  <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                    <Text fontWeight={500} fontSize={14} color="#3F434A">
                      {item?.leave_name}
                    </Text>
                  </Flex>
                  <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                    <Flex flex={1}>
                      <Text color="#595F69" fontSize={12} fontWeight={400}>
                        {item?.reason}
                      </Text>
                    </Flex>
                    <Badge borderRadius={10} w={20}>
                      <Flex gap={2} flexDir="row">
                        <Icon as={<MaterialCommunityIcons name="clock-outline" />} size={5} color="#186688" />
                        {item?.days > 1 ? `${item?.days} days` : `${item?.days} day`}
                      </Flex>
                    </Badge>
                  </Flex>
                  <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                    <Text color="#595F69" fontSize={12} fontWeight={400}>
                      {dayjs(item?.begin_date).format("DD.MM.YYYY")} - {dayjs(item?.end_date).format("DD.MM.YYYY")}
                    </Text>
                    <Text color={"#FF6262"}>{item?.status}</Text>
                  </Flex>
                </Flex>
              );
            })
          ) : (
            <VStack space={2} alignItems="center" justifyContent="center">
              <Image
                source={require("../../../assets/vectors/empty.png")}
                alt="empty"
                resizeMode="contain"
                size="2xl"
              />
              <Text>No Data</Text>
            </VStack>
          )}
        </ScrollView>
      </Flex>
    </>
  );
};

export default memo(LeaveRequestList);
