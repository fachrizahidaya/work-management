import dayjs from "dayjs";
import { useNavigation, useRoute } from "@react-navigation/core";

import { StyleSheet, SafeAreaView, View } from "react-native";

import { useFetch } from "../../../hooks/useFetch";
import Description from "../../../components/Chat/ProjectTask/Description";
import DateSection from "../../../components/Chat/ProjectTask/DateSection";
import StatusSection from "../../../components/Chat/ProjectTask/StatusSection";
import AttachmentSection from "../../../components/Chat/ProjectTask/AttachmentSection";
import Header from "../../../components/Chat/ProjectTask/Header";
import MemberSection from "../../../components/Chat/ProjectTask/MemberSection";
import ProjectList from "../../../components/Chat/ProjectTask/ProjectList";
import AttachButton from "../../../components/Chat/ProjectTask/AttachButton";

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

  const { data: project } = useFetch(`/chat/project/${project_id}`);
  const { data: projectTask } = useFetch(`/chat/task/project/${project_id}`);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        navigation={navigation}
        title={project?.data?.title}
        deadline={project?.data?.deadline}
        owner_name={project?.data?.owner?.name}
        owner_image={project?.data?.owner?.image}
        type="project"
      />

      <View
        style={{
          backgroundColor: "#FAFAFA",
          borderRadius: 10,
          marginVertical: 10,
          marginHorizontal: 16,
        }}
      >
        <Description description={project?.data?.description} navigation={navigation} />
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 5,
          backgroundColor: "#FAFAFA",
          borderRadius: 10,
          marginVertical: 10,
          marginHorizontal: 16,
        }}
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
          marginHorizontal: 16,
        }}
      >
        <MemberSection member={project?.data?.member} />
        <AttachmentSection />
      </View>

      <ProjectList
        data={projectTask?.data}
        navigation={navigation}
        isPinned={isPinned}
        active_member={active_member}
        type={type}
        email={email}
        position={position}
        image={image}
        name={name}
        userId={userId}
        roomId={roomId}
        setBandAttachment={setBandAttachment}
        setBandAttachmentType={setBandAttachmentType}
      />

      <AttachButton
        navigation={navigation}
        setBandAttachment={setBandAttachment}
        setBandAttachmentType={setBandAttachmentType}
        userId={userId}
        roomId={roomId}
        name={name}
        image={image}
        position={position}
        email={email}
        type={type}
        active_member={active_member}
        isPinned={isPinned}
        data={projectData}
        dataType="project"
      />
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
