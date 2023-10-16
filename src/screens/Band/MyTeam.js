import React, { useCallback, useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { SafeAreaView, StyleSheet } from "react-native";
import { Actionsheet, Box, Button, Icon, Image, Pressable, Skeleton, Text, VStack, useToast } from "native-base";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import TeamSelection from "../../components/Band/MyTeam/TeamSelection/TeamSelection";
import PageHeader from "../../components/shared/PageHeader";
import { useFetch } from "../../hooks/useFetch";
import MemberListItem from "../../components/Band/MyTeam/MemberListItem/MemberListItem";
import { useDisclosure } from "../../hooks/useDisclosure";
import ConfirmationModal from "../../components/shared/ConfirmationModal";
import TeamForm from "../../components/Band/MyTeam/TeamForm/TeamForm";
import NewProjectSlider from "../../components/Band/Project/NewProjectSlider/NewProjectSlider";
import AddMemberModal from "../../components/Band/shared/AddMemberModal/AddMemberModal";
import { ErrorToast, SuccessToast } from "../../components/shared/ToastDialog";
import axiosInstance from "../../config/api";

const MyTeamScreen = () => {
  const toast = useToast();
  const userSelector = useSelector((state) => state.auth);
  const [selectedTeamId, setSelectedTeamId] = useState(0);
  const [team, setTeam] = useState({});
  const [memberToRemove, setMemberToRemove] = useState({});
  const { isOpen: menuIsOpen, toggle: toggleMenu } = useDisclosure(false);
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const { isOpen: newTeamFormIsOpen, toggle: toggleNewTeamForm } = useDisclosure(false);
  const { isOpen: editTeamFormIsOpen, toggle: toggleEditTeamForm } = useDisclosure(false);
  const { isOpen: projectFormIsOpen, toggle: toggleProjectForm } = useDisclosure(false);
  const { isOpen: addMemberModalIsOpen, toggle: toggleAddMemberModal } = useDisclosure(false);
  const { isOpen: removeMemberModalIsOpen, toggle: toggleRemoveMemberModal } = useDisclosure(false);

  const openNewTeamFormHandler = () => {
    toggleNewTeamForm();
    toggleMenu();
  };

  const openEditTeamFormHandler = () => {
    toggleEditTeamForm();
    toggleMenu();
  };

  const openProjectFormHandler = () => {
    toggleProjectForm();
    toggleMenu();
  };

  const closeProjectFormHandler = useCallback((resetForm) => {
    toggleProjectForm();
    resetForm();
  }, []);

  const openMemberModalHandler = () => {
    toggleAddMemberModal();
    toggleMenu();
  };

  const openRemoveMemberModalHandler = (member) => {
    setMemberToRemove(member);
    toggleRemoveMemberModal();
  };

  const onPressTeam = useCallback(
    (teamId) => {
      setSelectedTeamId(teamId);
      const selectedTeam = teams?.data?.filter((item) => {
        return item.id === teamId;
      });
      setTeam(selectedTeam[0] || null);
    },
    [selectedTeamId]
  );

  const { data: teams, isLoading: teamIsLoading, refetch: refetchTeam } = useFetch("/pm/teams");

  const {
    data: members,
    isLoading: membersIsLoading,
    refetch: refetchMembers,
  } = useFetch(selectedTeamId && `/pm/teams/${selectedTeamId}/members`, [selectedTeamId]);

  /**
   * Handles add member to team
   * @param {string} userId - user id to add to the team
   */
  const addNewMember = async (userId) => {
    try {
      await axiosInstance.post("/pm/teams/members", {
        team_id: selectedTeamId,
        user_id: userId,
      });

      refetchMembers();
      toast.show({
        render: () => {
          return <SuccessToast message={"Team Saved"} />;
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

  useEffect(() => {
    if (teams?.data?.length > 0) {
      setSelectedTeamId(teams?.data[0]?.id);
      setTeam(teams?.data[0]);
    }
  }, [teamIsLoading]);

  return (
    <SafeAreaView style={styles.container}>
      <VStack space={4}>
        <PageHeader backButton={false} title="My Team" />
        {!teamIsLoading ? (
          <>
            {teams?.data?.length > 0 ? (
              <TeamSelection onChange={onPressTeam} selectedTeamId={selectedTeamId} teams={teams?.data} />
            ) : (
              <VStack space={2} alignItems="center">
                <Image h={230} w={300} source={require("../../assets/vectors/team.jpg")} alt="team" />
                <Text fontSize={22}>You don't have teams yet...</Text>
                <Button>Create here</Button>
              </VStack>
            )}
          </>
        ) : (
          <Skeleton h={41} />
        )}
      </VStack>

      <Box flex={1}>
        {selectedTeamId ? (
          !membersIsLoading ? (
            <FlashList
              data={members?.data}
              keyExtractor={(item) => item.id}
              estimatedItemSize={200}
              renderItem={({ item }) => (
                <MemberListItem
                  member={item}
                  name={item.user_name}
                  image={item.image}
                  email={item.email}
                  totalProjects={item.total_project}
                  totalTasks={item.total_task}
                  master={team?.owner_name}
                  loggedInUser={userSelector.name}
                  openRemoveMemberModal={openRemoveMemberModalHandler}
                />
              )}
            />
          ) : (
            <Skeleton h={10} />
          )
        ) : (
          <VStack alignItems="center" position="relative">
            <Image source={require("../../assets/vectors/member.jpg")} alt="member" resizeMode="contain" size="2xl" />
            <Text fontSize={22} position="absolute" bottom={0}>
              Select team to show
            </Text>
          </VStack>
        )}
      </Box>

      <Pressable
        position="absolute"
        right={5}
        bottom={5}
        rounded="full"
        bgColor="primary.600"
        p={15}
        shadow="0"
        borderRadius="full"
        borderWidth={3}
        borderColor="#FFFFFF"
        onPress={toggleMenu}
      >
        <Icon as={<MaterialCommunityIcons name="plus" />} size="xl" color="white" />
      </Pressable>

      <Actionsheet isOpen={menuIsOpen} onClose={toggleMenu}>
        <Actionsheet.Content>
          <VStack w="95%">
            <Actionsheet.Item onPress={openNewTeamFormHandler}>Create new team</Actionsheet.Item>
            {team && (
              <>
                <Actionsheet.Item onPress={openProjectFormHandler}>Create project with this team</Actionsheet.Item>

                {team?.owner_id === userSelector.id && (
                  <>
                    <Actionsheet.Item onPress={openMemberModalHandler}>Add new member to this team</Actionsheet.Item>
                    <Actionsheet.Item onPress={openEditTeamFormHandler}>Edit this team</Actionsheet.Item>
                    <Actionsheet.Item onPress={toggleDeleteModal}>
                      <Text color="red.500" fontSize={16}>
                        Delete this team
                      </Text>
                    </Actionsheet.Item>
                  </>
                )}
              </>
            )}
          </VStack>
        </Actionsheet.Content>
      </Actionsheet>

      {/* New team form */}
      {newTeamFormIsOpen && (
        <TeamForm
          isOpen={newTeamFormIsOpen}
          refetch={refetchTeam}
          toggle={toggleNewTeamForm}
          setSelectedTeam={setTeam}
          setSelectedTeamId={setSelectedTeamId}
        />
      )}

      {/* Edit team form */}
      {editTeamFormIsOpen && (
        <TeamForm
          isOpen={editTeamFormIsOpen}
          teamData={team}
          refetch={refetchTeam}
          toggle={toggleEditTeamForm}
          setSelectedTeam={setTeam}
        />
      )}

      {/* Create project form */}
      {projectFormIsOpen && (
        <NewProjectSlider isOpen={projectFormIsOpen} onClose={closeProjectFormHandler} teamMembers={members?.data} />
      )}

      {/* Add member modal */}
      {addMemberModalIsOpen && (
        <AddMemberModal isOpen={addMemberModalIsOpen} onClose={toggleAddMemberModal} onPressHandler={addNewMember} />
      )}

      {/* Remove member confirmation modal */}
      {removeMemberModalIsOpen && (
        <ConfirmationModal
          isOpen={removeMemberModalIsOpen}
          toggle={toggleRemoveMemberModal}
          apiUrl={`/pm/teams/members/${memberToRemove?.id}`}
          successMessage="Member removed"
          header="Remove Member"
          description={`Are you sure to remove ${memberToRemove?.user_name} from the team?`}
          hasSuccessFunc={true}
          onSuccess={refetchMembers}
        />
      )}

      {/* Delete team confirmation modal */}
      {deleteModalIsOpen && (
        <ConfirmationModal
          isOpen={deleteModalIsOpen}
          toggle={toggleDeleteModal}
          apiUrl={`/pm/teams/${selectedTeamId}`}
          successMessage="Team deleted"
          header="Delete Team"
          description={`Are you sure to delete team ${team?.name}`}
          hasSuccessFunc={true}
          onSuccess={() => {
            refetchTeam();
            setTeam({});
            setSelectedTeamId(0);
            toggleMenu();
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default MyTeamScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 13,
    position: "relative",
  },
});
