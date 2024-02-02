import React, { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";
import { SheetManager } from "react-native-actions-sheet";
import Toast from "react-native-root-toast";

import { Image, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Skeleton } from "moti/skeleton";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import TeamSelection from "../../components/Band/MyTeam/TeamSelection/TeamSelection";
import PageHeader from "../../components/shared/PageHeader";
import { useFetch } from "../../hooks/useFetch";
import MemberListItem from "../../components/Band/MyTeam/MemberListItem/MemberListItem";
import { useDisclosure } from "../../hooks/useDisclosure";
import ConfirmationModal from "../../components/shared/ConfirmationModal";
import TeamForm from "../../components/Band/MyTeam/TeamForm/TeamForm";
import AddMemberModal from "../../components/Band/shared/AddMemberModal/AddMemberModal";
import axiosInstance from "../../config/api";
import useCheckAccess from "../../hooks/useCheckAccess";
import Button from "../../components/shared/Forms/Button";
import {
  ErrorToastProps,
  SkeletonCommonProps,
  SuccessToastProps,
  TextProps,
} from "../../components/shared/CustomStylings";

const MyTeamScreen = ({ route }) => {
  const navigation = useNavigation();
  const { passedTeam } = route.params;
  const userSelector = useSelector((state) => state.auth);
  const [selectedTeamId, setSelectedTeamId] = useState(0);
  const [team, setTeam] = useState({});
  const [memberToRemove, setMemberToRemove] = useState({});
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const { isOpen: newTeamFormIsOpen, toggle: toggleNewTeamForm } = useDisclosure(false);
  const { isOpen: editTeamFormIsOpen, toggle: toggleEditTeamForm } = useDisclosure(false);
  const { isOpen: addMemberModalIsOpen, toggle: toggleAddMemberModal } = useDisclosure(false);
  const { isOpen: removeMemberModalIsOpen, toggle: toggleRemoveMemberModal } = useDisclosure(false);
  const createCheckAccess = useCheckAccess("create", "My Team");
  const editCheckAccess = useCheckAccess("update", "My Team");
  const deleteCheckAccess = useCheckAccess("delete", "My Team");
  const createProjectCheckAccess = useCheckAccess("create", "Projects");

  const openNewTeamFormHandler = () => {
    toggleNewTeamForm();
  };

  const openEditTeamFormHandler = () => {
    toggleEditTeamForm();
  };

  const openMemberModalHandler = () => {
    toggleAddMemberModal();
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
   * @param {Array} users - user ids to add to the team
   */
  const addNewMember = async (users, setIsLoading) => {
    try {
      for (let i = 0; i < users.length; i++) {
        await axiosInstance.post("/pm/teams/members", {
          team_id: selectedTeamId,
          user_id: users[i],
        });
      }
      refetchMembers();
      setIsLoading(false);
      Toast.show("Member added", SuccessToastProps);
      toggleAddMemberModal();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      Toast.show(error.response.data.message, ErrorToastProps);
      toggleAddMemberModal();
    }
  };

  useEffect(() => {
    if (teams?.data?.length > 0) {
      setSelectedTeamId(teams?.data[0]?.id);
      setTeam(teams?.data[0]);
    }
  }, [teamIsLoading]);

  // if user accessed the my team screen from global search
  useEffect(() => {
    if (passedTeam) {
      setSelectedTeamId(passedTeam.id);
      setTeam(passedTeam);
    }
  }, [passedTeam]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ display: "flex", gap: 20 }}>
        <PageHeader backButton={false} title="My Team" />
        {!teamIsLoading ? (
          <>
            {teams?.data?.length > 0 ? (
              <TeamSelection onChange={onPressTeam} selectedTeam={team} teams={teams?.data} />
            ) : (
              createCheckAccess && (
                <View style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <Image
                    style={{ height: 230, width: 300, resizeMode: "contain" }}
                    source={require("../../assets/vectors/team.jpg")}
                    alt="team"
                  />
                  <Text style={[{ fontSize: 22 }, TextProps]}>You don't have teams yet...</Text>
                  <Button onPress={toggleNewTeamForm}>
                    <Text style={{ color: "white" }}>Create here</Text>
                  </Button>
                </View>
              )
            )}
          </>
        ) : (
          <Skeleton width="100%" height={40} radius="round" {...SkeletonCommonProps} />
        )}
      </View>

      <View style={{ flex: 1 }}>
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
            <Skeleton width="100%" height={10} radius="round" {...SkeletonCommonProps} />
          )
        ) : (
          <>
            {teams?.data?.length > 0 && (
              <View style={{ display: "flex", alignItems: "center", position: "relative" }}>
                <Image
                  source={require("../../assets/vectors/member.jpg")}
                  alt="member"
                  style={{ resizeMode: "contain", height: 100, width: 100 }}
                />
                <Text style={[{ fontSize: 22, position: "absolute", bottom: 0 }, TextProps]}>Select team to show</Text>
              </View>
            )}
          </>
        )}
      </View>

      <Pressable
        style={styles.hoverButton}
        onPress={() =>
          SheetManager.show("form-sheet", {
            payload: {
              children: (
                <View style={{ display: "flex", gap: 21, paddingHorizontal: 20, paddingVertical: 16 }}>
                  {createCheckAccess && (
                    <TouchableOpacity
                      onPress={async () => {
                        await SheetManager.hide("form-sheet");
                        openNewTeamFormHandler();
                      }}
                    >
                      <Text style={TextProps}>Create new team</Text>
                    </TouchableOpacity>
                  )}
                  {team && (
                    <>
                      {createProjectCheckAccess && (
                        <TouchableOpacity
                          onPress={async () => {
                            await SheetManager.hide("form-sheet");
                            navigation.navigate("Project Form", { projectData: null, teamMembers: members?.data });
                          }}
                        >
                          <Text style={TextProps}>Create project with this team </Text>
                        </TouchableOpacity>
                      )}

                      {team?.owner_id === userSelector.id && (
                        <>
                          {editCheckAccess && (
                            <>
                              <TouchableOpacity
                                onPress={async () => {
                                  await SheetManager.hide("form-sheet");
                                  openMemberModalHandler();
                                }}
                              >
                                <Text style={TextProps}>Add new member to this team</Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={async () => {
                                  await SheetManager.hide("form-sheet");
                                  openEditTeamFormHandler();
                                }}
                              >
                                <Text style={TextProps}>Edit this team</Text>
                              </TouchableOpacity>
                            </>
                          )}
                          {deleteCheckAccess && (
                            <TouchableOpacity
                              onPress={async () => {
                                await SheetManager.hide("form-sheet");
                                toggleDeleteModal();
                              }}
                            >
                              <Text style={{ color: "red" }}>Delete this team</Text>
                            </TouchableOpacity>
                          )}
                        </>
                      )}
                    </>
                  )}
                </View>
              ),
            },
          })
        }
      >
        <MaterialCommunityIcons name="plus" color="white" size={30} />
      </Pressable>

      {/* New team form */}
      <TeamForm
        isOpen={newTeamFormIsOpen}
        refetch={refetchTeam}
        toggle={toggleNewTeamForm}
        setSelectedTeam={setTeam}
        setSelectedTeamId={setSelectedTeamId}
      />

      {/* Edit team form */}
      <TeamForm
        isOpen={editTeamFormIsOpen}
        teamData={team}
        refetch={refetchTeam}
        toggle={toggleEditTeamForm}
        setSelectedTeam={setTeam}
      />

      {/* Add member modal */}
      <AddMemberModal
        header="New Member"
        isOpen={addMemberModalIsOpen}
        onClose={toggleAddMemberModal}
        onPressHandler={addNewMember}
      />

      {/* Remove member confirmation modal */}
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

      {/* Delete team confirmation modal */}
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
          SheetManager.hide("form-sheet");
        }}
      />
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
  hoverButton: {
    position: "absolute",
    right: 30,
    bottom: 30,
    borderRadius: 50,
    backgroundColor: "#176688",
    padding: 15,
    elevation: 0,
    borderWidth: 3,
    borderColor: "white",
  },
});
