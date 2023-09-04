import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

import { SafeAreaView, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Image,
  Input,
  Menu,
  Pressable,
  Skeleton,
  Text,
} from "native-base";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../hooks/useFetch";
import CustomSelect from "../../../components/shared/CustomSelect";
import Tabs from "../../../components/shared/Tabs";

const ProjectDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { projectId } = route.params;
  const [projectData, setProjectData] = useState({});
  const statuses = ["Open", "On Progress", "Complete"];
  const [value, setValue] = useState(projectData?.status);
  const [openSelect, setOpenSelect] = useState(false);
  const [tabValue, setTabValue] = useState("comments");

  const onChangeTab = (value) => {
    setTabValue(value);
  };

  const tabs = [{ title: "comments" }, { title: "activity" }];

  const { data, isLoading } = useFetch(`/pm/projects/${projectId}`);
  const { data: attachments, isLoading: attachmentLoading } = useFetch(`/pm/projects/${projectId}/attachment`);
  const { data: members, isLoading: memberLoading } = useFetch(`/pm/projects/${projectId}/member`);
  const { data: comments, isLoading: commentLoading } = useFetch(`/pm/projects/${projectId}/comment`);
  const { data: activities, isLoading: activityLoading } = useFetch("/pm/logs/", [], { project_id: projectId });

  useEffect(() => {
    setProjectData(data?.data);
  }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginHorizontal: 16, marginVertical: 13 }}>
        <Flex gap={15}>
          <Flex flexDir="row" alignItems="center" style={{ gap: 6 }}>
            <Pressable onPress={() => navigation.navigate("Project List")}>
              <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
            </Pressable>

            {!isLoading ? <Text fontSize={16}>{projectData?.title}</Text> : <Skeleton h={8} w={200} />}
          </Flex>

          <CustomSelect
            value={projectData?.status !== "Finish" ? projectData?.status : "Complete"}
            open={openSelect}
            setOpen={setOpenSelect}
            startAdornment={
              <Box
                h={4}
                w={4}
                bgColor={value === "Open" ? "#FFD240" : value === "On Progress" ? "#20cce2" : "#49c86c"}
                borderRadius={4}
              ></Box>
            }
          >
            {statuses.map((status) => {
              return (
                <Menu.Item
                  key={status}
                  onPress={() => {
                    setValue(status);
                    setOpenSelect(!openSelect);
                  }}
                >
                  <Flex flexDir="row" gap={2} alignItems="center">
                    <Box
                      h={4}
                      w={4}
                      bgColor={status === "Open" ? "#FFD240" : status === "On Progress" ? "#20cce2" : "#49c86c"}
                      borderRadius={4}
                    ></Box>
                    <Text>{status}</Text>
                  </Flex>
                </Menu.Item>
              );
            })}
          </CustomSelect>

          <Box position="relative">
            <Text>{projectData?.description}</Text>

            <Pressable position="absolute" bottom={0} right={0} bgColor="white" borderRadius="full" p={1}>
              <Icon as={<MaterialCommunityIcons name="pencil-outline" />} color="blue.500" size="sm" />
            </Pressable>
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
            <Button flex={1} variant="outline">
              <Flex flexDir="row" alignItems="center" style={{ gap: 6 }}>
                <Icon as={<MaterialCommunityIcons name="map-outline" />} color="#3F434A" size="md" />
                <Text>Kanban</Text>
              </Flex>
            </Button>
            <Button flex={1} variant="outline">
              <Flex flexDir="row" alignItems="center" style={{ gap: 6 }}>
                <Icon as={<MaterialCommunityIcons name="chart-gantt" />} color="#3F434A" size="md" />
                <Text>Gantt Chart</Text>
              </Flex>
            </Button>
          </Flex>

          <Flex style={{ gap: 18 }}>
            <Flex flexDir="row" justifyContent="space-between" alignItems="center">
              <Text fontSize={16}>FILES</Text>

              <Box bg="#f1f2f3" alignItems="center" justifyContent="center" p={2} borderRadius={10}>
                <Icon as={<MaterialCommunityIcons name="plus" />} color="black" />
              </Box>
            </Flex>

            <ScrollView style={{ maxHeight: 200 }}>
              <Box flex={1} minHeight={2}>
                <FlashList
                  data={attachments?.data}
                  keyExtractor={(item) => item?.id}
                  onEndReachedThreshold={0.1}
                  estimatedItemSize={200}
                  renderItem={({ item }) => (
                    <Flex
                      flexDir="row"
                      justifyContent="space-between"
                      alignItems="center"
                      pr={1.5}
                      style={{ marginBottom: 14 }}
                    >
                      <Flex flexDir="row" alignItems="center" style={{ gap: 21 }}>
                        <Image
                          resizeMode="contain"
                          source={require("../../../assets/icons/google.png")}
                          alt="file_icon"
                          style={{ height: 40, width: 31 }}
                        />
                        <Box>
                          <Text fontSize={12} fontWeight={400}>
                            {item?.file_name.length > 20 ? item?.file_name.slice(0, 20) + "..." : item?.file_name}
                          </Text>
                          <Text fontSize={11} fontWeight={400} color="#8A9099">
                            {item?.file_size}
                          </Text>
                        </Box>
                      </Flex>

                      <Pressable>
                        <Icon as={<MaterialCommunityIcons name="download-outline" />} size="md" />
                      </Pressable>
                    </Flex>
                  )}
                />
              </Box>
            </ScrollView>
          </Flex>

          <Flex style={{ gap: 18 }}>
            <Flex flexDir="row" justifyContent="space-between" alignItems="center">
              <Text fontSize={16}>MEMBERS</Text>

              <Box bg="#f1f2f3" alignItems="center" justifyContent="center" p={2} borderRadius={10}>
                <Icon as={<MaterialCommunityIcons name="plus" />} color="black" />
              </Box>
            </Flex>

            <ScrollView style={{ maxHeight: 200 }}>
              <Box flex={1} minHeight={2}>
                <FlashList
                  data={members?.data}
                  keyExtractor={(item) => item?.id}
                  onEndReachedThreshold={0.1}
                  estimatedItemSize={200}
                  renderItem={({ item }) => (
                    <Flex
                      flexDir="row"
                      alignItems="center"
                      justifyContent="space-between"
                      pr={1.5}
                      style={{ marginBottom: 14 }}
                    >
                      <Flex flexDir="row" alignItems="center" style={{ gap: 14 }}>
                        <Avatar
                          source={{
                            uri: `https://dev.kolabora-app.com/api-dev/image/${item?.member_image}/thumb`,
                          }}
                          size="sm"
                        />
                        <Box>
                          <Text fontSize={12} fontWeight={400}>
                            {item?.member_name}
                          </Text>
                          <Text fontSize={11} fontWeight={400} color="#8A9099">
                            {item?.member_email}
                          </Text>
                        </Box>
                      </Flex>

                      <Pressable>
                        <Icon as={<MaterialCommunityIcons name="close" />} size="md" color="red.500" />
                      </Pressable>
                    </Flex>
                  )}
                />
              </Box>
            </ScrollView>
          </Flex>

          <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />

          {tabValue === "comments" ? (
            <Flex gap={5}>
              <Box borderWidth={1} borderRadius={10} borderColor="gray.300" p={2}>
                <Input variant="unstyled" placeholder="Add comment..." multiline h={20} />

                <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                  <Button>Comment</Button>

                  <Flex flexDir="row" alignItems="center" gap={1}>
                    <IconButton
                      size="sm"
                      borderRadius="full"
                      icon={
                        <Icon
                          as={<MaterialCommunityIcons name="attachment" />}
                          color="gray.500"
                          size="lg"
                          style={{ transform: [{ rotate: "-35deg" }] }}
                        />
                      }
                    />
                  </Flex>
                </Flex>
              </Box>

              {/* Comment list */}
              <ScrollView style={{ maxHeight: 400 }}>
                <Box flex={1} minHeight={2}>
                  <FlashList
                    data={comments?.data}
                    keyExtractor={(item) => item.id}
                    onEndReachedThreshold={0.1}
                    estimatedItemSize={200}
                    renderItem={({ item }) => (
                      <Flex flexDir="row" alignItems="center" gap={1.5} mb={2}>
                        <Avatar
                          size="xs"
                          source={{
                            uri: `https://dev.kolabora-app.com/api-dev/image/${item?.comment_image}/thumb`,
                          }}
                        />

                        <Box>
                          <Flex flexDir="row" gap={1} alignItems="center">
                            <Text>{item?.comment_name}</Text>
                            <Text color="#8A9099">{dayjs(item?.comment_time).fromNow()}</Text>
                          </Flex>

                          <Text>{item?.comments}</Text>
                        </Box>
                      </Flex>
                    )}
                  />
                </Box>
              </ScrollView>
            </Flex>
          ) : (
            <ScrollView style={{ maxHeight: 400 }}>
              <Box flex={1} minHeight={2}>
                <FlashList
                  data={activities?.data}
                  keyExtractor={(item) => item.id}
                  onEndReachedThreshold={0.1}
                  estimatedItemSize={200}
                  renderItem={({ item }) => (
                    <Flex flexDir="row" alignItems="center" gap={1.5} mb={2}>
                      <Avatar
                        size="xs"
                        source={{
                          uri: `https://dev.kolabora-app.com/api-dev/image/${item?.user_image}/thumb`,
                        }}
                      />

                      <Box>
                        <Flex flexDir="row" gap={1} alignItems="center">
                          <Text>{item?.user_name}</Text>
                          <Text color="#8A9099">{dayjs(item?.created_date + item?.create_time).fromNow()}</Text>
                        </Flex>

                        <Flex alignItems="center" gap={1} flexDir="row">
                          <Text>{item?.description}</Text>
                          <Text color="#377893">#{item?.id}</Text>
                        </Flex>
                      </Box>
                    </Flex>
                  )}
                />
              </Box>
            </ScrollView>
          )}
        </Flex>
      </ScrollView>
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
