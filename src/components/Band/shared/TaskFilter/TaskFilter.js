import React, { memo, useCallback, useState } from "react";

import _ from "lodash";

import { TouchableOpacity, View } from "react-native";
import { Actionsheet, Button, FormControl, Icon, IconButton, Select, Skeleton, VStack } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../../../hooks/useDisclosure";
import Input from "../../../shared/Forms/Input";

const TaskFilter = ({
  members,
  labels,
  setSelectedLabelId,
  selectedLabelId,
  responsibleId,
  deadlineSort,
  selectedPriority,
  setResponsibleId,
  setDeadlineSort,
  setSelectedPriority,
  setSearchInput,
  searchInput,
}) => {
  const [selectedLabel, setSelectedLabel] = useState("");
  const [shownInput, setShownInput] = useState("");
  const [isReady, setIsReady] = useState(false);
  const { isOpen: filterIsOpen, toggle: toggleFilter } = useDisclosure(false);

  const openFilterHandler = () => {
    toggleFilter();
    setTimeout(() => {
      setIsReady(true);
    }, 150);
  };

  const handleChangeInput = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
    }, 300),
    []
  );

  const onPressLabel = (label) => {
    setSelectedLabelId(label);
    setSelectedLabel(label);
  };

  return (
    <>
      <Input
        value={shownInput}
        onChangeText={(value) => {
          handleChangeInput(value);
          setShownInput(value);
        }}
        placeHolder="Search task..."
        endAdornment={
          <View style={{ display: "flex", flexDirection: "row", gap: 10, alignItems: "center" }}>
            {shownInput && (
              <TouchableOpacity
                onPress={() => {
                  setSearchInput("");
                  setShownInput("");
                }}
              >
                <MaterialCommunityIcons name="close" size={20} color="#3F434A" />
              </TouchableOpacity>
            )}

            {/* <TouchableOpacity onPress={() => openFilterHandler()}>
              <MaterialCommunityIcons name="tune-variant" size={20} color="#3F434A"/>
            </TouchableOpacity> */}
          </View>
        }
      />

      {/* {filterIsOpen && (
        <Actionsheet
          isOpen={filterIsOpen}
          onClose={() => {
            toggleFilter();
            setIsReady(false);
          }}
        >
          <Actionsheet.Content>
            {isReady ? (
              <VStack w="95%" space={2}>
                <FormControl.Label>Member</FormControl.Label>
                <Select
                  onValueChange={(value) => setResponsibleId(value)}
                  defaultValue={responsibleId}
                  dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                >
                  <Select.Item label="All Member" value="all" />
                  <Select.Item label="Not Assigned" value="" />
                  {members?.length > 0 &&
                    members.map((member, index) => {
                      return (
                        <Select.Item
                          key={index}
                          label={member?.member_name?.split(" ")[0] || member.responsible_name.split(" ")[0]}
                          value={member.user_id || member.responsible_id}
                        />
                      );
                    })}
                </Select>

                <FormControl.Label>Label</FormControl.Label>
                <Select
                  defaultValue={selectedLabel}
                  onValueChange={(value) => onPressLabel(value)}
                  dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                >
                  <Select.Item label="No Label" value="" />

                  {labels?.data.map((label) => {
                    return <Select.Item key={label.id} label={label.label_name} value={label.label_id} />;
                  })}
                </Select>

                <FormControl.Label>Due Date</FormControl.Label>
                <Select
                  defaultValue={deadlineSort}
                  onValueChange={(value) => setDeadlineSort(value)}
                  dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                >
                  <Select.Item label="Closest" value="asc" />
                  <Select.Item label="Latest" value="desc" />
                </Select>

                <FormControl.Label>Priority</FormControl.Label>
                <Select
                  defaultValue={selectedPriority}
                  onValueChange={(value) => setSelectedPriority(value)}
                  dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
                >
                  <Select.Item label="All Priority" value="" />
                  <Select.Item label="Low" value="Low" />
                  <Select.Item label="Medium" value="Medium" />
                  <Select.Item label="High" value="High" />
                </Select>

                <Button
                  mt={4}
                  onPress={() => {
                    setDeadlineSort("asc");
                    setResponsibleId("");
                    setSelectedLabel("");
                    setSelectedPriority("");

                    // Reset labels
                    setSelectedLabel("");
                    setSelectedLabelId(null);
                  }}
                >
                  Reset Filter
                </Button>
              </VStack>
            ) : (
              <Skeleton h={41} />
            )}
          </Actionsheet.Content>
        </Actionsheet>
      )} */}
    </>
  );
};

export default memo(TaskFilter);
