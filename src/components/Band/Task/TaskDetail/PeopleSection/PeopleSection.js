import React, { memo, useState } from "react";

import { useSelector } from "react-redux";
import { SheetManager } from "react-native-actions-sheet";

import { Pressable, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";

import AvatarPlaceholder from "../../../../shared/AvatarPlaceholder";
import ConfirmationModal from "../../../../shared/ConfirmationModal";
import { useDisclosure } from "../../../../../hooks/useDisclosure";
import axiosInstance from "../../../../../config/api";
import AddMemberModal from "../../../shared/AddMemberModal/AddMemberModal";
import { useFetch } from "../../../../../hooks/useFetch";

const PeopleSection = ({
  observers,
  responsibleArr,
  ownerId,
  ownerName,
  ownerImage,
  ownerEmail,
  refetchObservers,
  disabled,
  selectedTask,
  refetchResponsible,
  refetchTask,
}) => {
  const userSelector = useSelector((state) => state.auth);
  const [selectedObserver, setSelectedObserver] = useState({});

  const { isOpen: deleteObserverModalIsOpen, toggle } = useDisclosure(false);
  const { isOpen: observerModalIsOpen, toggle: toggleObserverModal, close: closeObserverMocal } = useDisclosure(false);

  const { data: members } = useFetch(selectedTask?.project_id && `/pm/projects/${selectedTask?.project_id}/member`);

  const getSelectedObserver = (id) => {
    toggle();

    // Filter team members which has the same id value of the selected member
    const filteredObserver = observers?.filter((observer) => {
      return observer.id === id;
    });

    setSelectedObserver(filteredObserver[0]);
  };

  /**
   * Handles take task as responsible
   */
  const takeTask = async (userId) => {
    try {
      if (selectedTask?.responsible_id) {
        await axiosInstance.patch(`/pm/tasks/responsible/${responsibleArr[0]?.id}`, {
          user_id: userId,
        });
      } else {
        await axiosInstance.post("/pm/tasks/responsible", {
          task_id: selectedTask.id,
          user_id: userId,
        });
      }
      refetchResponsible();
      refetchTask();
      SheetManager.hide("form-sheet");

      Toast.show({
        type: "success",
        text1: "Task assigned",
      });
    } catch (error) {
      console.log(error);

      Toast.show({
        type: "error",
        text1: error.response.data.message,
      });
    }
  };

  /**
   * Handle assign observer to selected task
   * @param {Array} users - selected user id to add as observer
   */
  const addObserverToTask = async (users, setIsLoading) => {
    try {
      for (let i = 0; i < users.length; i++) {
        await axiosInstance.post("/pm/tasks/observer", {
          task_id: selectedTask.id,
          user_id: users[i],
        });
      }
      refetchObservers();
      setIsLoading(false);

      Toast.show({
        type: "success",
        text1: "New observer added",
      });
      toggleObserverModal();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toggleObserverModal();

      Toast.show({
        type: "error",
        text1: error.response.data.message,
      });
    }
  };

  return (
    <>
      <View style={{ display: "flex", gap: 20 }}>
        {/* Responsible and creator */}
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View style={{ flex: 1, display: "flex", gap: 10 }}>
            <Text style={{ fontWeight: 500 }}>ASSIGNED TO</Text>
            {responsibleArr?.length > 0 ? (
              responsibleArr.map((responsible) => {
                return (
                  <TouchableOpacity
                    key={responsible.id}
                    onPress={() => {
                      if (!disabled) {
                        SheetManager.show("form-sheet", {
                          payload: {
                            children: (
                              <View style={{ display: "flex", gap: 21, paddingHorizontal: 20, paddingVertical: 16 }}>
                                {members?.data?.length > 0 ? (
                                  members.data.map((member) => {
                                    return (
                                      <TouchableOpacity key={member.id} onPress={() => takeTask(member.user_id)}>
                                        <Text style={{ fontWeight: 500 }}>{member.member_name}</Text>
                                      </TouchableOpacity>
                                    );
                                  })
                                ) : (
                                  <Actionsheet.Item onPress={() => takeTask(userSelector.id)}>
                                    <Text style={{ fontWeight: 500 }}>{userSelector.name}</Text>
                                  </Actionsheet.Item>
                                )}
                              </View>
                            ),
                          },
                        });
                      }
                    }}
                  >
                    <AvatarPlaceholder
                      name={responsible.responsible_name}
                      image={responsible.responsible_image}
                      size="sm"
                    />
                  </TouchableOpacity>
                );
              })
            ) : (
              <TouchableOpacity
                onPress={() =>
                  SheetManager.show("form-sheet", {
                    payload: {
                      children: (
                        <View style={{ display: "flex", gap: 21, paddingHorizontal: 20, paddingVertical: 16 }}>
                          {members?.data?.length > 0 ? (
                            members.data.map((member) => {
                              return (
                                <TouchableOpacity key={member.id} onPress={() => takeTask(member.user_id)}>
                                  <Text style={{ fontWeight: 500 }}>{member.member_name}</Text>
                                </TouchableOpacity>
                              );
                            })
                          ) : (
                            <Actionsheet.Item onPress={() => takeTask(userSelector.id)}>
                              <Text style={{ fontWeight: 500 }}>{userSelector.name}</Text>
                            </Actionsheet.Item>
                          )}
                        </View>
                      ),
                    },
                  })
                }
                style={{
                  backgroundColor: "#f1f2f3",
                  alignItems: "center",
                  alignSelf: "flex-start",
                  justifyContent: "center",
                  padding: 8,
                  borderRadius: 10,
                }}
              >
                <MaterialCommunityIcons name="plus" size={20} />
              </TouchableOpacity>
            )}
          </View>

          <View style={{ flex: 1, display: "flex", gap: 10 }}>
            <Text style={{ fontWeight: 500 }}>CREATED BY</Text>

            {ownerId && (
              <AvatarPlaceholder name={ownerName} image={ownerImage} email={ownerEmail} size="sm" isPressable={true} />
            )}
          </View>
        </View>

        {/* Observers */}
        {(!disabled || (disabled && observers?.length > 0)) && (
          <View style={{ flex: 1, display: "flex", gap: 10 }}>
            <Text style={{ fontWeight: 500 }}>OBSERVER</Text>
            <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
              {observers?.length > 0 ? (
                <>
                  <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                    {observers.map((observer) => {
                      return (
                        <Pressable
                          key={observer.id}
                          onPress={() => getSelectedObserver(observer.id)}
                          disabled={disabled}
                        >
                          <AvatarPlaceholder image={observer.observer_image} name={observer.observer_name} size="sm" />
                        </Pressable>
                      );
                    })}

                    {!disabled && (
                      <TouchableOpacity
                        onPress={toggleObserverModal}
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
                </>
              ) : (
                !disabled && (
                  <TouchableOpacity
                    onPress={toggleObserverModal}
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
                )
              )}
            </View>
          </View>
        )}

        <Toast position="bottom" />
      </View>

      <AddMemberModal
        header="New Observer"
        isOpen={observerModalIsOpen}
        onClose={closeObserverMocal}
        onPressHandler={addObserverToTask}
      />

      <ConfirmationModal
        isOpen={deleteObserverModalIsOpen}
        toggle={toggle}
        apiUrl={`/pm/tasks/observer/${selectedObserver?.id}`}
        header="Remove Observer"
        successMessage={"Observer removed"}
        description={`Are you sure to remove ${selectedObserver?.observer_name}?`}
        hasSuccessFunc={true}
        onSuccess={refetchObservers}
      />
    </>
  );
};

export default memo(PeopleSection);
