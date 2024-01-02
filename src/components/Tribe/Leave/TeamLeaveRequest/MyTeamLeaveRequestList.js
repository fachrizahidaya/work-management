import { memo, useEffect, useState } from "react";
import { useFormik } from "formik";

import { ScrollView, StyleSheet, View, Image, Text, FlatList } from "react-native";
import { Spinner } from "native-base";
import { RefreshControl } from "react-native-gesture-handler";

import Tabs from "../../../shared/Tabs";
import MyTeamLeaveRequestItem from "./MyTeamLeaveRequestItem";

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
      <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} justify="space-evenly" />
      <View style={styles.container}>
        {tabValue === "waiting approval" ? (
          pendingLeaveRequests.length > 0 ? (
            <View style={{ flex: 1, paddingHorizontal: 5 }}>
              <FlatList
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
                    }}
                  />
                }
                ListFooterComponent={() =>
                  pendingLeaveRequestIsFetching && hasBeenScrolledPending && <Spinner color="primary.600" />
                }
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
              refreshControl={
                <RefreshControl refreshing={pendingLeaveRequestIsFetching} onRefresh={refetchPendingLeaveRequest} />
              }
            >
              <View style={styles.content}>
                {/* <Image
                  source={require("../../../../assets/vectors/empty.png")}
                  alt="empty"
                  style={{ height: 250, width: 250, resizeMode: "contain" }}
                />
                <Text>No Data</Text> */}
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            </ScrollView>
          )
        ) : tabValue === "approved" ? (
          approvedLeaveRequests.length > 0 ? (
            <FlatList
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
                  }}
                />
              }
              ListFooterComponent={() =>
                approvedLeaveRequestIsFetching && hasBeenScrolledApproved && <Spinner color="primary.600" />
              }
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
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={approvedLeaveRequestIsFetching} onRefresh={refetchTeamLeaveRequest} />
              }
            >
              <View style={styles.content}>
                {/* <Image
                  source={require("../../../../assets/vectors/empty.png")}
                  alt="empty"
                  style={{ height: 250, width: 250, resizeMode: "contain" }}
                />
                <Text>No Data</Text> */}
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            </ScrollView>
          )
        ) : rejectedLeaveRequests.length > 0 ? (
          <FlatList
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
                }}
              />
            }
            ListFooterComponent={() =>
              rejectedLeaveRequestIsFetching && hasBeenScrolled && <Spinner color="primary.600" />
            }
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
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={rejectedLeaveRequestIsFetching} onRefresh={refetchRejectedLeaveRequest} />
            }
          >
            <View style={styles.content}>
              {/* <Image
                source={require("../../../../assets/vectors/empty.png")}
                alt="empty"
                style={{ height: 250, width: 250, resizeMode: "contain" }}
              />
              <Text>No Data</Text> */}
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
