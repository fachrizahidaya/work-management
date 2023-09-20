import React, { useState } from "react";

import { Flex, FormControl, Pressable, Text } from "native-base";

import AvatarPlaceholder from "../../../../shared/AvatarPlaceholder";
import ConfirmationModal from "../../../../shared/ConfirmationModal";
import { useDisclosure } from "../../../../../hooks/useDisclosure";

const PeopleSection = ({ observers, responsibleArr, ownerId, ownerName, ownerImage, refetchObservers, disabled }) => {
  const [selectedObserver, setSelectedObserver] = useState({});

  const { isOpen: deleteObserverModalIsOpen, toggle } = useDisclosure(false);

  const getSelectedObserver = (id) => {
    toggle();

    // Filter team members which has the same id value of the selected member
    const filteredObserver = observers?.data.filter((observer) => {
      return observer.id === id;
    });

    setSelectedObserver(filteredObserver[0]);
  };
  return (
    <>
      <Flex gap={5}>
        {/* Responsible and creator */}
        <Flex flexDir="row">
          <FormControl flex={1}>
            <FormControl.Label>ASSIGNED TO</FormControl.Label>
            {responsibleArr?.length > 0 ? (
              <>
                {responsibleArr.map((responsible) => {
                  return (
                    <AvatarPlaceholder
                      key={responsible.id}
                      name={responsible.responsible_name}
                      image={responsible.responsible_image}
                      size="sm"
                    />
                  );
                })}
              </>
            ) : (
              <Text>Not assigned</Text>
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
            {observers?.data.length > 0 &&
              observers.data.map((observer) => {
                return (
                  <Pressable key={observer.id} onPress={() => getSelectedObserver(observer.id)} disabled={disabled}>
                    <AvatarPlaceholder image={observer.observer_image} name={observer.observer_name} size="sm" />
                  </Pressable>
                );
              })}
          </Flex>
        </FormControl>
      </Flex>

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

export default PeopleSection;
