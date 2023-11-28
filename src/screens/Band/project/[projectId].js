import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";
import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dimensions, Platform, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Box, Button, Flex, Icon, Menu, Pressable, Text, useToast } from "native-base";
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
import useCheckAccess from "../../../hooks/useCheckAccess";
import Description from "../../../components/Band/Project/ProjectDetail/Description";

const ProjectDetailScreen = ({ route }) => {
  const toast = useToast();
  const userSelector = useSelector((state) => state.auth);
  const { width } = Dimensions.get("screen");
  const navigation = useNavigation();
  const { projectId } = route.params;
  const [tabValue, setTabValue] = useState("comments");
  const [openEditForm, setOpenEditForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { isOpen: deleteModalIsOpen, toggle } = useDisclosure(false);
  const { isOpen: userModalIsOpen, toggle: toggleUserModal } = useDisclosure(false);
  const { isOpen: confirmationModalIsOpen, toggle: toggleConfirmationModal } = useDisclosure(false);
  const deleteCheckAccess = useCheckAccess("delete", "Projects");
  const editCheckAccess = useCheckAccess("update", "Projects");

  const tabs = useMemo(() => {
    return [{ title: "comments" }, { title: "activity" }];
  }, []);

  const { data: projectData, isLoading, refetch } = useFetch(`/pm/projects/${projectId}`);
  const { data: activities } = useFetch("/pm/logs/", [], { project_id: projectId });
  const { data: members, refetch: refetchMember } = useFetch(`/pm/projects/${projectId}/member`);

  const isAllowed = projectData?.data?.owner_id === userSelector.id;

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
              title={projectData?.data?.title}
              withLoading
              isLoading={isLoading}
              width={width / 1.3}
              onPress={() => navigation.navigate("Projects")}
            />

            {isAllowed && (
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
                {editCheckAccess && <Menu.Item onPress={openEditFormHandler}>Edit</Menu.Item>}
                {deleteCheckAccess && (
                  <Menu.Item onPress={toggle}>
                    <Text color="red.600">Delete</Text>
                  </Menu.Item>
                )}
              </Menu>
            )}

            {/* Delete confirmation modal */}
            {deleteModalIsOpen && (
              <ConfirmationModal
                isOpen={deleteModalIsOpen}
                toggle={toggle}
                apiUrl={`/pm/projects/${projectId}`}
                color="red.600"
                successMessage="Project deleted"
                hasSuccessFunc={true}
                onSuccess={() => navigation.navigate("Projects")}
                header="Delete Project"
                description="Are you sure to delete this project?"
              />
            )}

            {userModalIsOpen && (
              <AddMemberModal
                header="New Project Owner"
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

          <Flex flexDir="row" style={{ gap: 8 }}>
            <StatusSection projectId={projectId} projectData={projectData?.data} refetch={refetch} />

            <Button
              variant="outline"
              onPress={() => navigation.navigate("Project Task", { projectId: projectId, view: "Task List" })}
            >
              <Flex flexDir="row" alignItems="center" style={{ gap: 6 }}>
                <Icon as={<MaterialCommunityIcons name="format-list-bulleted" />} color="#3F434A" size="md" />
                <Text>Task List</Text>
              </Flex>
            </Button>
          </Flex>

          <Description description={projectData?.data?.description} />

          <FileSection projectId={projectId} isAllowed={isAllowed} />

          <MemberSection
            projectId={projectId}
            projectData={projectData?.data}
            members={members}
            refetchMember={refetchMember}
            isAllowed={isAllowed}
          />

          <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />

          {tabValue === "comments" ? (
            <CommentInput projectId={projectId} data={projectData?.data} />
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
                        <AvatarPlaceholder name={item.user_name} image={item.user_image} style={{ marginTop: 4 }} />

                        <Box>
                          <Flex flexDir="row" gap={1} alignItems="center">
                            <Text>{item?.user_name.split(" ")[0]}</Text>
                            <Text color="#8A9099">{dayjs(item?.created_at).fromNow()}</Text>
                          </Flex>

                          <Flex>
                            <Text fontWeight={400}>{item?.description}</Text>

                            <Text fontWeight={400} width={300} numberOfLines={2}>
                              {item.object_title}
                              <Text color="#377893" fontWeight={500}>
                                {" "}
                                #{item.reference_no}
                              </Text>
                            </Text>
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
          projectData={projectData?.data}
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
