import dayjs from "dayjs";
import { useNavigation, useRoute } from "@react-navigation/core";

import { Box, Flex, Icon, Image, Pressable, Text } from "native-base";
import { StyleSheet, SafeAreaView } from "react-native";
import { FlashList } from "@shopify/flash-list";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MateriaCommunitylIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../components/shared/AvatarPlaceholder";
import Description from "../../components/Chat/ProjectTask/Description";
import DateSection from "../../components/Chat/ProjectTask/DateSection";
import StatusSection from "../../components/Chat/ProjectTask/StatusSection";
import MemberSection from "../../components/Chat/ProjectTask/MemberSection";
import AttachmentSection from "../../components/Chat/ProjectTask/AttachmentSection";
import { useFetch } from "../../hooks/useFetch";

const ProjectDetail = () => {
  const navigation = useNavigation();
  const routes = useRoute();
  const {
    project_id,
    image,
    projectData,
    name,
    type,
    active_member,
    isPinned,
    email,
    userId,
    roomId,
    position,
    setBandAttachment,
    setBandAttachmentType,
  } = routes.params;
  const {
    data: project,
    isFetching: projectIsFetching,
    refetch: refetchProject,
  } = useFetch(`/chat/project/${project_id}`);
  const {
    data: projectTask,
    isFetching: projectTaskIsFetching,
    refetch: refetchProjectTask,
  } = useFetch(`/chat/task/project/${project_id}`);
  return (
    <SafeAreaView style={styles.container}>
      <Flex direction="row" justifyContent="space-between" bg="white" p={4}>
        <Flex justifyContent="space-between" flex={1} direction="row" alignItems="center">
          <Flex gap={2} flexDirection="row" alignItems="center">
            <Pressable display="flex" flexDirection="row" alignItems="center" onPress={() => navigation.goBack()}>
              <Icon as={<MaterialIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
            </Pressable>
            <Icon as={<MateriaCommunitylIcons name="circle-slice-2" />} size="xl" color="#3F434A" />
            <Flex>
              <Text fontSize={14} fontWeight={400} width={200} numberOfLines={1} overflow="hidden" ellipsizeMode="tail">
                {project?.data?.title}
              </Text>
              <Text opacity={0.5} fontSize={12} fontWeight={300}>
                Due {dayjs(project?.data?.deadline).format("DD MMMM YYYY")}
              </Text>
            </Flex>
          </Flex>
          <Flex gap={2} flexDirection="row" alignItems="center">
            <Text fontSize={10} fontWeight={400}>
              Created by
            </Text>
            <AvatarPlaceholder name={project?.data?.owner?.name} image={project?.data?.owner?.image} />
          </Flex>
        </Flex>
      </Flex>
      <Flex borderRadius={10} mx={3} my={2} bgColor="#fafafa">
        <Description description={project?.data?.description} navigation={navigation} />
      </Flex>
      <Flex gap={3} flexDirection="row" borderRadius={10} mx={3} my={2} bgColor="#fafafa">
        <DateSection
          start={dayjs(project?.data?.created_at).format("MMM DD, YYYY")}
          end={dayjs(project?.data?.deadline).format("MMM DD, YYYY")}
        />
        <StatusSection
          open={project?.data?.task_open_count}
          onProgress={project?.data?.task_onprogress_count}
          finish={project?.data?.task_finish_count}
        />
      </Flex>
      <Flex gap={3} flexDirection="row" borderRadius={10} mx={3} my={2} bgColor="#fafafa">
        <Flex px={2} py={1} borderRadius={10} bgColor="#FFFFFF" flex={0.5}>
          <FlashList
            data={project?.data?.member}
            estimatedItemSize={50}
            keyExtractor={(item, index) => index}
            onEndReachedThreshold={0.1}
            renderItem={({ item, index }) => (
              <MemberSection key={index} name={item?.user?.name} image={item?.user?.image} />
            )}
          />
        </Flex>
        <Flex px={2} py={1} borderRadius={10} bgColor="#FFFFFF" flex={1}>
          <AttachmentSection />
        </Flex>
      </Flex>
      <Flex gap={2} borderRadius={10} mx={3} my={2} flex={1} bgColor="#fafafa">
        {projectTask?.data.length > 0 ? (
          <FlashList
            data={projectTask?.data}
            estimatedItemSize={100}
            keyExtractor={(item, index) => index}
            onEndReachedThreshold={0.1}
            renderItem={({ item, index }) => (
              <Box key={index} gap={2}>
                <Pressable
                  onPress={() =>
                    navigation.navigate("Task Detail Screen", {
                      task_id: item?.id,
                      setBandAttachment: setBandAttachment,
                      setBandAttachmentType: setBandAttachmentType,
                      userId: userId,
                      roomId: roomId,
                      name: name,
                      image: image,
                      position: position,
                      email: email,
                      type: type,
                      active_member: active_member,
                      isPinned: isPinned,
                      taskData: item,
                    })
                  }
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  bgColor="#ffffff"
                  p={5}
                  my={1}
                  borderRadius={10}
                  justifyContent="space-between"
                >
                  <Flex>
                    <Text fontSize={14} fontWeight={400}>
                      {item?.title}
                    </Text>
                    <Text opacity={0.5} fontSize={12} fontWeight={300}>
                      Due {dayjs(item?.deadline).format("DD MMMM YYYY")}
                    </Text>
                  </Flex>
                  <AvatarPlaceholder name={item?.owner?.name} image={item?.owner?.image} size="sm" />
                </Pressable>
              </Box>
            )}
          />
        ) : (
          <Pressable
            display="flex"
            alignItems="center"
            bgColor="#ffffff"
            py={3}
            px={3}
            borderRadius={10}
            justifyContent="center"
            gap={3}
            flex={1}
          >
            <Flex gap={3} justifyContent="center" alignItems="center">
              <Image
                alt="attachment"
                h={150}
                w={180}
                resizeMode="cover"
                source={require("../../assets/vectors/empty.png")}
              />
              <Text>No Task</Text>
            </Flex>
          </Pressable>
        )}
      </Flex>
      <Flex direction="row" justifyContent="space-between" bg="white" p={4}>
        <Pressable
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          flex={1}
          direction="row"
          alignItems="center"
          bgColor="#f5f5f5"
          borderRadius={10}
          p={2}
          onPress={() => {
            setBandAttachment(projectData);
            setBandAttachmentType("project");
            navigation.navigate("Chat Room", {
              userId: userId,
              roomId: roomId,
              name: name,
              image: image,
              position: position,
              email: email,
              type: type,
              active_member: active_member,
              isPinned: isPinned,
            });
          }}
        >
          <Text fontSize={14} fontWeight={400} color="#176688">
            Import Project
          </Text>
          <Icon as={<MateriaCommunitylIcons name="lightning-bolt" />} size="xl" color="#176688" />
        </Pressable>
      </Flex>
    </SafeAreaView>
  );
};

export default ProjectDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
});
