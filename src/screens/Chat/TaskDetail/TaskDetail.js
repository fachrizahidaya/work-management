import dayjs from "dayjs";
import { useNavigation, useRoute } from "@react-navigation/core";

import { StyleSheet, SafeAreaView, Text, Pressable, Image, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MateriaCommunitylIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../hooks/useFetch";
import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import Description from "../../../components/Chat/ProjectTask/Description";
import DateSection from "../../../components/Chat/ProjectTask/DateSection";
import CreatorSection from "../../../components/Chat/ProjectTask/CreatorSection";
import ObserverSection from "../../../components/Chat/ProjectTask/ObserverSection";
import ChecklistSection from "../../../components/Chat/ProjectTask/ChecklistSection";
import { TextProps } from "../../../components/shared/CustomStylings";

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
    task?.data?.checklist?.length > 0 ? (filteredData?.length / task.data?.checklist?.length) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#FFFFFF",
          paddingVertical: 14,
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Pressable
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="chevron-left" size={20} color="#3F434A" />
            </Pressable>
            <View>
              <Text style={[{ fontSize: 14, fontWeight: "500" }, TextProps]}>
                {task?.data?.title.length > 20 ? task?.data?.title.slice(0, 20) + "..." : task?.data?.title}
              </Text>
              <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>
                Due {dayjs(task?.data?.deadline).format("DD MMMM YYYY")}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              justifyContent: "flex-end",
            }}
          >
            <Text style={[{ fontSize: 10 }, TextProps]}>Assigned to</Text>
            <AvatarPlaceholder
              name={task?.data?.responsible?.user?.name}
              image={task?.data?.responsible?.user?.image}
            />
            <Text style={[{ fontSize: 10 }, TextProps]}>{task?.data?.responsible?.user?.name?.split(" ")[0]}</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#FAFAFA",
          borderRadius: 10,
          marginVertical: 10,
          marginHorizontal: 16,
        }}
      >
        <Description description={task?.data?.description} navigation={navigation} />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          borderRadius: 10,
          marginVertical: 10,
          marginHorizontal: 16,
          gap: 5,
          backgroundColor: "#FAFAFA",
        }}
      >
        <View style={{ gap: 5 }}>
          <DateSection
            start={dayjs(task?.data?.created_at).format("MMM DD, YYYY")}
            end={dayjs(task?.data?.deadline).format("MMM DD, YYYY")}
          />
          <CreatorSection
            image={task?.data?.responsible?.user?.image}
            name={task?.data?.responsible?.user?.name.split(" ")[0]}
          />
          <View
            style={{
              flex: 1,
              padding: 5,
              backgroundColor: "#FFFFFF",
              borderRadius: 10,
            }}
          >
            <Text style={[{ fontSize: 12 }, TextProps]}>Observed by</Text>
            <FlashList
              data={task?.data?.observer}
              estimatedItemSize={50}
              keyExtractor={(item, index) => index}
              onEndReachedThreshold={0.1}
              renderItem={({ item, index }) => (
                <ObserverSection key={index} name={item?.user?.name.split(" ")[0]} image={item?.user?.image} />
              )}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            padding: 5,
            borderRadius: 10,
            backgroundColor: "#FFFFFF",
          }}
        >
          <Text style={[{ fontSize: 12 }, TextProps]}>
            Checklist ({typeof percentage === "undefined" ? 0 : Math.round(percentage)}
            %)
          </Text>
          {task?.data?.checklist.length === 0 ? (
            <View style={{ alignItems: "center", justifyContent: "center", gap: 5 }}>
              <Image
                source={require("../../../assets/vectors/empty.png")}
                alt="attachment"
                style={{
                  height: 150,
                  width: 180,
                  resizeMode: "cover",
                }}
              />
              <Text style={[{ fontSize: 12 }, TextProps]}>No Task</Text>
            </View>
          ) : (
            <FlashList
              data={task?.data?.checklist}
              estimatedItemSize={100}
              keyExtractor={(item, index) => index}
              onEndReachedThreshold={0.1}
              renderItem={({ item, index }) => (
                <ChecklistSection key={index} title={item?.title} status={item?.status} />
              )}
            />
          )}
        </View>
      </View>

      <Pressable
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFFFF",
          padding: 5,
          marginVertical: 10,
          marginHorizontal: 16,
          gap: 5,
          borderRadius: 10,
        }}
      >
        <View style={{ alignItems: "center", justifyContent: "center", gap: 5 }}>
          <Image
            source={require("../../../assets/vectors/empty.png")}
            alt="attachment"
            style={{
              height: 150,
              width: 180,
              resizeMode: "cover",
            }}
          />
          <View>
            <Text style={[{ fontSize: 12 }, TextProps]}>No Data</Text>
          </View>
        </View>
      </Pressable>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#FFFFFF",
          paddingVertical: 14,
          paddingHorizontal: 16,
        }}
      >
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
          <Text style={{ fontSize: 14, fontWeight: "400", color: "#176688" }}>Import Task</Text>
          <MateriaCommunitylIcons name="checkbox-outline" size={25} color="#176688" />
        </Pressable>
      </View>
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
