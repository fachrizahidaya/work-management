import { ScrollView } from "react-native-gesture-handler";
import { Actionsheet, Badge, Box, Flex, Icon, Pressable, Text, useToast } from "native-base";
import dayjs from "dayjs";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../../hooks/useDisclosure";
import ConfirmationModal from "../../shared/ConfirmationModal";
import CustomAccordion from "../../shared/CustomAccordion";

const LeaveRequestList = ({
  data,
  pendingLeaveRequests,
  approvedLeaveRequests,
  rejectedLeaveRequests,
  isLoading,
  refetchPersonalLeaveRequest,
  personalLeaveRequestIsFetching,
  refetchProfile,
  pendingCount,
  approvedCount,
  rejectedCount,
}) => {
  const { isOpen: actionIsOpen, toggle: toggleAction } = useDisclosure(false);
  const { isOpen: cancelModalIsOpen, toggle: toggleCancelModal } = useDisclosure(false);

  const toast = useToast();

  return (
    <Flex gap={10}>
      {/* Pending Leave handler */}
      {pendingCount === 0 ? null : (
        <CustomAccordion title="Pending" subTitle={pendingCount || 0}>
          <ScrollView style={{ maxHeight: 300 }}>
            <Box flex={1} minHeight={2}>
              {pendingLeaveRequests.map((item) => {
                return (
                  <Box key={item?.id} gap={2} borderTopColor="#E8E9EB" borderTopWidth={1} py={3} px={3}>
                    <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                      <Text fontWeight={500} fontSize={14} color="#3F434A">
                        {item?.leave_name}
                      </Text>
                      <Pressable onPress={toggleAction}>
                        <Icon
                          as={<MaterialCommunityIcons name="dots-vertical" />}
                          size="md"
                          borderRadius="full"
                          color="#000000"
                        />
                      </Pressable>

                      <Actionsheet isOpen={actionIsOpen} onClose={toggleAction}>
                        <Actionsheet.Content>
                          <Actionsheet.Item onPress={toggleCancelModal}>Cancel Request</Actionsheet.Item>
                        </Actionsheet.Content>
                      </Actionsheet>

                      <ConfirmationModal
                        isOpen={cancelModalIsOpen}
                        toggle={toggleCancelModal}
                        apiUrl={`/hr/leave-requests/${item?.id}/cancel`}
                        color="red.800"
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
                        placement="top"
                      />
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
                  </Box>
                );
              })}
            </Box>
          </ScrollView>
        </CustomAccordion>
      )}

      {/* Approved Leave handler */}
      {approvedCount === 0 ? null : (
        <CustomAccordion title="Approved" subTitle={approvedCount || 0}>
          <ScrollView style={{ maxHeight: 300 }}>
            <Box flex={1} minHeight={2}>
              {approvedLeaveRequests.map((item) => {
                return (
                  <Box key={item?.id} gap={2} borderTopColor="#E8E9EB" borderTopWidth={1} py={3} px={3}>
                    <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                      <Text fontWeight={500} fontSize={14} color="#3F434A">
                        {item?.leave_name}
                      </Text>
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
                  </Box>
                );
              })}
            </Box>
          </ScrollView>
        </CustomAccordion>
      )}

      {/* Rejected Leave handler */}
      {rejectedCount === 0 ? null : (
        <CustomAccordion title="Rejected" subTitle={rejectedCount || 0}>
          <ScrollView style={{ maxHeight: 300 }}>
            <Box flex={1} minHeight={2}>
              {rejectedLeaveRequests.map((item) => {
                return (
                  <Box key={item?.id} gap={2} borderTopColor="#E8E9EB" borderTopWidth={1} py={3} px={3}>
                    <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                      <Text fontWeight={500} fontSize={14} color="#3F434A">
                        {item?.leave_name}
                      </Text>
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
                  </Box>
                );
              })}
            </Box>
          </ScrollView>
        </CustomAccordion>
      )}
    </Flex>
  );
};

export default LeaveRequestList;
