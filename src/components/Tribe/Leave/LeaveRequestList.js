import { memo } from "react";

import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { Box, Flex, Image, Spinner, Text, VStack } from "native-base";
import { StyleSheet } from "react-native";

import Tabs from "../../shared/Tabs";
import { FlashList } from "@shopify/flash-list";
import LeaveRequestItem from "./LeaveRequestItem";

const LeaveRequestList = ({
  onSelect,
  pendingList,
  approvedList,
  rejectedList,
  pendingLeaveRequestIsFetching,
  approvedLeaveRequestIsFetching,
  rejectedLeaveRequestIsFetching,
  refetchPendingLeaveRequest,
  refetchApprovedLeaveRequest,
  refetchRejectedLeaveRequest,
  hasBeenScrolled,
  setHasBeenScrolled,
  fetchMorePending,
  fetchMoreApproved,
  fetchMoreRejected,
  rejectedLeaveRequestIsLoading,
  tabValue,
  tabs,
  onChangeTab,
  hasBeenScrolledPending,
  setHasBeenScrolledPending,
  hasBeenScrolledApproved,
  setHasBeenScrolledApproved,
}) => {
  return (
    <>
      <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} justify="space-evenly" flexDir="row" gap={2} />

      <Flex px={3} style={styles.container}>
        {tabValue === "pending" ? (
          pendingList.length > 0 ? (
            <Box flex={1}>
              <FlashList
                data={pendingList}
                onEndReachedThreshold={0.1}
                onScrollBeginDrag={() => setHasBeenScrolledPending(!hasBeenScrolledPending)}
                onEndReached={hasBeenScrolledPending === true ? fetchMorePending : null}
                keyExtractor={(item, index) => index}
                estimatedItemSize={70}
                refreshing={true}
                refreshControl={
                  <RefreshControl
                    refreshing={pendingLeaveRequestIsFetching}
                    onRefresh={() => {
                      refetchPendingLeaveRequest();
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
                <RefreshControl refreshing={pendingLeaveRequestIsFetching} onRefresh={refetchPendingLeaveRequest} />
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
          approvedList.length > 0 ? (
            <Box flex={1}>
              <FlashList
                data={approvedList}
                onEndReachedThreshold={0.1}
                onScrollBeginDrag={() => setHasBeenScrolledApproved(!hasBeenScrolledApproved)}
                onEndReached={hasBeenScrolledApproved === true ? fetchMoreApproved : null}
                keyExtractor={(item, index) => index}
                estimatedItemSize={70}
                refreshing={true}
                refreshControl={
                  <RefreshControl
                    refreshing={approvedLeaveRequestIsFetching}
                    onRefresh={() => {
                      refetchApprovedLeaveRequest();
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
                <RefreshControl refreshing={approvedLeaveRequestIsFetching} onRefresh={refetchApprovedLeaveRequest} />
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
        ) : rejectedList.length > 0 ? (
          <Box flex={1}>
            <FlashList
              removeClippedSubviews={true}
              data={rejectedList}
              onEndReachedThreshold={0.1}
              onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
              onEndReached={hasBeenScrolled === true ? fetchMoreRejected : null}
              keyExtractor={(item, index) => index}
              estimatedItemSize={70}
              refreshing={true}
              ListFooterComponent={() =>
                rejectedLeaveRequestIsLoading && hasBeenScrolled && <Spinner color="primary.600" />
              }
              refreshControl={
                <RefreshControl
                  refreshing={rejectedLeaveRequestIsFetching}
                  onRefresh={() => {
                    refetchRejectedLeaveRequest();
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
              <RefreshControl refreshing={rejectedLeaveRequestIsFetching} onRefresh={refetchRejectedLeaveRequest} />
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F8F8",
    flex: 1,
    flexDirection: "column",
  },
});
