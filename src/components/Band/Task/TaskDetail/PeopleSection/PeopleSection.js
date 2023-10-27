import React, { memo, useState } from "react";

import { useSelector } from "react-redux";

import { TouchableOpacity } from "react-native";
import { Actionsheet, Flex, FormControl, Icon, IconButton, Pressable, useToast } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../../shared/AvatarPlaceholder";
import ConfirmationModal from "../../../../shared/ConfirmationModal";
import { useDisclosure } from "../../../../../hooks/useDisclosure";
import axiosInstance from "../../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../../shared/ToastDialog";
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
  const toast = useToast();
  const userSelector = useSelector((state) => state.auth);
  const [selectedObserver, setSelectedObserver] = useState({});

  const { isOpen: deleteObserverModalIsOpen, toggle } = useDisclosure(false);
  const { isOpen: observerModalIsOpen, toggle: toggleObserverModal, close: closeObserverMocal } = useDisclosure(false);
  const { isOpen: memberSelectIsOpen, toggle: toggleMemberSelect } = useDisclosure(false);

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
      toggleMemberSelect();
      refetchResponsible();
      refetchTask();
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message={`Task assigned`} close={() => toast.close(id)} />;
        },
      });
    } catch (error) {
      console.log(error);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={error.response.data.message} close={() => toast.close(id)} />;
        },
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
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message={`New observer added`} close={() => toast.close(id)} />;
        },
      });
      toggleObserverModal();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={error.response.data.message} close={() => toast.close(id)} />;
        },
      });
      toggleObserverModal();
    }
  };

  return (
    <>
      <Flex gap={5}>
        {/* Responsible and creator */}
        <Flex flexDir="row">
          <FormControl flex={1}>
            <FormControl.Label>ASSIGNED TO</FormControl.Label>
            {responsibleArr?.length > 0 ? (
              responsibleArr.map((responsible) => {
                return (
                  <TouchableOpacity key={responsible.id} onPress={toggleMemberSelect}>
                    <AvatarPlaceholder
                      name={responsible.responsible_name}
                      image={responsible.responsible_image}
                      size="sm"
                    />
                  </TouchableOpacity>
                );
              })
            ) : (
              <IconButton
                onPress={toggleMemberSelect}
                size="md"
                borderRadius="full"
                icon={<Icon as={<MaterialCommunityIcons name="plus-circle-outline" />} color="#3F434A" />}
                alignSelf="flex-start"
              />
            )}
          </FormControl>

          <FormControl flex={1}>
            <FormControl.Label>CREATED BY</FormControl.Label>

            {ownerId && (
              <AvatarPlaceholder name={ownerName} image={ownerImage} email={ownerEmail} size="sm" isPressable={true} />
            )}
          </FormControl>
        </Flex>

        {/* Observers */}
        <FormControl>
          <FormControl.Label>OBSERVER</FormControl.Label>
          <Flex flexDir="row" gap={1}>
            {observers?.length > 0 ? (
              <>
                <Flex flexDir="row" alignItems="center" gap={1}>
                  {observers.map((observer) => {
                    return (
                      <Pressable key={observer.id} onPress={() => getSelectedObserver(observer.id)} disabled={disabled}>
                        <AvatarPlaceholder image={observer.observer_image} name={observer.observer_name} size="sm" />
                      </Pressable>
                    );
                  })}

                  {!disabled && (
                    <IconButton
                      onPress={toggleObserverModal}
                      size="md"
                      borderRadius="full"
                      icon={<Icon as={<MaterialCommunityIcons name="plus-circle-outline" />} color="#3F434A" />}
                      alignSelf="flex-start"
                    />
                  )}
                </Flex>
              </>
            ) : (
              !disabled && (
                <IconButton
                  onPress={toggleObserverModal}
                  size="md"
                  borderRadius="full"
                  icon={<Icon as={<MaterialCommunityIcons name="plus-circle-outline" />} color="#3F434A" />}
                  alignSelf="flex-start"
                />
              )
            )}
          </Flex>
        </FormControl>
      </Flex>

      {observerModalIsOpen && (
        <AddMemberModal
          header="New Observer"
          isOpen={observerModalIsOpen}
          onClose={closeObserverMocal}
          onPressHandler={addObserverToTask}
        />
      )}

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

      <Actionsheet isOpen={memberSelectIsOpen} onClose={toggleMemberSelect}>
        <Actionsheet.Content>
          {members?.data?.length > 0 ? (
            members.data.map((member) => {
              return (
                <Actionsheet.Item key={member.id} onPress={() => takeTask(member.user_id)}>
                  {member.member_name}
                </Actionsheet.Item>
              );
            })
          ) : (
            <Actionsheet.Item onPress={() => takeTask(userSelector.id)}>{userSelector.name}</Actionsheet.Item>
          )}
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};

export default memo(PeopleSection);
