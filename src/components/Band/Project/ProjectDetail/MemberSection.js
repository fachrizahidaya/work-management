import React, { memo, useState } from "react";

import { SheetManager } from "react-native-actions-sheet";

import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";

import AddMemberModal from "../../shared/AddMemberModal/AddMemberModal";
import axiosInstance from "../../../../config/api";
import ConfirmationModal from "../../../shared/ConfirmationModal";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import { TextProps } from "../../../shared/CustomStylings";

const MemberSection = ({ projectId, projectData, members, refetchMember, isAllowed }) => {
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
      Toast.show({
        type: "success",
        text1: "New member added",
      });
      toggleMemberModal();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      Toast.show({
        type: "error",
        text1: error.response.data.message,
      });
      toggleMemberModal();
    }
  };

  return (
    <View style={{ display: "flex", gap: 18 }}>
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={[{ fontSize: 16, fontWeight: 500 }, TextProps]}>MEMBERS</Text>

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
            <MaterialCommunityIcons name="plus" size={20} />
          </TouchableOpacity>
        )}
      </View>

      {memberModalIsOpen && (
        <AddMemberModal
          header="New Member"
          isOpen={memberModalIsOpen}
          onClose={closeMemberModal}
          onPressHandler={addMember}
        />
      )}

      <ScrollView style={{ maxHeight: 200 }}>
        <View style={{ flex: 1, minHeight: 2 }}>
          <FlashList
            extraData={projectData?.owner_name}
            data={members?.data}
            keyExtractor={(item) => item?.id}
            onEndReachedThreshold={0.2}
            estimatedItemSize={34}
            renderItem={({ item }) => (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingRight: 3,
                  marginBottom: 14,
                }}
              >
                <View style={{ gap: 14, display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <AvatarPlaceholder size="sm" name={item.member_name} image={item.member_image} />

                  <View>
                    <Text style={[{ fontWeight: 500 }, TextProps]}>{item?.member_name}</Text>
                    <Text style={{ fontWeight: 500, color: "#8A9099" }}>{item?.member_email}</Text>
                  </View>
                </View>

                {isAllowed && (
                  <>
                    {item?.user_id !== projectData?.owner_id && (
                      <Pressable
                        onPress={() =>
                          SheetManager.show("form-sheet", {
                            payload: {
                              children: (
                                <View style={{ padding: 20 }}>
                                  <TouchableOpacity
                                    onPress={async () => {
                                      await SheetManager.hide("form-sheet");
                                      getSelectedMember(item.id);
                                    }}
                                    style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}
                                  >
                                    <MaterialCommunityIcons name="account-remove-outline" size={20} color="red" />

                                    <Text style={{ color: "red" }}>Remove Member</Text>
                                  </TouchableOpacity>
                                </View>
                              ),
                            },
                          })
                        }
                      >
                        <MaterialCommunityIcons name="dots-vertical" size={20} />
                      </Pressable>
                    )}
                  </>
                )}
              </View>
            )}
          />
        </View>
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

      <Toast position="bottom" />
    </View>
  );
};

export default memo(MemberSection);
