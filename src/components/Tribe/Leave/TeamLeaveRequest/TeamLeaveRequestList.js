import { useEffect, useState } from "react";
import { useFormik } from "formik";
import dayjs from "dayjs";

import { Badge, Box, Flex, Icon, Text, useToast } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "./../../../../hooks/useDisclosure";
import axiosInstance from "../../../../config/api";
import AvatarPlaceholder from "./../../../shared/AvatarPlaceholder";
import FormButton from "../../../shared/FormButton";
import { ErrorToast, SuccessToast } from "../../../shared/ToastDialog";

const TeamLeaveRequestList = ({
  id,
  name,
  image,
  leaveName,
  days,
  startDate,
  endDate,
  status,
  reason,
  type,
  objectId,
  object,
  refetchTeamLeaveRequest,
  approvalLeaveRequestCheckAccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(null);

  const toast = useToast();

  const approvalResponseHandler = async (data, setStatus, setSubmitting) => {
    try {
      const res = await axiosInstance.post(`/hr/approvals/approval`, data);
      setSubmitting(false);
      setStatus("success");
      // refetchTeamLeaveRequest();
      toast.show({
        render: ({ id }) => {
          return (
            <SuccessToast
              message={data.status === "Approved" ? "Request Approved" : "Request Rejected"}
              close={() => toast.close(id)}
            />
          );
        },
        placement: "top",
      });
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={"Process failed, please try again later"} close={() => toast.close(id)} />;
        },
        placement: "top",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      object: object,
      object_id: objectId,
      type: type,
      status: "",
      notes: "",
    },
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setStatus("processing");
      approvalResponseHandler(values, setStatus, setSubmitting);
    },
  });

  const responseHandler = (response) => {
    formik.setFieldValue("status", response);
    setIsSubmitting(response);
    formik.handleSubmit();
    // refetchTeamLeaveRequest();
  };

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      refetchTeamLeaveRequest();
    }
  }, [formik.isSubmitting && formik.status]);

  // Canceled status not appeared in team leave request
  return status === "Canceled" || status === "Rejected" ? null : (
    <Box gap={2} borderTopColor="#E8E9EB" borderTopWidth={1} py={3} px={5}>
      <Flex flexDir="row" justifyContent="space-between" alignItems="center">
        <Flex gap={2} flex={1} flexDir="row">
          <AvatarPlaceholder image={image} name={name} size="xs" borderRadius="full" isThumb={false} />
          <Flex flexDir="row" alignItems="center">
            <Text fontWeight={500} fontSize={14} color="#3F434A">
              {leaveName}
            </Text>{" "}
            |{" "}
            <Text fontWeight={500} fontSize={14} color="#377893">
              {name}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex flexDir="row" justifyContent="space-between" alignItems="center">
        <Flex flex={1}>
          <Text color="#595F69" fontSize={12} fontWeight={400}>
            {reason}
          </Text>
        </Flex>
        <Badge borderRadius={10} w={20}>
          <Flex gap={2} flexDir="row">
            <Icon as={<MaterialCommunityIcons name="clock-outline" />} size={5} color="#186688" />
            {days > 1 ? `${days} days` : `${days} day`}
          </Flex>
        </Badge>
      </Flex>
      <Flex flexDir="row" justifyContent="space-between" alignItems="center">
        <Text color="#595F69" fontSize={12} fontWeight={400}>
          {dayjs(startDate).format("DD.MM.YYYY")} - {dayjs(endDate).format("DD.MM.YYYY")}
        </Text>
        {status === "Pending" ? (
          <Flex gap={1} flexDir="row">
            <FormButton
              onPress={() => responseHandler("Rejected")}
              isSubmitting={isSubmitting === "Rejected" ? formik.isSubmitting : null}
              size="xs"
              color="red.500"
            >
              Decline
            </FormButton>
            <FormButton
              onPress={() => approvalLeaveRequestCheckAccess && responseHandler("Approved")}
              isSubmitting={isSubmitting === "Approved" ? formik.isSubmitting : null}
              size="xs"
              bgColor="#377893"
            >
              Approve
            </FormButton>
          </Flex>
        ) : (
          <Text color={status === "Rejected" || status === "Canceled" ? "#FF6262" : "#437D96"}>{status}</Text>
        )}
      </Flex>
    </Box>
  );
};

export default TeamLeaveRequestList;
