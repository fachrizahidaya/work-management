import React, { memo, useCallback, useMemo, useState } from "react";

import { FlatList, View, Text, Image } from "react-native";

import TaskListItem from "./TaskListItem/TaskListItem";
import TaskSkeleton from "./TaskSkeleton";
import Tabs from "../../../shared/Tabs";
import { RefreshControl } from "react-native-gesture-handler";

const TaskList = ({ tasks, isLoading, openCloseTaskConfirmation, isFetching, refetch, setSelectedStatus }) => {
  const todoTasks = tasks?.filter((task) => {
    return task.status === "Open";
  });
  const onProgressTasks = tasks?.filter((task) => {
    return task.status === "On Progress";
  });

  const finishTasks = tasks?.filter((task) => {
    return task.status === "Finish" || task.status === "Closed";
  });

  const dataToRender = () => {
    if (tabValue.includes("Open")) {
      return todoTasks;
    } else if (tabValue.includes("On Progress")) {
      return onProgressTasks;
    } else return finishTasks;
  };

  const tabs = useMemo(() => {
    return [
      { title: `Open (${todoTasks?.length || 0})`, value: "Open" },
      { title: `On Progress (${onProgressTasks?.length || 0})`, value: "On Progress" },
      { title: `Finish (${finishTasks?.length || 0})`, value: "Finish" },
    ];
  }, [tasks]);

  const [tabValue, setTabValue] = useState("Open");

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
    setSelectedStatus(value);
  }, []);

  return (
    <View style={{ display: "flex", gap: 10, flex: 1, marginHorizontal: 16, marginTop: 10 }}>
      <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />

      {!isLoading ? (
        dataToRender()?.length > 0 ? (
          <FlatList
            refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
            style={{ flexGrow: 0 }}
            data={dataToRender()}
            keyExtractor={(item) => item.id}
            onEndReachedThreshold={0.1}
            renderItem={({ item }) => (
              <TaskListItem
                id={item.id}
                no={item.task_no}
                task={item}
                title={item.title}
                image={item.responsible_image}
                deadline={item.deadline}
                priority={item.priority}
                totalAttachments={item.total_attachment}
                totalChecklists={item.total_checklist}
                totalChecklistsDone={item.total_checklist_finish}
                totalComments={item.total_comment}
                status={item.status}
                responsible={item.responsible_name}
                responsibleId={item.responsible_id}
                openCloseTaskConfirmation={openCloseTaskConfirmation}
              />
            )}
          />
        ) : (
          <View style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
            <Image
              alt="empty"
              style={{ resizeMode: "contain", height: 200, width: 200 }}
              source={require("../../../../assets/vectors/empty.png")}
            />
            <Text>No task available</Text>
          </View>
        )
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default memo(TaskList);
