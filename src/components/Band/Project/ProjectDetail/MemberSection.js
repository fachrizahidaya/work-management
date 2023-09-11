import React, { useState } from "react";

import { useSelector } from "react-redux";

import { ScrollView } from "react-native-gesture-handler";
import { Box, Flex, Icon, Pressable, Text, useToast } from "native-base";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AddMemberModal from "../../shared/AddMemberModal/AddMemberModal";
import { useFetch } from "../../../../hooks/useFetch";
import axiosInstance from "../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../shared/ToastDialog";
import ConfirmationModal from "../../../shared/ConfirmationModal";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";

const MemberSection = ({ projectId, projectData }) => {
  const toast = useToast();
  const userSelector = useSelector((state) => state.auth);
  const [memberModalIsOpen, setMemberModalIsOpen] = useState(false);
  const [deleteMemberModalIsOpen, setDeleteMemberModalIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState({});

  const { data: members, refetch: refetchMember } = useFetch(`/pm/projects/${projectId}/member`);

  const getSelectedMember = (id) => {
    setDeleteMemberModalIsOpen(true);

    // Filter team members which has the same id value of the selected member
    const filteredMember = members?.data.filter((member) => {
      return member.id === id;
    });

    setSelectedMember(filteredMember[0]);
  };

  /**
   * Add member to project handler
   * @param {Object} user - selected user to add to project
   */
  const addMember = async (userId) => {
    try {
      await axiosInstance.post("/pm/projects/member", {
        project_id: projectId,
        user_id: userId,
      });
      toast.show({
        render: () => {
          return <SuccessToast message={`New member added`} />;
        },
      });
      refetchMember();
    } catch (error) {
      console.log(error);
      toast.show({
        render: () => {
          return <ErrorToast message={error.response.data.message} />;
        },
      });
    }
  };

  return (
    <Flex style={{ gap: 18 }}>
      <Flex flexDir="row" justifyContent="space-between" alignItems="center">
        <Text fontSize={16}>MEMBERS</Text>

        <Pressable
          bg="#f1f2f3"
          alignItems="center"
          justifyContent="center"
          p={2}
          borderRadius={10}
          onPress={() => setMemberModalIsOpen(true)}
        >
          <Icon as={<MaterialCommunityIcons name="plus" />} color="black" />
        </Pressable>
      </Flex>

      {memberModalIsOpen && (
        <AddMemberModal isOpen={memberModalIsOpen} setIsOpen={setMemberModalIsOpen} onPressHandler={addMember} />
      )}

      {projectData && (
        <ScrollView style={{ maxHeight: 200 }}>
          <Box flex={1} minHeight={2}>
            <FlashList
              data={members?.data}
              keyExtractor={(item) => item?.id}
              onEndReachedThreshold={0.1}
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
                      <Text fontSize={12} fontWeight={400}>
                        {item?.member_name}
                      </Text>
                      <Text fontSize={11} fontWeight={400} color="#8A9099">
                        {item?.member_email}
                      </Text>
                    </Box>
                  </Flex>

                  {userSelector.name === projectData?.owner_name && (
                    <>
                      {item?.member_name !== projectData?.owner_name && (
                        <Pressable onPress={() => getSelectedMember(item?.id)}>
                          <Icon
                            as={<MaterialCommunityIcons name="account-remove-outline" />}
                            size="md"
                            color="red.500"
                          />
                        </Pressable>
                      )}
                    </>
                  )}
                </Flex>
              )}
            />
          </Box>
        </ScrollView>
      )}

      <ConfirmationModal
        isOpen={deleteMemberModalIsOpen}
        setIsOpen={setDeleteMemberModalIsOpen}
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

export default MemberSection;
