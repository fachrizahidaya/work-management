import dayjs from "dayjs";

import { Actionsheet, Badge, Box, Flex, Icon, Pressable, Text } from "native-base";
import { ScrollView } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import CustomAccordion from "../../shared/CustomAccordion";
import { useDisclosure } from "../../../hooks/useDisclosure";
import ConfirmationModal from "../../shared/ConfirmationModal";

const ReimbursementList = ({ data }) => {
  const { isOpen: actionIsOpen, toggle: toggleAction } = useDisclosure(false);
  const { isOpen: cancelModalIsOpen, toggle: toggleCancelModal } = useDisclosure(false);

  const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  return (
    <Flex gap={10}>
      {/* {pendingCount === 0 ? null : ( */}
      <CustomAccordion title="Pending" subTitle={0}>
        <ScrollView style={{ maxHeight: 300 }}>
          <Box flex={1} minHeight={2}>
            {data.map((item) => {
              return (
                <Box gap={2} borderTopColor="#E8E9EB" borderTopWidth={1} py={3} px={3}>
                  <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                    <Text fontWeight={500} fontSize={14} color="#3F434A">
                      {item.title}
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
                      // apiUrl={`/hr/leave-requests/${id}/cancel`}
                      color="coolGray.500"
                      hasSuccessFunc={true}
                      header="Cancel Leave Request"
                      onSuccess={() => {
                        toggleAction();
                        // refetchPersonalLeaveRequest();
                        // refetchProfile();
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
                        {item.description}
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                    <Text color="#595F69" fontSize={12} fontWeight={400}>
                      {rupiah(item.total)}
                    </Text>
                    <Icon
                      as={<MaterialCommunityIcons name="attachment" />}
                      style={{ transform: [{ rotate: "-35deg" }] }}
                      size="md"
                      borderRadius="full"
                      color="#186688"
                    />
                  </Flex>
                  <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                    <Text color="#595F69" fontSize={12} fontWeight={400}>
                      {dayjs(item.date).format("DD.MM.YYYY")}
                    </Text>
                    <Text color={"#FF6262"}>{item.status}</Text>
                  </Flex>
                </Box>
              );
            })}
          </Box>
        </ScrollView>
      </CustomAccordion>
      {/* )} */}
    </Flex>
  );
};

export default ReimbursementList;
