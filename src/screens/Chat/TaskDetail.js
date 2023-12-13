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
import CreatorSection from "./CreatorSection";
import ObserverSection from "./ObserverSection";
import ChecklistSection from "./ChecklistSection";
import { useFetch } from "../../hooks/useFetch";

const TaskDetail = () => {
  const navigation = useNavigation();
  const routes = useRoute();
  const {
    task_id,
    setBandAttachment,
    setBandAttachmentType,
    userId,
    roomId,
    name,
    image,
    position,
    email,
    type,
    active_member,
    isPinned,
    taskData,
  } = routes.params;
  const { data: task, isFetching: taskIsFetching, refetch: refetchTask } = useFetch(`/chat/task/${task_id}`);
  const filteredData = task?.data?.checklist.filter((item) => item.status === "Finish");
  const percentage =
    task?.data?.checklist?.length !== 0 ? (filteredData?.length / task.data?.checklist?.length) * 100 : 0;
  return (
    <SafeAreaView style={styles.container}>
      <Flex direction="row" justifyContent="space-between" bg="white" p={4}>
        <Flex justifyContent="space-between" flex={1} direction="row" alignItems="center">
          <Flex gap={2} flexDirection="row" alignItems="center">
            <Pressable display="flex" flexDirection="row" alignItems="center" onPress={() => navigation.goBack()}>
              <Icon as={<MaterialIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
            </Pressable>
            <Flex>
              <Text fontSize={14} fontWeight={400}>
                {task?.data?.title}
              </Text>
              <Text opacity={0.5} fontSize={12} fontWeight={300}>
                Due {dayjs(task?.data?.deadline).format("DD MMMM YYYY")}
              </Text>
            </Flex>
          </Flex>
          <Flex gap={2} flexDirection="row" alignItems="center">
            <Text fontSize={10} fontWeight={400}>
              Assigned to
            </Text>
            <AvatarPlaceholder
              name={task?.data?.responsible?.user?.name}
              image={task?.data?.responsible?.user?.image}
            />
          </Flex>
        </Flex>
      </Flex>
      <Flex borderRadius={10} mx={3} my={2} bgColor="#fafafa">
        <Description description={task?.data?.description} navigation={navigation} />
      </Flex>
      <Flex flex={1} gap={3} flexDirection="row" borderRadius={10} mx={3} my={2} bgColor="#fafafa">
        <Flex gap={2}>
          <DateSection
            start={dayjs(task?.data?.created_at).format("MMM DD, YYYY")}
            end={dayjs(task?.data?.deadline).format("MMM DD, YYYY")}
          />
          <CreatorSection
            image={task?.data?.responsible?.user?.image}
            name={task?.data?.responsible?.user?.name.split(" ")[0]}
          />
          <Flex px={2} py={1} borderRadius={10} flex={1} bgColor="#FFFFFF">
            <Text fontSize={12} fontWeight={400}>
              Observed by
            </Text>
            <FlashList
              data={task?.data?.observer}
              estimatedItemSize={50}
              keyExtractor={(item, index) => index}
              onEndReachedThreshold={0.1}
              renderItem={({ item, index }) => (
                <ObserverSection key={index} name={item?.user?.name.split(" ")[0]} image={item?.user?.image} />
              )}
            />
          </Flex>
        </Flex>
        <Flex px={2} py={1} borderRadius={10} flex={1} bgColor="#FFFFFF">
          <Text fontSize={12} fontWeight={400}>
            Checklist ({typeof percentage === "undefined" ? 0 : Math.round(percentage)}
            %)
          </Text>
          {task?.data?.checklist.length === 0 ? (
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
          ) : (
            <FlashList
              data={task?.data?.checklist}
              estimatedItemSize={100}
              keyExtractor={(item, index) => index}
              onEndReachedThreshold={0.1}
              renderItem={({ item, index }) => (
                <ChecklistSection key={index} title={item?.title} id={item?.id} status={item?.status} />
              )}
            />
          )}
        </Flex>
      </Flex>

      <Pressable
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgColor="#ffffff"
        py={3}
        px={3}
        mx={3}
        my={2}
        borderRadius={10}
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
          <Box>
            <Text>No Data</Text>
          </Box>
        </Flex>
      </Pressable>
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
            setBandAttachment(taskData);
            setBandAttachmentType("task");
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
            Import Task
          </Text>
          <Icon as={<MateriaCommunitylIcons name="checkbox-outline" />} size="xl" color="#176688" />
        </Pressable>
      </Flex>
    </SafeAreaView>
  );
};

export default TaskDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
});
