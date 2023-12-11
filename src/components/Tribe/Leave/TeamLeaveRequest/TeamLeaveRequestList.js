import { memo, useEffect, useState, useMemo, useCallback } from "react";
import { useFormik } from "formik";
import dayjs from "dayjs";

import { ScrollView } from "react-native";
import { Badge, Flex, Icon, Image, Text, VStack } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "./../../../shared/AvatarPlaceholder";
import FormButton from "../../../shared/FormButton";
import Tabs from "../../../shared/Tabs";
import { card } from "../../../../styles/Card";
import TeamLeaveRequestItem from "./TeamLeaveRequestItem";

const TeamLeaveRequestList = ({
  refetchTeamLeaveRequest,
  onApproval,
  pendingLeaveRequests,
  approvedLeaveRequests,
  rejectedLeaveRequests,
  pendingCount,
  approvedCount,
  rejectedCount,
  teamLeaveRequestData,
  teamLeaveRequestIsFetching,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(null);
  const [tabValue, setTabValue] = useState("waiting approval");

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
      console.log(values);
      setStatus("processing");
      onApproval(values, setStatus, setSubmitting);
    },
  });

  const tabs = useMemo(() => {
    return [{ title: "waiting approval" }, { title: "approved" }, { title: "rejected" }];
  }, []);

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

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
  }, []);

  useEffect(() => {
    return () => {
      setTabValue("waiting approval");
    };
  }, [teamLeaveRequestData]);

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      refetchTeamLeaveRequest();
    }
  }, [formik.isSubmitting && formik.status]);

  return (
    <>
      <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} justify="space-evenly" />
      <Flex
        backgroundColor={pendingLeaveRequests || approvedLeaveRequests || rejectedLeaveRequests ? "#f1f1f1" : "#FFFFFF"}
        px={3}
        flex={1}
        flexDir="column"
      >
        {tabValue === "waiting approval" ? (
          pendingLeaveRequests.length > 0 ? (
            <FlashList
              data={pendingLeaveRequests}
              onEndReachedThreshold={0.1}
              keyExtractor={(item, index) => index}
              estimatedItemSize={200}
              refreshing={true}
              refreshControl={
                <RefreshControl
                  refreshing={teamLeaveRequestIsFetching}
                  onRefresh={() => {
                    refetchTeamLeaveRequest();
                  }}
                />
              }
              renderItem={({ item, index }) => (
                <TeamLeaveRequestItem
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
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={teamLeaveRequestIsFetching} onRefresh={refetchTeamLeaveRequest} />
              }
            >
              <VStack mt={20} space={2} alignItems="center" justifyContent="center">
                <Image
                  source={require("../../../../assets/vectors/empty.png")}
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
            <FlashList
              data={approvedLeaveRequests}
              onEndReachedThreshold={0.1}
              keyExtractor={(item, index) => index}
              estimatedItemSize={200}
              refreshing={true}
              refreshControl={
                <RefreshControl
                  refreshing={teamLeaveRequestIsFetching}
                  onRefresh={() => {
                    refetchTeamLeaveRequest();
                  }}
                />
              }
              renderItem={({ item, index }) => (
                <TeamLeaveRequestItem
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
            <VStack mt={20} space={2} alignItems="center" justifyContent="center">
              <Image
                source={require("../../../../assets/vectors/empty.png")}
                alt="empty"
                resizeMode="contain"
                size="2xl"
              />
              <Text>No Data</Text>
            </VStack>
          )
        ) : rejectedLeaveRequests.length > 0 ? (
          <FlashList
            data={rejectedLeaveRequests}
            onEndReachedThreshold={0.1}
            keyExtractor={(item, index) => index}
            estimatedItemSize={200}
            refreshing={true}
            refreshControl={
              <RefreshControl
                refreshing={teamLeaveRequestIsFetching}
                onRefresh={() => {
                  refetchTeamLeaveRequest();
                }}
              />
            }
            renderItem={({ item, index }) => (
              <TeamLeaveRequestItem
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
          <VStack mt={20} space={2} alignItems="center" justifyContent="center">
            <Image
              source={require("../../../../assets/vectors/empty.png")}
              alt="empty"
              resizeMode="contain"
              size="2xl"
            />
            <Text>No Data</Text>
          </VStack>
        )}
      </Flex>
    </>
  );
};

export default memo(TeamLeaveRequestList);
