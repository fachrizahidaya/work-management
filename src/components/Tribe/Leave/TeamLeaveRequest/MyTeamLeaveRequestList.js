import { memo, useEffect, useState } from "react";
import { useFormik } from "formik";

import { ScrollView, StyleSheet, View, ActivityIndicator, Platform } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";

import Tabs from "../../../shared/Tabs";
import MyTeamLeaveRequestItem from "./MyTeamLeaveRequestItem";
import EmptyPlaceholder from "../../../shared/EmptyPlaceholder";

const MyTeamLeaveRequestList = ({
  refetchTeamLeaveRequest,
  onApproval,
  pendingLeaveRequests,
  approvedLeaveRequests,
  rejectedLeaveRequests,
  pendingLeaveRequestIsFetching,
  approvedLeaveRequestIsFetching,
  rejectedLeaveRequestIsFetching,
  refetchPendingLeaveRequest,
  refetchApprovedLeaveRequest,
  refetchRejectedLeaveRequest,
  hasBeenScrolled,
  setHasBeenScrolled,
  hasBeenScrolledPending,
  setHasBeenScrolledPending,
  hasBeenScrolledApproved,
  setHasBeenScrolledApproved,
  fetchMorePending,
  fetchMoreApproved,
  fetchMoreRejected,
  pendingLeaveRequestIsLoading,
  approvedLeaveRequestIsLoading,
  rejectedLeaveRequestIsLoading,
  tabValue,
  tabs,
  onChangeTab,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(null);

  /**
   * Aprroval or Rejection handler
   */
  const formik = useFormik({
    initialValues: {
      object: "",
      object_id: "",
      type: "",
      status: "",
      notes: "",
    },
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setStatus("processing");
      onApproval(values, setStatus, setSubmitting);
    },
  });

  /**
   * Response handler
   * @param {*} response
   */
  const responseHandler = (response, data) => {
    formik.setFieldValue("object", data?.approval_object);
    formik.setFieldValue("object_id", data?.approval_object_id);
    formik.setFieldValue("type", data?.approval_type);
    formik.setFieldValue("status", response);
    setIsSubmitting(response);
    formik.handleSubmit();
  };

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      refetchTeamLeaveRequest();
    }
  }, [formik.isSubmitting && formik.status]);

  return (
    <>
      <View style={{ paddingHorizontal: 14 }}>
        <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />
      </View>
      <View style={styles.container}>
        {tabValue === "Pending" ? (
          pendingLeaveRequests.length > 0 ? (
            <View
              style={{
                height: "100%",
                // marginTop: 12,
              }}
            >
              <FlashList
                data={pendingLeaveRequests}
                onEndReachedThreshold={0.1}
                onScrollBeginDrag={() => setHasBeenScrolledPending(!hasBeenScrolledPending)}
                onEndReached={hasBeenScrolledPending === true ? fetchMorePending : null}
                keyExtractor={(item, index) => index}
                estimatedItemSize={200}
                refreshing={true}
                refreshControl={
                  <RefreshControl
                    refreshing={pendingLeaveRequestIsFetching}
                    onRefresh={() => {
                      refetchPendingLeaveRequest();
                      refetchTeamLeaveRequest();
                    }}
                  />
                }
                ListFooterComponent={() => pendingLeaveRequestIsLoading && <ActivityIndicator />}
                renderItem={({ item, index }) => (
                  <MyTeamLeaveRequestItem
                    item={item}
                    key={index}
                    id={item?.id}
                    leave_name={item?.leave_name}
                    reason={item?.reason}
                    days={item?.days}
                    begin_date={item?.begin_date}
                    end_date={item?.end_date}
                    status={item?.status}
                    employee_name={item?.employee_name}
                    employee_image={item?.employee_image}
                    responseHandler={responseHandler}
                    isSubmitting={isSubmitting}
                    formik={formik}
                  />
                )}
              />
            </View>
          ) : (
            <ScrollView
              style={{ height: "100%" }}
              refreshControl={
                <RefreshControl
                  refreshing={pendingLeaveRequestIsFetching}
                  onRefresh={() => {
                    refetchPendingLeaveRequest();
                    refetchTeamLeaveRequest();
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
          approvedLeaveRequests.length > 0 ? (
            <View
              style={{
                height: "100%",
                // marginTop: 12,
              }}
            >
              <FlashList
                data={approvedLeaveRequests}
                onEndReachedThreshold={0.1}
                onEndReached={hasBeenScrolledApproved === true ? fetchMoreApproved : null}
                onScrollBeginDrag={() => setHasBeenScrolledApproved(!hasBeenScrolledApproved)}
                keyExtractor={(item, index) => index}
                estimatedItemSize={200}
                refreshing={true}
                refreshControl={
                  <RefreshControl
                    refreshing={approvedLeaveRequestIsFetching}
                    onRefresh={() => {
                      refetchApprovedLeaveRequest();
                      refetchTeamLeaveRequest();
                    }}
                  />
                }
                ListFooterComponent={() => approvedLeaveRequestIsLoading && <ActivityIndicator />}
                renderItem={({ item, index }) => (
                  <MyTeamLeaveRequestItem
                    item={item}
                    key={index}
                    id={item?.id}
                    leave_name={item?.leave_name}
                    reason={item?.reason}
                    days={item?.days}
                    begin_date={item?.begin_date}
                    end_date={item?.end_date}
                    status={item?.status}
                    employee_name={item?.employee_name}
                    employee_image={item?.employee_image}
                  />
                )}
              />
            </View>
          ) : (
            <ScrollView
              style={{ height: "100%" }}
              refreshControl={
                <RefreshControl
                  refreshing={approvedLeaveRequestIsFetching}
                  onRefresh={() => {
                    refetchTeamLeaveRequest();
                    refetchTeamLeaveRequest();
                  }}
                />
              }
            >
              <View style={styles.content}>
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            </ScrollView>
          )
        ) : rejectedLeaveRequests.length > 0 ? (
          <View
            style={{
              height: "100%",
              // marginTop: 12
            }}
          >
            <FlashList
              data={rejectedLeaveRequests}
              onEndReachedThreshold={0.1}
              onEndReached={hasBeenScrolled === true ? fetchMoreRejected : null}
              onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
              keyExtractor={(item, index) => index}
              estimatedItemSize={200}
              refreshing={true}
              refreshControl={
                <RefreshControl
                  refreshing={rejectedLeaveRequestIsFetching}
                  onRefresh={() => {
                    refetchRejectedLeaveRequest();
                    refetchTeamLeaveRequest();
                  }}
                />
              }
              ListFooterComponent={() => rejectedLeaveRequestIsLoading && <ActivityIndicator />}
              renderItem={({ item, index }) => (
                <MyTeamLeaveRequestItem
                  item={item}
                  key={index}
                  id={item?.id}
                  leave_name={item?.leave_name}
                  reason={item?.reason}
                  days={item?.days}
                  begin_date={item?.begin_date}
                  end_date={item?.end_date}
                  status={item?.status}
                  employee_name={item?.employee_name}
                  employee_image={item?.employee_image}
                />
              )}
            />
          </View>
        ) : (
          <ScrollView
            style={{ height: "100%" }}
            refreshControl={
              <RefreshControl
                refreshing={rejectedLeaveRequestIsFetching}
                onRefresh={() => {
                  refetchRejectedLeaveRequest();
                  refetchTeamLeaveRequest();
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

export default memo(MyTeamLeaveRequestList);

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
