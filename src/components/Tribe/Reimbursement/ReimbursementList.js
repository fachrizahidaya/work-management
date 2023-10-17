import dayjs from "dayjs";

import { Actionsheet, Badge, Box, Flex, Icon, Pressable, Text } from "native-base";
import { ScrollView } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import CustomAccordion from "../../shared/CustomAccordion";
import { useDisclosure } from "../../../hooks/useDisclosure";
import ConfirmationModal from "../../shared/ConfirmationModal";

const ReimbursementList = () => {
  const { isOpen: actionIsOpen, toggle: toggleAction } = useDisclosure(false);
  const { isOpen: cancelModalIsOpen, toggle: toggleCancelModal } = useDisclosure(false);

  return (
    <Flex gap={10}>
      {/* {pendingCount === 0 ? null : ( */}
      <CustomAccordion title="Pending" subTitle={0}>
        <ScrollView style={{ maxHeight: 300 }}>
          <Box flex={1} minHeight={2}>
            {/* {pendingLeaveRequest.map((item) => {
              return ( */}
            <Box gap={2} borderTopColor="#E8E9EB" borderTopWidth={1} py={3} px={3}>
              <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                <Text fontWeight={500} fontSize={14} color="#3F434A">
                  Grab
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.
                  </Text>
                </Flex>
              </Flex>
              <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                <Text color="#595F69" fontSize={12} fontWeight={400}>
                  Rp. 250,000
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
                  17.10.2023
                </Text>
                <Text color={"#FF6262"}>Pending</Text>
              </Flex>
            </Box>
            {/* );
            })} */}
          </Box>
        </ScrollView>
      </CustomAccordion>
      {/* )} */}
    </Flex>
  );
};

export default ReimbursementList;
