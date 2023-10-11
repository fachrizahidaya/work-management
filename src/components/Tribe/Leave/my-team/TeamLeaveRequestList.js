import { useState } from "react";
import { useFormik } from "formik";
import dayjs from "dayjs";

import {
  Actionsheet,
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  Icon,
  Input,
  Modal,
  Pressable,
  Text,
  VStack,
  useToast,
} from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "./../../../../hooks/useDisclosure";
import axiosInstance from "../../../../config/api";
import AvatarPlaceholder from "./../../../shared/AvatarPlaceholder";
import FormButton from "../../../shared/FormButton";
import { SuccessToast } from "../../../shared/ToastDialog";

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
}) => {
  const { isOpen: approvalActionIsOpen, toggle: toggleApprovalAction } = useDisclosure(false);

  const toast = useToast();

  const approvalResponseHandler = async (data) => {
    try {
      const res = await axiosInstance.post(`/hr/approvals/approval`, data);
      refetchTeamLeaveRequest();
      toast.show({
        render: () => {
          return <SuccessToast message={`Task assigned`} />;
        },
        placement: "top",
      });
    } catch (err) {
      console.log(err);
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
    onSubmit: (values) => {
      approvalResponseHandler(values);
    },
  });

  const responseHandler = (response) => {
    formik.setFieldValue("status", response);
    formik.handleSubmit();
  };

  // Canceled status not appeared in team leave request
  return status === "Canceled" ? null : (
    <Box gap={2} borderTopColor="#E8E9EB" borderTopWidth={1} py={3} px={5}>
      <Flex flexDir="row" justifyContent="space-between" alignItems="center">
        <Flex gap={2} flex={1} flexDir="row">
          <AvatarPlaceholder image={image} name={name} size="xs" borderRadius="full" />
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
            <Button onPress={() => responseHandler("Rejected")} size="xs" bgColor="#FF6262">
              Decline
            </Button>
            <Button onPress={() => responseHandler("Approved")} size="xs" bgColor="#377893">
              Approve
            </Button>
          </Flex>
        ) : (
          <Text color={status === "Rejected" || status === "Canceled" ? "#FF6262" : "#437D96"}>{status}</Text>
        )}
      </Flex>
    </Box>
  );
};

export default TeamLeaveRequestList;
