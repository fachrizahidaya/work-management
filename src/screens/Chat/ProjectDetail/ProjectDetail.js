import dayjs from "dayjs";
import { useNavigation, useRoute } from "@react-navigation/core";

import { StyleSheet, SafeAreaView, View, Text, Pressable, Image } from "react-native";
import { FlashList } from "@shopify/flash-list";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MateriaCommunitylIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../hooks/useFetch";
import { TextProps } from "../../../components/shared/CustomStylings";
import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import Description from "../../../components/Chat/ProjectTask/Description";
import DateSection from "../../../components/Chat/ProjectTask/DateSection";
import StatusSection from "../../../components/Chat/ProjectTask/StatusSection";
import MemberSection from "../../../components/Chat/ProjectTask/MemberSection";
import AttachmentSection from "../../../components/Chat/ProjectTask/AttachmentSection";

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
      <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: "#FFFFFF", padding: 15 }}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Pressable
              style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="chevron-left" size={20} color="#3F434A" />
            </Pressable>
            <MateriaCommunitylIcons name="circle-slice-2" size={25} color="#3F434A" />
            <View>
              <Text
                style={[{ fontSize: 14, width: 200, overflow: "hidden" }, TextProps]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {project?.data?.title}
              </Text>
              <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>
                Due {dayjs(project?.data?.deadline).format("DD MMMM YYYY")}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Text style={[{ fontSize: 10 }, TextProps]}>Created by</Text>
            <AvatarPlaceholder name={project?.data?.owner?.name} image={project?.data?.owner?.image} />
            <Text style={[{ fontSize: 10 }, TextProps]}>{project?.data?.owner?.name?.split(" ")[0]}</Text>
          </View>
        </View>
      </View>
      <View style={{ backgroundColor: "#FAFAFA", borderRadius: 10, marginVertical: 10, marginHorizontal: 15 }}>
        <Description description={project?.data?.description} navigation={navigation} />
      </View>
      <View
        style={{ flexDirection: "row", gap: 5, backgroundColor: "#FAFAFA", marginVertical: 10, marginHorizontal: 15 }}
      >
        <DateSection
          start={dayjs(project?.data?.created_at).format("MMM DD, YYYY")}
          end={dayjs(project?.data?.deadline).format("MMM DD, YYYY")}
        />
        <StatusSection
          open={project?.data?.task_open_count}
          onProgress={project?.data?.task_onprogress_count}
          finish={project?.data?.task_finish_count}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#FAFAFA",
          gap: 5,
          borderRadius: 10,
          marginVertical: 10,
          marginHorizontal: 15,
        }}
      >
        <View style={{ flex: 0.5, borderRadius: 10, padding: 10, backgroundColor: "#FFFFFF" }}>
          <FlashList
            data={project?.data?.member}
            estimatedItemSize={50}
            keyExtractor={(item, index) => index}
            onEndReachedThreshold={0.1}
            renderItem={({ item, index }) => (
              <MemberSection key={index} name={item?.user?.name} image={item?.user?.image} />
            )}
          />
        </View>
        <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: 10, padding: 5 }}>
          <AttachmentSection />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "#FAFAFA",
          borderRadius: 10,
          gap: 5,
          marginVertical: 10,
          marginHorizontal: 15,
        }}
      >
        {projectTask?.data.length > 0 ? (
          <FlashList
            data={projectTask?.data}
            estimatedItemSize={100}
            keyExtractor={(item, index) => index}
            onEndReachedThreshold={0.1}
            renderItem={({ item, index }) => (
              <View style={{ gap: 5 }} key={index}>
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
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 10,
                    padding: 10,
                    marginVertical: 5,
                  }}
                >
                  <View>
                    <Text style={[{ fontSize: 14 }, TextProps]}>
                      {item?.title.length > 50 ? item?.title.slice(0, 30) + "..." : item?.title}
                    </Text>
                    <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>
                      Due {dayjs(item?.deadline).format("DD MMMM YYYY")}
                    </Text>
                  </View>
                  <AvatarPlaceholder name={item?.owner?.name} image={item?.owner?.image} size="sm" />
                </Pressable>
              </View>
            )}
          />
        ) : (
          <Pressable
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#FFFFFF",
              borderRadius: 10,
              gap: 5,
              padding: 5,
            }}
          >
            <View style={{ alignItems: "center", justifyContent: "center", gap: 5 }}>
              <Image
                source={require("../../../assets/vectors/empty.png")}
                alt="attachment"
                style={{
                  width: 180,
                  height: 150,
                  resizeMode: "cover",
                }}
              />
              <Text style={[{ fontSize: 12 }, TextProps]}>No Task</Text>
            </View>
          </Pressable>
        )}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: "#FFFFFF", padding: 15 }}>
        <Pressable
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#F5F5F5",
            borderRadius: 5,
            padding: 10,
          }}
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
          <Text style={{ fontSize: 14, fontWeight: "400", color: "#176688" }}>Import Project</Text>
          <MateriaCommunitylIcons name="lightning-bolt" size={25} color="#176688" />
        </Pressable>
      </View>
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
