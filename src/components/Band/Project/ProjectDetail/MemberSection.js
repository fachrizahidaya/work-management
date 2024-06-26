import React, { memo, useState } from "react";

import { SheetManager } from "react-native-actions-sheet";
import Toast from "react-native-root-toast";

import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AddMemberModal from "../../shared/AddMemberModal/AddMemberModal";
import axiosInstance from "../../../../config/api";
import ConfirmationModal from "../../../shared/ConfirmationModal";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import { ErrorToastProps, SuccessToastProps, TextProps } from "../../../shared/CustomStylings";

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
      Toast.show("New member added", SuccessToastProps);

      toggleMemberModal();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      Toast.show(error.response.data.message, ErrorToastProps);
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
            <MaterialCommunityIcons name="plus" size={20} color="#3F434A" />
          </TouchableOpacity>
        )}
      </View>

      <AddMemberModal
        header="New Member"
        isOpen={memberModalIsOpen}
        onClose={closeMemberModal}
        onPressHandler={addMember}
      />

      {members?.data?.length > 0 && (
        <View style={{ flex: 1 }}>
          <FlashList
            extraData={projectData?.owner_name}
            data={members?.data}
            keyExtractor={(item) => item?.id}
            onEndReachedThreshold={0.2}
            estimatedItemSize={204}
            horizontal
            renderItem={({ item }) => (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingRight: 3,
                  paddingBottom: 10,
                  marginRight: 10,
                  gap: 20,
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
                                <View style={styles.menu}>
                                  <View style={styles.wrapper}>
                                    <TouchableOpacity
                                      onPress={async () => {
                                        await SheetManager.hide("form-sheet");
                                        getSelectedMember(item.id);
                                      }}
                                      style={styles.menuItem}
                                    >
                                      <Text style={{ color: "red", fontSize: 16, fontWeight: 700 }}>Remove Member</Text>

                                      <MaterialCommunityIcons name="account-remove-outline" size={20} color="red" />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              ),
                            },
                          })
                        }
                      >
                        <MaterialCommunityIcons name="dots-vertical" size={20} color="#3F434A" />
                      </Pressable>
                    )}
                  </>
                )}
              </View>
            )}
          />
        </View>
      )}

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
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    display: "flex",
    gap: 21,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: -20,
  },
  wrapper: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
});

export default memo(MemberSection);
