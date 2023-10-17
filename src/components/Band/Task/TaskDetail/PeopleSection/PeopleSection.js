import React, { memo, useState } from "react";

import { useSelector } from "react-redux";

import { Flex, FormControl, Icon, IconButton, Pressable, useToast } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../../shared/AvatarPlaceholder";
import ConfirmationModal from "../../../../shared/ConfirmationModal";
import { useDisclosure } from "../../../../../hooks/useDisclosure";
import axiosInstance from "../../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../../shared/ToastDialog";
import AddMemberModal from "../../../shared/AddMemberModal/AddMemberModal";

const PeopleSection = ({
  observers,
  responsibleArr,
  ownerId,
  ownerName,
  ownerImage,
  refetchObservers,
  disabled,
  selectedTask,
  refetchResponsible,
}) => {
  const toast = useToast();
  const userSelector = useSelector((state) => state.auth);
  const [selectedObserver, setSelectedObserver] = useState({});

  const { isOpen: deleteObserverModalIsOpen, toggle } = useDisclosure(false);
  const { isOpen: observerModalIsOpen, toggle: toggleObserverModal, close: closeObserverMocal } = useDisclosure(false);

  const getSelectedObserver = (id) => {
    toggle();

    // Filter team members which has the same id value of the selected member
    const filteredObserver = observers?.data.filter((observer) => {
      return observer.id === id;
    });

    setSelectedObserver(filteredObserver[0]);
  };

  /**
   * Handles take task as responsible
   */
  const takeTask = async () => {
    try {
      await axiosInstance.post("/pm/tasks/responsible", {
        task_id: selectedTask.id,
        user_id: userSelector.id,
      });
      refetchResponsible();
      toast.show({
        render: () => {
          return <SuccessToast message={`Task assigned`} />;
        },
      });
    } catch (error) {
      console.log(error);
      toast.show({
        render: () => {
          return <ErrorToast message={error.response.data.message} />;
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
        render: () => {
          return <SuccessToast message={`New observer added`} />;
        },
      });
      toggleObserverModal();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.show({
        render: () => {
          return <ErrorToast message={error.response.data.message} />;
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
                  <AvatarPlaceholder
                    key={responsible.id}
                    name={responsible.responsible_name}
                    image={responsible.responsible_image}
                    size="sm"
                  />
                );
              })
            ) : (
              <IconButton
                onPress={takeTask}
                size="md"
                borderRadius="full"
                icon={<Icon as={<MaterialCommunityIcons name="plus-circle-outline" />} color="#3F434A" />}
                alignSelf="flex-start"
              />
            )}
          </FormControl>

          <FormControl flex={1}>
            <FormControl.Label>CREATED BY</FormControl.Label>

            {ownerId && <AvatarPlaceholder name={ownerName} image={ownerImage} size="sm" />}
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

                  <IconButton
                    onPress={toggleObserverModal}
                    size="md"
                    borderRadius="full"
                    icon={<Icon as={<MaterialCommunityIcons name="plus-circle-outline" />} color="#3F434A" />}
                    alignSelf="flex-start"
                  />
                </Flex>
              </>
            ) : (
              <IconButton
                onPress={toggleObserverModal}
                size="md"
                borderRadius="full"
                icon={<Icon as={<MaterialCommunityIcons name="plus-circle-outline" />} color="#3F434A" />}
                alignSelf="flex-start"
              />
            )}
          </Flex>
        </FormControl>
      </Flex>

      {observerModalIsOpen && (
        <AddMemberModal isOpen={observerModalIsOpen} onClose={closeObserverMocal} onPressHandler={addObserverToTask} />
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
    </>
  );
};

export default memo(PeopleSection);
