import React from "react";

import { useSelector } from "react-redux";

import { ScrollView } from "react-native-gesture-handler";
import { Dimensions } from "react-native";
import { Button, Flex, FormControl, HStack, Icon, IconButton, KeyboardAvoidingView, Menu, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import CustomDateTimePicker from "../../../shared/CustomDateTimePicker";
import { useFetch } from "../../../../hooks/useFetch";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import { useKeyboardChecker } from "../../../../hooks/useKeyboardChecker";
import AttachmentSection from "./AttachmentSection/AttachmentSection";
import ChecklistSection from "./ChecklistSection/ChecklistSection";
import CostSection from "./CostSection/CostSection";
import LabelSection from "./LabelSection/LabelSection";
import CommentInput from "../../shared/CommentInput/CommentInput";

const TaskDetail = ({ safeAreaProps, onCloseDetail, selectedTask, openEditForm }) => {
  const { width } = Dimensions.get("window");
  const { isKeyboardVisible } = useKeyboardChecker();
  const userSelector = useSelector((state) => state.auth);
  const loggedUser = userSelector.id;
  const taskUserRights = [selectedTask?.project_owner_id, selectedTask?.owner_id, selectedTask?.responsible_id];
  const inputIsDisabled = !taskUserRights.includes(loggedUser);

  const { data: observers } = useFetch(selectedTask?.id && `/pm/tasks/${selectedTask?.id}/observer`);

  return (
    <KeyboardAvoidingView behavior="height" flex={1} width={width} pb={isKeyboardVisible ? 100 : 21}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <Flex {...safeAreaProps} bgColor="white" p={5} gap={5}>
          <Flex flexDir="row" alignItems="center" justifyContent="space-between">
            <HStack space={2}>
              <Menu
                w="160"
                trigger={(triggerProps) => {
                  return (
                    <Button size="md" {...triggerProps}>
                      <Flex flexDir="row" alignItems="center" gap={1}>
                        <Text color="white">{selectedTask?.status}</Text>
                      </Flex>
                    </Button>
                  );
                }}
              >
                <Menu.Item>Open</Menu.Item>
                <Menu.Item>On Progress</Menu.Item>
                <Menu.Item>Finish</Menu.Item>
              </Menu>

              <Button size="sm" variant="outline">
                <Flex flexDir="row" alignItems="center" gap={1}>
                  <Icon as={<MaterialCommunityIcons name="eye" />} size={6} mr={1} />
                  <Text>Add Observer</Text>
                </Flex>
              </Button>
            </HStack>

            <HStack space={2}>
              <Menu
                trigger={(triggerProps) => {
                  return (
                    <IconButton
                      {...triggerProps}
                      size="lg"
                      borderRadius="full"
                      icon={<Icon as={<MaterialCommunityIcons name="dots-horizontal" />} color="black" />}
                    />
                  );
                }}
              >
                <Menu.Item onPress={() => openEditForm(selectedTask)}>Edit</Menu.Item>
                <Menu.Item>
                  <Text color="red.600">Delete</Text>
                </Menu.Item>
              </Menu>

              <IconButton
                onPress={onCloseDetail}
                size="lg"
                borderRadius="full"
                icon={<Icon as={<MaterialCommunityIcons name="chevron-right" />} color="black" />}
              />
            </HStack>
          </Flex>
          <Text fontSize={20}>{selectedTask?.title}</Text>

          {/* Responsible and creator */}
          <Flex flexDir="row">
            <FormControl flex={1}>
              <FormControl.Label>ASSIGNED TO</FormControl.Label>
              {selectedTask?.responsible_id ? (
                <AvatarPlaceholder
                  name={selectedTask?.responsible_name}
                  image={selectedTask?.responsible_image}
                  size="sm"
                />
              ) : (
                <Text>Not assigned</Text>
              )}
            </FormControl>

            <FormControl flex={1}>
              <FormControl.Label>CREATED BY</FormControl.Label>
              {selectedTask?.owner_id && (
                <AvatarPlaceholder name={selectedTask?.owner_name} image={selectedTask?.owner_image} size="sm" />
              )}
            </FormControl>
          </Flex>

          {/* Observers */}
          <FormControl>
            <FormControl.Label>OBSERVER</FormControl.Label>
            <Flex flexDir="row" gap={1}>
              {observers?.data.length > 0 &&
                observers.data.map((observer) => {
                  return (
                    <AvatarPlaceholder
                      key={observer.id}
                      image={observer.observer_image}
                      name={observer.observer_name}
                      size="sm"
                    />
                  );
                })}
            </Flex>
          </FormControl>

          {/* Labels */}
          <LabelSection />

          {/* Due date and cost */}
          <Flex flexDir="column" justifyContent="space-between" gap={5}>
            <FormControl>
              <FormControl.Label>DUE DATE</FormControl.Label>
              <CustomDateTimePicker defaultValue={selectedTask?.deadline} disabled={inputIsDisabled} />
            </FormControl>

            <CostSection />
          </Flex>

          {/* Description */}
          <FormControl>
            <FormControl.Label>DESCRIPTION</FormControl.Label>
            <Text>{selectedTask?.description}</Text>
          </FormControl>

          {/* Checklists */}
          <ChecklistSection
            checklistFinishPercent={selectedTask?.checklist_finish_percent}
            totalChecklist={selectedTask?.total_checklist}
            totalChecklistFinish={selectedTask?.total_checklist_finish}
          />

          {/* Attachments */}
          <AttachmentSection taskId={selectedTask?.id} />

          {/* Comments */}
          <FormControl>
            <FormControl.Label>COMMENTS</FormControl.Label>
            <CommentInput taskId={selectedTask?.id} />
          </FormControl>
        </Flex>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TaskDetail;
