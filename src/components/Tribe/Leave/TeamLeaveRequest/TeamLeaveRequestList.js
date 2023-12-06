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
      <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} justifyContent="space-evenly" />
      <Flex backgroundColor="#f1f1f1" px={3} flex={1} flexDir="column">
        <ScrollView
          refreshControl={
            <RefreshControl onRefresh={refetchTeamLeaveRequest} refreshing={teamLeaveRequestIsFetching} />
          }
        >
          {tabValue === "waiting approval" ? (
            pendingLeaveRequests.length > 0 ? (
              pendingLeaveRequests.map((item, index) => {
                {
                  /* Pending Leave */
                }
                return (
                  <Flex key={index} my={1} flexDir="column" style={card.card} gap={1}>
                    <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                      <Flex gap={2} flex={1} flexDir="row">
                        <AvatarPlaceholder
                          image={item?.employee_image}
                          name={item?.employee_name}
                          size="xs"
                          borderRadius="full"
                          isThumb={false}
                        />
                        <Flex flexDir="row" alignItems="center">
                          <Text fontWeight={500} fontSize={14} color="#3F434A">
                            {item?.leave_name}
                          </Text>{" "}
                          |{" "}
                          <Text fontWeight={500} fontSize={14} color="#377893">
                            {item?.employee_name}
                          </Text>
                        </Flex>
                      </Flex>
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
                      <Flex gap={1} flexDir="row">
                        <FormButton
                          onPress={() => responseHandler("Rejected", item)}
                          isSubmitting={isSubmitting === "Rejected" ? formik.isSubmitting : null}
                          size="xs"
                          color="red.500"
                          fontColor="white"
                        >
                          Decline
                        </FormButton>
                        <FormButton
                          onPress={() => responseHandler("Approved", item)}
                          isSubmitting={isSubmitting === "Approved" ? formik.isSubmitting : null}
                          size="xs"
                          bgColor="#377893"
                          fontColor="white"
                        >
                          Approve
                        </FormButton>
                      </Flex>
                    </Flex>
                  </Flex>
                );
              })
            ) : (
              <VStack space={2} alignItems="center" justifyContent="center">
                <Flex flex={1} alignItems="center" justifyContent="center">
                  <Image
                    source={require("../../../../assets/vectors/empty.png")}
                    alt="empty"
                    resizeMode="contain"
                    size="2xl"
                  />
                  <Text>No Data</Text>
                </Flex>
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
                    <Flex gap={2} flex={1} flexDir="row">
                      <AvatarPlaceholder
                        image={item?.employee_image}
                        name={item?.employee_name}
                        size="xs"
                        borderRadius="full"
                        isThumb={false}
                      />
                      <Flex flexDir="row" alignItems="center">
                        <Text fontWeight={500} fontSize={14} color="#3F434A">
                          {item?.leave_name}
                        </Text>{" "}
                        |{" "}
                        <Text fontWeight={500} fontSize={14} color="#377893">
                          {item?.employee_name}
                        </Text>
                      </Flex>
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
                  source={require("../../../../assets/vectors/empty.png")}
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
                <Flex key={index} my={1} flexDir="column" style={card.card}>
                  <Flex gap={2} flex={1} flexDir="row">
                    <AvatarPlaceholder
                      image={item?.employee_image}
                      name={item?.employee_name}
                      size="xs"
                      borderRadius="full"
                      isThumb={false}
                    />
                    <Flex flexDir="row" alignItems="center">
                      <Text fontWeight={500} fontSize={14} color="#3F434A">
                        {item?.leave_name}
                      </Text>{" "}
                      |{" "}
                      <Text fontWeight={500} fontSize={14} color="#377893">
                        {item?.employee_name}
                      </Text>
                    </Flex>
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
                source={require("../../../../assets/vectors/empty.png")}
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

export default memo(TeamLeaveRequestList);
