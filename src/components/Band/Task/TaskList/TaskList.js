import React, { memo, useState } from "react";

import { FlatList, View, Text, Image, useWindowDimensions, TouchableOpacity } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { FlashList } from "@shopify/flash-list";

import TaskListItem from "./TaskListItem/TaskListItem";
import TaskSkeleton from "./TaskSkeleton";
import { RefreshControl } from "react-native-gesture-handler";
import { TextProps } from "../../../shared/CustomStylings";

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

  const renderFlashList = (data = []) => {
    return (
      <View style={{ display: "flex", gap: 10, flex: 1, marginHorizontal: 16, marginTop: 10, borderWidth: 1 }}>
        {!isLoading ? (
          data.length > 0 ? (
            <FlashList
              refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
              data={data}
              keyExtractor={(item) => item.id}
              estimatedItemSize={97}
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
              <Text style={TextProps}>No task available</Text>
            </View>
          )
        ) : (
          <TaskSkeleton />
        )}
      </View>
    );
  };

  const Open = () => renderFlashList(todoTasks);

  const OnProgress = () => renderFlashList(onProgressTasks);

  const Finish = () => renderFlashList(finishTasks);

  const renderScene = SceneMap({
    open: Open,
    onProgress: OnProgress,
    finish: Finish,
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "open", title: "Open" },
    { key: "onProgress", title: "On Progress" },
    { key: "finish", title: "Finish" },
  ]);

  const renderTabBar = (props) => (
    <View style={{ display: "flex", flexDirection: "row", backgroundColor: "white" }}>
      {props.navigationState.routes.map((route, i) => (
        <TouchableOpacity
          key={i}
          style={{
            flex: 1,
            height: 48,
            justifyContent: "center",
            alignItems: "center",
            borderBottomWidth: 2,
            borderBottomColor: index === i ? "#176688" : "#E8E9EB",
          }}
          onPress={() => setIndex(i)}
        >
          <Text style={{ color: index === i ? "#176688" : "black" }}>{route.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
};

export default memo(TaskList);
