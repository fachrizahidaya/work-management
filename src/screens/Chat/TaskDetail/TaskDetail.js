import dayjs from "dayjs";
import { useNavigation, useRoute } from "@react-navigation/core";

import { StyleSheet, SafeAreaView, View } from "react-native";

import { useFetch } from "../../../hooks/useFetch";
import Description from "../../../components/Chat/ProjectTask/Description";
import DateSection from "../../../components/Chat/ProjectTask/DateSection";
import CreatorSection from "../../../components/Chat/ProjectTask/CreatorSection";
import Header from "../../../components/Chat/ProjectTask/Header";
import AttachButton from "../../../components/Chat/ProjectTask/AttachButton";
import TaskAttachmentSection from "../../../components/Chat/ProjectTask/TaskAttachmentSection";
import ObserverSection from "../../../components/Chat/ProjectTask/ObserverSection";
import ChecklistSection from "../../../components/Chat/ProjectTask/ChecklistSection";

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

  const { data: task } = useFetch(`/chat/task/${task_id}`);

  const filteredData = task?.data?.checklist.filter((item) => item.status === "Finish");
  const percentage =
    task?.data?.checklist?.length > 0 ? (filteredData?.length / task.data?.checklist?.length) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        navigation={navigation}
        project={task}
        title={task?.data?.title}
        deadline={task?.data?.deadline}
        owner_name={task?.data?.responsible?.user?.name}
        owner_image={task?.data?.responsible?.user?.image}
        type="task"
      />

      <View style={styles.wrapper}>
        <Description description={task?.data?.description} navigation={navigation} />
      </View>

      <View style={[styles.wrapper, { flex: 1, flexDirection: "row", gap: 5 }]}>
        <View style={{ gap: 5 }}>
          <DateSection
            start={dayjs(task?.data?.created_at).format("MMM DD, YYYY")}
            end={dayjs(task?.data?.deadline).format("MMM DD, YYYY")}
          />
          <CreatorSection
            image={task?.data?.responsible?.user?.image}
            name={task?.data?.responsible?.user?.name.split(" ")[0]}
          />
          <ObserverSection observer={task?.data?.observer} />
        </View>
        <ChecklistSection percentage={percentage} checklist={task?.data?.checklist} />
      </View>

      <TaskAttachmentSection />

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
        data={taskData}
        dataType="task"
      />
    </SafeAreaView>
  );
};

export default TaskDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  wrapper: {
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 16,
  },
});
