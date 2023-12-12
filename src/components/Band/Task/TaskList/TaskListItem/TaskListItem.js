import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { Flex, Pressable } from "native-base";
import { StyleSheet } from "react-native";

import StatusAndDeadlineSection from "./StatusAndDeadlineSection/StatusAndDeadlineSection";
import PrioritySection from "./PrioritySection/PrioritySection";
import AdditionAndResponsibleSection from "./AddtionAndResponsibleSection/AdditionAndResponsibleSection";

const TaskListItem = ({
  id,
  no,
  task,
  title,
  priority,
  deadline,
  image,
  totalAttachments,
  totalChecklists,
  totalChecklistsDone,
  totalComments,
  status,
  responsible,
  responsibleId,
  openCloseTaskConfirmation,
}) => {
  const navigation = useNavigation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 150);
  }, []);

  return (
    <Pressable style={styles.wrapper} onPress={() => navigation.navigate("Task Detail", { taskId: id })}>
      <Flex gap={2}>
        {isReady && (
          <StatusAndDeadlineSection
            no={no}
            task={task}
            title={title}
            deadline={deadline}
            status={status}
            responsibleId={responsibleId}
            openCloseTaskConfirmation={openCloseTaskConfirmation}
          />
        )}

        <PrioritySection priority={priority} />

        {isReady && (
          <AdditionAndResponsibleSection
            image={image}
            totalAttachments={totalAttachments}
            totalChecklists={totalChecklists}
            totalChecklistsDone={totalChecklistsDone}
            totalComments={totalComments}
            responsible={responsible}
          />
        )}
      </Flex>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "white",
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: "rgba(0, 0, 0, 1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    marginTop: 4,
    marginBottom: 4,
    marginHorizontal: 2,
    borderRadius: 15,
  },
});

export default TaskListItem;
