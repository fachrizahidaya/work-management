import { memo } from "react";

import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";

import Tabs from "../../../shared/Tabs";
import LeaveRequestItem from "./LeaveRequestItem";
import EmptyPlaceholder from "../../../shared/EmptyPlaceholder";

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

      <View style={styles.container}>
        {tabValue === "pending" ? (
          pendingList?.length > 0 ? (
            <View style={{ flex: 1, paddingHorizontal: 5 }}>
              <FlatList
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
                ListFooterComponent={() => pendingLeaveRequestIsFetching && <ActivityIndicator />}
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
              refreshControl={
                <RefreshControl refreshing={pendingLeaveRequestIsFetching} onRefresh={refetchPendingLeaveRequest} />
              }
            >
              <View style={styles.content}>
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            </ScrollView>
          )
        ) : tabValue === "approved" ? (
          approvedList?.length > 0 ? (
            <View style={{ flex: 1, paddingHorizontal: 5 }}>
              <FlatList
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
                ListFooterComponent={() => approvedLeaveRequestIsFetching && <ActivityIndicator />}
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
              refreshControl={
                <RefreshControl refreshing={approvedLeaveRequestIsFetching} onRefresh={refetchApprovedLeaveRequest} />
              }
            >
              <View style={styles.content}>
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            </ScrollView>
          )
        ) : rejectedList?.length > 0 ? (
          <View style={{ flex: 1, paddingHorizontal: 5 }}>
            <FlatList
              removeClippedSubviews={true}
              data={rejectedList}
              onEndReachedThreshold={0.1}
              onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
              onEndReached={hasBeenScrolled === true ? fetchMoreRejected : null}
              keyExtractor={(item, index) => index}
              estimatedItemSize={70}
              refreshing={true}
              ListFooterComponent={() => rejectedLeaveRequestIsFetching && <ActivityIndicator />}
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
          </View>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={rejectedLeaveRequestIsFetching} onRefresh={refetchRejectedLeaveRequest} />
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
    backgroundColor: "#F8F8F8",
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 5,
  },
  content: {
    marginTop: 20,
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
