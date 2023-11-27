import React, { memo, useState } from "react";

import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Box, Flex, Icon, Menu, Pressable, Text, useToast } from "native-base";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AddMemberModal from "../../shared/AddMemberModal/AddMemberModal";
import axiosInstance from "../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../shared/ToastDialog";
import ConfirmationModal from "../../../shared/ConfirmationModal";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import { useDisclosure } from "../../../../hooks/useDisclosure";

const MemberSection = ({ projectId, projectData, members, refetchMember, isAllowed }) => {
  const toast = useToast();
  const { isOpen: deleteMemberModalIsOpen, toggle } = useDisclosure(false);
  const [selectedMember, setSelectedMember] = useState({});
  const { isOpen: memberModalIsOpen, toggle: toggleMemberModal, close: closeMemberModal } = useDisclosure(false);

  const getSelectedMember = (id) => {
    toggle();

    // Filter team members which has the same id value of the selected member
    const filteredMember = members?.data.filter((member) => {
      return member.id === id;
    });

    setSelectedMember(filteredMember[0]);
  };

  /**
   * Add member to project handler
   * @param {Array} users - selected user id to add to project
   */
  const addMember = async (users, setIsLoading) => {
    try {
      for (let i = 0; i < users.length; i++) {
        await axiosInstance.post("/pm/projects/member", {
          project_id: projectId,
          user_id: users[i],
        });
      }
      setIsLoading(false);
      refetchMember();
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message={`New member added`} close={() => toast.close(id)} />;
        },
      });
      toggleMemberModal();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={error.response.data.message} close={() => toast.close(id)} />;
        },
      });
      toggleMemberModal();
    }
  };

  return (
    <Flex style={{ gap: 18 }}>
      <Flex flexDir="row" justifyContent="space-between" alignItems="center">
        <Text fontSize={16}>MEMBERS</Text>

        {isAllowed && (
          <TouchableOpacity
            onPress={toggleMemberModal}
            style={{
              backgroundColor: "#f1f2f3",
              alignItems: "center",
              justifyContent: "center",
              padding: 8,
              borderRadius: 10,
            }}
          >
            <Icon as={<MaterialCommunityIcons name="plus" />} color="black" />
          </TouchableOpacity>
        )}
      </Flex>

      {memberModalIsOpen && (
        <AddMemberModal
          header="New Member"
          isOpen={memberModalIsOpen}
          onClose={closeMemberModal}
          onPressHandler={addMember}
        />
      )}

      <ScrollView style={{ maxHeight: 200 }}>
        <Box flex={1} minHeight={2}>
          <FlashList
            extraData={projectData?.owner_name}
            data={members?.data}
            keyExtractor={(item) => item?.id}
            onEndReachedThreshold={0.2}
            estimatedItemSize={200}
            renderItem={({ item }) => (
              <Flex
                flexDir="row"
                alignItems="center"
                justifyContent="space-between"
                pr={1.5}
                style={{ marginBottom: 14 }}
              >
                <Flex flexDir="row" alignItems="center" style={{ gap: 14 }}>
                  <AvatarPlaceholder size="sm" name={item.member_name} image={item.member_image} />

                  <Box>
                    <Text>{item?.member_name}</Text>
                    <Text color="#8A9099">{item?.member_email}</Text>
                  </Box>
                </Flex>

                {isAllowed && (
                  <>
                    {item?.user_id !== projectData?.owner_id && (
                      <Menu
                        trigger={(triggerProps) => {
                          return (
                            <Pressable {...triggerProps}>
                              <Icon as={<MaterialCommunityIcons name="dots-vertical" />} color="black" size="md" />
                            </Pressable>
                          );
                        }}
                      >
                        {item?.user_id !== projectData?.owner_id && (
                          <Menu.Item onPress={() => getSelectedMember(item.id)}>
                            <Flex flexDir="row" alignItems="center" gap={2}>
                              <Icon
                                as={<MaterialCommunityIcons name="account-remove-outline" />}
                                size="md"
                                color="red.600"
                              />
                              <Text color="red.600">Remove Member</Text>
                            </Flex>
                          </Menu.Item>
                        )}
                      </Menu>
                    )}
                  </>
                )}
              </Flex>
            )}
          />
        </Box>
      </ScrollView>

      <ConfirmationModal
        isOpen={deleteMemberModalIsOpen}
        toggle={toggle}
        apiUrl={`/pm/projects/member/${selectedMember?.id}`}
        successMessage="Member removed"
        header="Remove Member"
        description={`Are you sure to remove ${selectedMember?.member_name}?`}
        hasSuccessFunc={true}
        onSuccess={refetchMember}
      />
    </Flex>
  );
};

export default memo(MemberSection);
