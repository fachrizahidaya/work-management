import { Actionsheet, Badge, Box, Flex, Icon, Pressable, Text, useToast } from "native-base";
import dayjs from "dayjs";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../../hooks/useDisclosure";
import axiosInstance from "../../../config/api";
import ConfirmationModal from "../../shared/ConfirmationModal";

const LeaveRequestList = ({
  id,
  leaveName,
  days,
  startDate,
  endDate,
  status,
  supervisorName,
  reason,
  isLoading,
  refetchPersonalLeaveRequest,
  refetchProfile,
}) => {
  const { isOpen: actionIsOpen, toggle: toggleAction } = useDisclosure(false);
  const { isOpen: cancelModalIsOpen, toggle: toggleCancelModal } = useDisclosure(false);

  const toast = useToast();

  const leaveCancelHandler = async () => {
    try {
      const res = await axiosInstance.patch(`/hr/leave-requests/${id}/cancel`);
      refetchPersonalLeaveRequest();
      refetchProfile();
      toast.show({
        description: "Request Cancelled",
      });
      toggleAction();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {status === "Canceled" ? null : (
        <Box gap={2} borderTopColor="#E8E9EB" borderTopWidth={1} py={3} px={3}>
          <Flex flexDir="row" justifyContent="space-between" alignItems="center">
            <Text fontWeight={500} fontSize={14} color="#3F434A">
              {leaveName}
            </Text>
            {status !== "Pending" ? null : (
              <Pressable onPress={toggleAction}>
                <Icon
                  as={<MaterialCommunityIcons name="dots-vertical" />}
                  size="md"
                  borderRadius="full"
                  color="#000000"
                />
              </Pressable>
            )}
            <Actionsheet isOpen={actionIsOpen} onClose={toggleAction}>
              <Actionsheet.Content>
                <Actionsheet.Item onPress={toggleCancelModal}>Cancel Request</Actionsheet.Item>
              </Actionsheet.Content>
            </Actionsheet>
            <ConfirmationModal
              isOpen={cancelModalIsOpen}
              toggle={toggleCancelModal}
              apiUrl={`/hr/leave-requests/${id}/cancel`}
              color="red.600"
              hasSuccessFunc={true}
              header="Cancel Leave Request"
              onSuccess={() => {
                toggleAction();
                refetchPersonalLeaveRequest();
                refetchProfile();
              }}
              description="Are you sure to cancel this request?"
              successMessage="Request canceled"
              isDelete={false}
              isPatch={true}
            />
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
            <Text
              color={
                status === "Pending"
                  ? "#F0C290"
                  : status === "Declined" || status === "Canceled"
                  ? "#FF6262"
                  : "#437D96"
              }
            >
              {status}
            </Text>
          </Flex>
        </Box>
      )}
    </>
  );
};

export default LeaveRequestList;
