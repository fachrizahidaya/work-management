import { memo, useState, useMemo, useCallback, useEffect } from "react";

import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { Box, Flex, Image, Text, VStack } from "native-base";

import Tabs from "../../shared/Tabs";
import { FlashList } from "@shopify/flash-list";
import LeaveRequestItem from "./LeaveRequestItem";

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
    return [
      { title: "pending", number: pendingCount },
      { title: "approved", number: approvedCount },
      { title: "rejected", number: rejectedCount },
    ];
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
      <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} justifyContent="space-evenly" flexDir="row" gap={2} />
      <Flex backgroundColor="#f8f8f8" px={3} flex={1} flexDir="column">
        {tabValue === "pending" ? (
          pendingLeaveRequests.length > 0 ? (
            <Box flex={1}>
              <FlashList
                data={pendingLeaveRequests}
                onEndReachedThreshold={0.1}
                keyExtractor={(item, index) => index}
                estimatedItemSize={200}
                refreshing={true}
                refreshControl={
                  <RefreshControl
                    refreshing={personalLeaveRequestIsFetching}
                    onRefresh={() => {
                      refetchPersonalLeaveRequest;
                    }}
                  />
                }
                renderItem={({ item, index }) => (
                  <LeaveRequestItem
                    item={item}
                    key={index}
                    id={item?.id}
                    leave_name={item?.leave_name}
                    reason={item?.reason}
                    days={item?.days}
                    begin_date={item?.begin_date}
                    end_date={item?.end_date}
                    status={item?.status}
                    onSelect={onSelect}
                  />
                )}
              />
            </Box>
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={personalLeaveRequestIsFetching} onRefresh={refetchPersonalLeaveRequest} />
              }
            >
              <VStack mt={20} space={2} alignItems="center" justifyContent="center">
                <Image
                  source={require("../../../assets/vectors/empty.png")}
                  alt="empty"
                  resizeMode="contain"
                  size="2xl"
                />
                <Text>No Data</Text>
              </VStack>
            </ScrollView>
          )
        ) : tabValue === "approved" ? (
          approvedLeaveRequests.length > 0 ? (
            <Box flex={1}>
              <FlashList
                data={approvedLeaveRequests}
                onEndReachedThreshold={0.1}
                keyExtractor={(item, index) => index}
                estimatedItemSize={200}
                refreshing={true}
                refreshControl={
                  <RefreshControl
                    refreshing={personalLeaveRequestIsFetching}
                    onRefresh={() => {
                      refetchPersonalLeaveRequest;
                    }}
                  />
                }
                renderItem={({ item, index }) => (
                  <LeaveRequestItem
                    item={item}
                    key={index}
                    id={item?.id}
                    leave_name={item?.leave_name}
                    reason={item?.reason}
                    days={item?.days}
                    begin_date={item?.begin_date}
                    end_date={item?.end_date}
                    status={item?.status}
                    onSelect={onSelect}
                  />
                )}
              />
            </Box>
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={personalLeaveRequestIsFetching} onRefresh={refetchPersonalLeaveRequest} />
              }
            >
              <VStack mt={20} space={2} alignItems="center" justifyContent="center">
                <Image
                  source={require("../../../assets/vectors/empty.png")}
                  alt="empty"
                  resizeMode="contain"
                  size="2xl"
                />
                <Text>No Data</Text>
              </VStack>
            </ScrollView>
          )
        ) : rejectedLeaveRequests.length > 0 ? (
          <Box flex={1}>
            <FlashList
              data={rejectedLeaveRequests}
              onEndReachedThreshold={0.1}
              keyExtractor={(item, index) => index}
              estimatedItemSize={200}
              refreshing={true}
              refreshControl={
                <RefreshControl
                  refreshing={personalLeaveRequestIsFetching}
                  onRefresh={() => {
                    refetchPersonalLeaveRequest;
                  }}
                />
              }
              renderItem={({ item, index }) => (
                <LeaveRequestItem
                  item={item}
                  key={index}
                  id={item?.id}
                  leave_name={item?.leave_name}
                  reason={item?.reason}
                  days={item?.days}
                  begin_date={item?.begin_date}
                  end_date={item?.end_date}
                  status={item?.status}
                  onSelect={onSelect}
                />
              )}
            />
          </Box>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={personalLeaveRequestIsFetching} onRefresh={refetchPersonalLeaveRequest} />
            }
          >
            <VStack mt={20} space={2} alignItems="center" justifyContent="center">
              <Image
                source={require("../../../assets/vectors/empty.png")}
                alt="empty"
                resizeMode="contain"
                size="2xl"
              />
              <Text>No Data</Text>
            </VStack>
          </ScrollView>
        )}
      </Flex>
    </>
  );
};

export default memo(LeaveRequestList);
