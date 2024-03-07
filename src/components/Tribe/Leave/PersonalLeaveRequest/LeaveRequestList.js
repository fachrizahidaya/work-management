import { memo } from "react";

import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { StyleSheet, View, ActivityIndicator, Platform } from "react-native";
import { FlashList } from "@shopify/flash-list";

import Tabs from "../../../shared/Tabs";
import LeaveRequestItem from "./LeaveRequestItem";
import EmptyPlaceholder from "../../../shared/EmptyPlaceholder";

const LeaveRequestList = ({
  onSelect,
  pendingList,
  approvedList,
  rejectedList,
  canceledList,
  pendingLeaveRequestIsFetching,
  approvedLeaveRequestIsFetching,
  rejectedLeaveRequestIsFetching,
  canceledLeaveRequestIsFetching,
  pendingLeaveRequestIsLoading,
  approvedLeaveRequestIsLoading,
  rejectedLeaveRequestIsLoading,
  canceledLeaveRequestIsLoading,
  refetchPendingLeaveRequest,
  refetchApprovedLeaveRequest,
  refetchRejectedLeaveRequest,
  refetchCanceledLeaveRequest,
  hasBeenScrolled,
  setHasBeenScrolled,
  fetchMorePending,
  fetchMoreApproved,
  fetchMoreRejected,
  fetchMoreCanceled,
  tabValue,
  tabs,
  onChangeTab,
  hasBeenScrolledPending,
  setHasBeenScrolledPending,
  hasBeenScrolledApproved,
  setHasBeenScrolledApproved,
  hasBeenScrolledCanceled,
  setHasBeenScrolledCanceled,
  refetchPersonalLeaveRequest,
  teamLeaveRequestData,
  checkAccess,
}) => {
  return (
    <>
      <View style={{ paddingHorizontal: 14 }}>
        <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />
      </View>
      <View style={styles.container}>
        {tabValue === "Pending" ? (
          pendingList?.length > 0 ? (
            <View
              style={{
                height:
                  Platform.OS === "ios" && teamLeaveRequestData > 0
                    ? 200
                    : Platform.OS === "ios" && teamLeaveRequestData === 0
                    ? "100%"
                    : Platform.OS === "android" && teamLeaveRequestData === 0
                    ? "100%"
                    : 575,
                // marginTop: 12,
              }}
            >
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
                      refetchPersonalLeaveRequest();
                    }}
                  />
                }
                ListFooterComponent={() => pendingLeaveRequestIsLoading && <ActivityIndicator />}
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
                    approval_by={item?.approval_by}
                    onSelect={onSelect}
                  />
                )}
              />
            </View>
          ) : (
            <ScrollView
              style={{ height: Platform.OS === "ios" ? 570 : 600 }}
              refreshControl={
                <RefreshControl
                  refreshing={pendingLeaveRequestIsFetching}
                  onRefresh={() => {
                    refetchPendingLeaveRequest;
                    refetchPersonalLeaveRequest();
                  }}
                />
              }
            >
              <View style={styles.content}>
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            </ScrollView>
          )
        ) : tabValue === "Approved" ? (
          approvedList?.length > 0 ? (
            <View
              style={{
                height:
                  Platform.OS === "ios" && teamLeaveRequestData > 0
                    ? 540
                    : Platform.OS === "ios" && teamLeaveRequestData === 0
                    ? "100%"
                    : Platform.OS === "android" && teamLeaveRequestData === 0
                    ? "100%"
                    : 575,
                // marginTop: 12,
              }}
            >
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
                      refetchPersonalLeaveRequest();
                    }}
                  />
                }
                ListFooterComponent={() => approvedLeaveRequestIsLoading && <ActivityIndicator />}
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
                    approval_by={item?.supervisor_name}
                  />
                )}
              />
            </View>
          ) : (
            <ScrollView
              style={{ height: Platform.OS === "ios" ? 570 : 600 }}
              refreshControl={
                <RefreshControl
                  refreshing={approvedLeaveRequestIsFetching}
                  onRefresh={() => {
                    refetchApprovedLeaveRequest();
                    refetchPersonalLeaveRequest();
                  }}
                />
              }
            >
              <View style={styles.content}>
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            </ScrollView>
          )
        ) : tabValue === "Canceled" ? (
          canceledList?.length > 0 ? (
            <View
              style={{
                height:
                  Platform.OS === "ios" && teamLeaveRequestData > 0
                    ? 540
                    : Platform.OS === "ios" && teamLeaveRequestData === 0
                    ? "100%"
                    : Platform.OS === "android" && teamLeaveRequestData === 0
                    ? "100%"
                    : 575,
                // marginTop: 12,
              }}
            >
              <FlashList
                data={canceledList}
                onEndReachedThreshold={0.1}
                onScrollBeginDrag={() => setHasBeenScrolledCanceled(!hasBeenScrolledCanceled)}
                onEndReached={hasBeenScrolledCanceled === true ? fetchMoreCanceled : null}
                keyExtractor={(item, index) => index}
                estimatedItemSize={70}
                refreshing={true}
                refreshControl={
                  <RefreshControl
                    refreshing={canceledLeaveRequestIsFetching}
                    onRefresh={() => {
                      refetchCanceledLeaveRequest();
                      refetchPersonalLeaveRequest();
                    }}
                  />
                }
                ListFooterComponent={() => canceledLeaveRequestIsLoading && <ActivityIndicator />}
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
            </View>
          ) : (
            <ScrollView
              style={{ height: Platform.OS === "ios" ? 570 : 600 }}
              refreshControl={
                <RefreshControl
                  refreshing={canceledLeaveRequestIsFetching}
                  onRefresh={() => {
                    refetchCanceledLeaveRequest();
                    refetchPersonalLeaveRequest();
                  }}
                />
              }
            >
              <View style={styles.content}>
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            </ScrollView>
          )
        ) : rejectedList?.length > 0 ? (
          <View
            style={{
              height:
                Platform.OS === "ios" && teamLeaveRequestData > 0
                  ? 540
                  : Platform.OS === "ios" && teamLeaveRequestData === 0
                  ? "100%"
                  : Platform.OS === "android" && teamLeaveRequestData === 0
                  ? "100%"
                  : 575,
              // marginTop: 12,
            }}
          >
            <FlashList
              removeClippedSubviews={true}
              data={rejectedList}
              onEndReachedThreshold={0.1}
              onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
              onEndReached={hasBeenScrolled === true ? fetchMoreRejected : null}
              keyExtractor={(item, index) => index}
              estimatedItemSize={70}
              refreshing={true}
              ListFooterComponent={() => rejectedLeaveRequestIsLoading && <ActivityIndicator />}
              refreshControl={
                <RefreshControl
                  refreshing={rejectedLeaveRequestIsFetching}
                  onRefresh={() => {
                    refetchRejectedLeaveRequest();
                    refetchPersonalLeaveRequest();
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
                  approval_by={item?.supervisor_name}
                />
              )}
            />
          </View>
        ) : (
          <ScrollView
            style={{ height: Platform.OS === "ios" ? 570 : 600 }}
            refreshControl={
              <RefreshControl
                refreshing={rejectedLeaveRequestIsFetching}
                onRefresh={() => {
                  refetchRejectedLeaveRequest;
                  refetchPersonalLeaveRequest();
                }}
              />
            }
          >
            <View style={styles.content}>
              <EmptyPlaceholder height={250} width={250} text="No Data" />
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
};

export default memo(LeaveRequestList);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8",
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 14,
  },
  content: {
    marginTop: 20,
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
