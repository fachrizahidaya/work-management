import React, { useState } from "react";

import { SafeAreaView, StyleSheet } from "react-native";
import { Actionsheet, Box, Button, Icon, Image, Pressable, Skeleton, Text, VStack } from "native-base";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import TeamSelection from "../../components/Band/MyTeam/TeamSelection/TeamSelection";
import PageHeader from "../../components/shared/PageHeader";
import { useFetch } from "../../hooks/useFetch";
import MemberListItem from "../../components/Band/MyTeam/MemberListItem/MemberListItem";
import { useDisclosure } from "../../hooks/useDisclosure";

const MyTeamScreen = () => {
  const [selectedTeamId, setSelectedTeamId] = useState(0);
  const { isOpen: menuIsOpen, toggle: toggleMenu } = useDisclosure(false);

  const {
    data: teams,
    isLoading: teamIsLoading,
    isFetching: teamIsFetching,
    refetch: refetchTeam,
  } = useFetch("/pm/teams");

  const {
    data: members,
    isLoading: membersIsLoading,
    isFetching: membersIsFetching,
    refetch: refetchMembers,
  } = useFetch(selectedTeamId && `/pm/teams/${selectedTeamId}/members`);

  return (
    <SafeAreaView style={styles.container}>
      <VStack space={4}>
        <PageHeader backButton={false} title="My Team" />
        {!teamIsLoading ? (
          <>
            {teams?.data?.length > 0 ? (
              <TeamSelection onChange={setSelectedTeamId} selectedTeamId={selectedTeamId} teams={teams?.data} />
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
      {members?.data?.length > 0 ? (
        <Box h="100%" pt={21} pb={61} position="relative">
          {!membersIsLoading ? (
            <FlashList
              data={members?.data}
              keyExtractor={(item) => item.id}
              estimatedItemSize={200}
              renderItem={({ item }) => (
                <MemberListItem
                  id={item.id}
                  name={item.user_name}
                  image={item.image}
                  email={item.email}
                  totalProjects={item.total_project}
                  totalTasks={item.total_task}
                />
              )}
            />
          ) : (
            <Skeleton h={200} />
          )}

          {members?.data?.length > 0 && (
            <Pressable
              position="absolute"
              bottom={81}
              right={5}
              rounded="full"
              bgColor="primary.600"
              p={15}
              onPress={toggleMenu}
            >
              <Icon as={<MaterialCommunityIcons name="plus" />} size="xl" color="white" />
            </Pressable>
          )}
        </Box>
      ) : (
        <VStack alignItems="center" position="relative">
          <Image source={require("../../assets/vectors/member.jpg")} alt="member" resizeMode="contain" size="2xl" />
          <Text fontSize={22} position="absolute" bottom={0}>
            Select team to show
          </Text>
        </VStack>
      )}

      <Actionsheet isOpen={menuIsOpen} onClose={toggleMenu}>
        <Actionsheet.Content>
          <VStack w="95%">
            <Actionsheet.Item>Create project with this team</Actionsheet.Item>
            <Actionsheet.Item>Add new member to this team</Actionsheet.Item>
            <Actionsheet.Item>Create new team</Actionsheet.Item>
            <Actionsheet.Item>Edit this team</Actionsheet.Item>
            <Actionsheet.Item>
              <Text color="red.500" fontSize={16}>
                Delete this team
              </Text>
            </Actionsheet.Item>
          </VStack>
        </Actionsheet.Content>
      </Actionsheet>
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
  },
});
