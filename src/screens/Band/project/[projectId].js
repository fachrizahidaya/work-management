import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";
import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dimensions, Platform, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Box, Button, Flex, HStack, Icon, Menu, Pressable, Text, useToast } from "native-base";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../hooks/useFetch";
import Tabs from "../../../components/shared/Tabs";
import ProjectForm from "../../../components/Band/Project/NewProjectSlider/NewProjectSlider";
import ConfirmationModal from "../../../components/shared/ConfirmationModal";
import MemberSection from "../../../components/Band/Project/ProjectDetail/MemberSection";
import StatusSection from "../../../components/Band/Project/ProjectDetail/StatusSection";
import FileSection from "../../../components/Band/Project/ProjectDetail/FileSection";
import CommentInput from "../../../components/Band/shared/CommentInput/CommentInput";
import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import { useDisclosure } from "../../../hooks/useDisclosure";
import PageHeader from "../../../components/shared/PageHeader";
import AddMemberModal from "../../../components/Band/shared/AddMemberModal/AddMemberModal";
import axiosInstance from "../../../config/api";
import { ErrorToast } from "../../../components/shared/ToastDialog";

const ProjectDetailScreen = ({ route }) => {
  const toast = useToast();
  const userSelector = useSelector((state) => state.auth);
  const { width } = Dimensions.get("screen");
  const navigation = useNavigation();
  const { projectId } = route.params;
  const [projectData, setProjectData] = useState({});
  const [tabValue, setTabValue] = useState("comments");
  const [openEditForm, setOpenEditForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { isOpen: deleteModalIsOpen, toggle } = useDisclosure(false);
  const { isOpen: userModalIsOpen, toggle: toggleUserModal } = useDisclosure(false);
  const { isOpen: confirmationModalIsOpen, toggle: toggleConfirmationModal } = useDisclosure(false);

  const tabs = useMemo(() => {
    return [{ title: "comments" }, { title: "activity" }];
  }, []);

  const { data, isLoading, refetch } = useFetch(`/pm/projects/${projectId}`);
  const { data: activities } = useFetch("/pm/logs/", [], { project_id: projectId });
  const { data: members, refetch: refetchMember } = useFetch(`/pm/projects/${projectId}/member`);

  const onDelegateSuccess = async () => {
    try {
      await axiosInstance.post("/pm/projects/member", {
        project_id: projectId,
        user_id: selectedUserId,
      });
      closeUserModal();
      refetch();
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

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
  }, []);

  const openEditFormHandler = () => {
    setOpenEditForm(true);
  };

  const onCloseEditForm = () => {
    setOpenEditForm(false);
  };

  const onPressUserToDelegate = (userId) => {
    toggleConfirmationModal();
    setSelectedUserId(userId);
  };

  const closeUserModal = () => {
    toggleUserModal();
    setSelectedUserId(null);
  };

  useEffect(() => {
    setProjectData(data?.data);
  }, [data]);

  useEffect(() => {
    return () => {
      setTabValue("comments");
    };
  }, [projectId]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        extraHeight={200}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === "ios"}
      >
        <Flex gap={15} marginHorizontal={16} marginVertical={13}>
          <Flex flexDir="row" alignItems="center" justifyContent="space-between">
            <PageHeader
              title={projectData?.title}
              withLoading
              isLoading={isLoading}
              width={width / 1.3}
              onPress={() => navigation.navigate("Project List")}
            />

            {projectData?.owner_id === userSelector.id && (
              <Menu
                trigger={(triggerProps) => {
                  return (
                    <Pressable {...triggerProps} mr={1}>
                      <Icon as={<MaterialCommunityIcons name="dots-vertical" />} color="black" size="md" />
                    </Pressable>
                  );
                }}
              >
                <Menu.Item onPress={toggleUserModal}>Change Ownership</Menu.Item>
                <Menu.Item onPress={openEditFormHandler}>Edit</Menu.Item>
                <Menu.Item onPress={toggle}>
                  <Text color="red.600">Delete</Text>
                </Menu.Item>
              </Menu>
            )}

            {/* Delete confirmation modal */}
            {deleteModalIsOpen && (
              <ConfirmationModal
                isOpen={deleteModalIsOpen}
                toggle={toggle}
                apiUrl={`/pm/projects/${projectId}`}
                color="red.600"
                successMessage={`${projectData?.title} deleted`}
                hasSuccessFunc={true}
                onSuccess={() => navigation.navigate("Project List")}
                header="Delete Project"
                description="Are you sure to delete this project?"
              />
            )}

            {userModalIsOpen && (
              <AddMemberModal
                isOpen={userModalIsOpen}
                onClose={closeUserModal}
                multiSelect={false}
                onPressHandler={onPressUserToDelegate}
              />
            )}

            {confirmationModalIsOpen && (
              <ConfirmationModal
                isDelete={false}
                isOpen={confirmationModalIsOpen}
                toggle={toggleConfirmationModal}
                apiUrl={"/pm/projects/delegate"}
                body={{ id: projectId, user_id: selectedUserId }}
                header="Change Project Ownership"
                description="Are you sure to change ownership of this project?"
                successMessage="Project ownership changed"
                hasSuccessFunc
                onSuccess={onDelegateSuccess}
              />
            )}
          </Flex>

          <StatusSection projectId={projectId} projectData={projectData} refetch={refetch} />

          <Box>
            <Text>{projectData?.description}</Text>
          </Box>

          <Flex flexDir="row" style={{ gap: 8 }}>
            <Button
              flex={1}
              variant="outline"
              onPress={() => navigation.navigate("Project Task", { projectId: projectId })}
            >
              <Flex flexDir="row" alignItems="center" style={{ gap: 6 }}>
                <Icon as={<MaterialCommunityIcons name="format-list-bulleted" />} color="#3F434A" size="md" />
                <Text>Task List</Text>
              </Flex>
            </Button>
            <Button
              flex={1}
              variant="outline"
              onPress={() => navigation.navigate("Project Task", { projectId: projectId })}
            >
              <Flex flexDir="row" alignItems="center" style={{ gap: 6 }}>
                <Icon as={<MaterialCommunityIcons name="map-outline" />} color="#3F434A" size="md" />
                <Text>Kanban</Text>
              </Flex>
            </Button>
            <Button
              flex={1}
              variant="outline"
              onPress={() => navigation.navigate("Project Task", { projectId: projectId })}
            >
              <Flex flexDir="row" alignItems="center" style={{ gap: 6 }}>
                <Icon as={<MaterialCommunityIcons name="chart-gantt" />} color="#3F434A" size="md" />
                <Text>Gantt</Text>
              </Flex>
            </Button>
          </Flex>

          <FileSection projectId={projectId} projectData={projectData} />

          <MemberSection
            projectId={projectId}
            projectData={projectData}
            members={members}
            refetchMember={refetchMember}
          />

          <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />

          {tabValue === "comments" ? (
            <CommentInput projectId={projectId} />
          ) : (
            <ScrollView style={{ maxHeight: 400 }}>
              <Box flex={1} minHeight={2}>
                <FlashList
                  data={activities?.data}
                  keyExtractor={(item) => item.id}
                  onEndReachedThreshold={0.1}
                  estimatedItemSize={200}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        if (item.modul === "Task") {
                          navigation.navigate("Task Detail", {
                            taskId: item.reference_id,
                          });
                        } else if (item.modul === "Project") {
                          navigation.navigate("Project Detail", {
                            projectId: item.reference_id,
                          });
                        }
                      }}
                    >
                      <Flex flexDir="row" gap={1.5} mb={2}>
                        <AvatarPlaceholder name={item.user_name} image={item.user_image} />

                        <Box>
                          <Flex flexDir="row" gap={1} alignItems="center">
                            <Text>{item?.user_name.split(" ")[0]}</Text>
                            <Text color="#8A9099">{dayjs(item?.created_at).fromNow()}</Text>
                          </Flex>

                          <Flex>
                            <Text fontWeight={400}>{item?.description}</Text>

                            <HStack space={1}>
                              <Text fontWeight={400}>{item.object_title}</Text>
                              <Text color="#377893">#{item.reference_id}</Text>
                            </HStack>
                          </Flex>
                        </Box>
                      </Flex>
                    </TouchableOpacity>
                  )}
                />
              </Box>
            </ScrollView>
          )}
        </Flex>
      </KeyboardAwareScrollView>

      {openEditForm && (
        <ProjectForm
          isOpen={openEditForm}
          projectData={projectData}
          refetchSelectedProject={refetch}
          onClose={onCloseEditForm}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default ProjectDetailScreen;
