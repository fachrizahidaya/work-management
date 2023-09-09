import React from "react";

import { useSelector } from "react-redux";

import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { Box, Button, Flex, FormControl, HStack, Icon, IconButton, Input, Menu, Slider, Text } from "native-base";
import { FlashList } from "@shopify/flash-list";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import CustomDateTimePicker from "../../../shared/CustomDateTimePicker";
import AttachmentList from "./AttachmentList/AttachmentList";
import { useFetch } from "../../../../hooks/useFetch";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";

const TaskDetail = ({ safeAreaProps, width, onClick, selectedTask }) => {
  const userSelector = useSelector((state) => state.auth);
  const loggedUser = userSelector.id;
  const taskUserRights = [selectedTask?.project_owner_id, selectedTask?.owner_id, selectedTask?.responsible_id];
  const inputIsDisabled = !taskUserRights.includes(loggedUser);

  const { data: observers, isLoading: observerIsLoading } = useFetch(`/pm/tasks/${selectedTask?.id}/observer`);
  const { data: attachments, isLoading: attachmentIsLoading } = useFetch(`/pm/tasks/${selectedTask?.id}/attachment`);

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <Flex {...safeAreaProps} bgColor="white" h="100%" w={width} p={5} gap={5}>
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
                  <Icon as={<MaterialIcons name="visibility" />} size={6} mr={1} />
                  <Text>Add Observer</Text>
                </Flex>
              </Button>
            </HStack>

            <HStack space={2}>
              <IconButton
                size="lg"
                borderRadius="full"
                icon={<Icon as={<MaterialIcons name="keyboard-control" />} color="black" />}
              />

              <IconButton
                size="lg"
                borderRadius="full"
                icon={<Icon as={<MaterialIcons name="chevron-right" />} color="black" />}
                onPress={onClick}
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
          <FormControl>
            <FormControl.Label>LABELS</FormControl.Label>
            <IconButton
              size="md"
              borderRadius="full"
              icon={<Icon as={<MaterialIcons name="add" />} color="black" />}
              alignSelf="flex-start"
            />
          </FormControl>

          {/* Due date and cost */}
          <Flex flexDir="column" justifyContent="space-between" gap={5}>
            <FormControl>
              <FormControl.Label>DUE DATE</FormControl.Label>
              <CustomDateTimePicker defaultValue={selectedTask?.deadline} disabled={inputIsDisabled} />
            </FormControl>

            <FormControl>
              <FormControl.Label>COST</FormControl.Label>
              <Input
                style={{ height: 40 }}
                variant="unstyled"
                borderWidth={1}
                borderRadius={15}
                placeholder="Task's cost"
                editable={false}
              />
            </FormControl>
          </Flex>

          {/* Description */}
          <FormControl>
            <FormControl.Label>DESCRIPTION</FormControl.Label>
            <Text>{selectedTask?.description}</Text>
          </FormControl>

          {/* Checklists */}
          <FormControl>
            <FormControl.Label>CHECKLIST ({selectedTask?.checklist_finish_percent})</FormControl.Label>
            <Slider
              defaultValue={(selectedTask?.total_checklist / selectedTask?.total_checklist_finish) * 100}
              size="sm"
              colorScheme="blue"
              w="100%"
            >
              <Slider.Track bg="blue.100">
                <Slider.FilledTrack bg="blue.600" />
              </Slider.Track>
              <Slider.Thumb borderWidth="0" bg="transparent" display="none"></Slider.Thumb>
            </Slider>

            <TouchableOpacity>
              <Flex flexDir="row" alignItems="center" gap={3}>
                <Icon as={<MaterialIcons name="add" />} color="blue.600" size="md" />
                <Text color="blue.600">Add checklist item</Text>
              </Flex>
            </TouchableOpacity>
          </FormControl>

          {/* Attachments */}
          <Flex gap={2}>
            <FormControl>
              <FormControl.Label>ATTACHMENTS</FormControl.Label>
              <ScrollView style={{ maxHeight: 200 }}>
                <Box flex={1} minHeight={2}>
                  <FlashList
                    data={attachments?.data}
                    keyExtractor={(item) => item?.id}
                    onEndReachedThreshold={0.1}
                    estimatedItemSize={200}
                    renderItem={({ item }) => (
                      <AttachmentList
                        title={item?.file_name}
                        size={item?.file_size}
                        time={item?.uploaded_at}
                        type={item?.mime_type}
                      />
                    )}
                  />
                </Box>
              </ScrollView>
            </FormControl>

            <TouchableOpacity>
              <Flex flexDir="row" alignItems="center" gap={3}>
                <Icon as={<MaterialIcons name="add" />} color="blue.600" size="md" />
                <Text color="blue.600">Add attachment</Text>
              </Flex>
            </TouchableOpacity>
          </Flex>

          {/* Comments */}
          <FormControl>
            <FormControl.Label>COMMENTS</FormControl.Label>
            <Box borderWidth={1} borderRadius={10} borderColor="gray.300" p={2}>
              <Input variant="unstyled" placeholder="Add comment..." multiline h={20} />

              <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                <Button>Comment</Button>

                <Flex flexDir="row" alignItems="center" gap={1}>
                  <IconButton
                    size="sm"
                    borderRadius="full"
                    icon={<Icon as={<MaterialIcons name="attach-file" />} color="gray.500" size="lg" />}
                  />
                </Flex>
              </Flex>
            </Box>
          </FormControl>
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TaskDetail;
