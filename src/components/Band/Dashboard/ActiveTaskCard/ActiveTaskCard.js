import React, { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { View, Text, Image } from "react-native";
import { Skeleton } from "moti/skeleton";
import { FlashList } from "@shopify/flash-list";

import ActiveTaskList from "./ActiveTaskList";
import { card } from "../../../../styles/Card";
import { useFetch } from "../../../../hooks/useFetch";
import ConfirmationModal from "../../../shared/ConfirmationModal";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import Button from "../../../shared/Forms/Button";
import { SkeletonCommonProps, TextProps } from "../../../shared/CustomStylings";

const ActiveTaskCard = () => {
  const navigation = useNavigation();
  const [status, setStatus] = useState("week");
  const [selectedTask, setSelectedTask] = useState(null);
  const { isOpen, toggle } = useDisclosure(false);

  const { data: tasks, isLoading, refetch } = useFetch(`/pm/tasks/${status}`, [status], { limit: 10 });

  const onPressTaskItem = (id) => {
    navigation.navigate("Task Detail", { taskId: id });
  };

  const openCloseModal = useCallback((task) => {
    setSelectedTask(task);
    toggle();
  }, []);

  return (
    <>
      <View style={[card.card]}>
        <View style={{ display: "flex", gap: 10 }}>
          <Text style={[{ fontSize: 20, fontWeight: 500 }, TextProps]}>Active Tasks</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              borderRadius: 12,
              borderWidth: 1,
              padding: 0.5,
              borderColor: "#E8E9EB",
            }}
          >
            <Button
              flex={1}
              backgroundColor={status === "month" ? "#176688" : "#fff"}
              onPress={() => setStatus("month")}
            >
              <Text
                style={{
                  color: status === "month" ? "#fff" : "#3F434A",
                }}
              >
                Month
              </Text>
            </Button>
            <Button flex={1} backgroundColor={status === "week" ? "#176688" : "#fff"} onPress={() => setStatus("week")}>
              <Text
                style={{
                  color: status === "week" ? "#fff" : "#3F434A",
                }}
              >
                Week
              </Text>
            </Button>
            <Button flex={1} backgroundColor={status === "day" ? "#176688" : "#fff"} onPress={() => setStatus("day")}>
              <Text
                style={{
                  color: status === "day" ? "#fff" : "#3F434A",
                }}
              >
                Day
              </Text>
            </Button>
          </View>

          {!isLoading ? (
            tasks?.data?.data?.length > 0 ? (
              <>
                <FlashList
                  data={tasks?.data?.data}
                  keyExtractor={(item) => item.id}
                  onEndReachedThreshold={0.1}
                  estimatedItemSize={200}
                  horizontal
                  renderItem={({ item }) => (
                    <ActiveTaskList
                      key={item.id}
                      id={item.id}
                      task={item}
                      title={item.title}
                      responsible={item.responsible_name}
                      image={item.responsible_image}
                      status={item.status}
                      priority={item.priority}
                      onPress={openCloseModal}
                      onPressItem={onPressTaskItem}
                    />
                  )}
                />
              </>
            ) : (
              // Image here
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../../../assets/vectors/items.jpg")}
                  alt="empty"
                  style={{ height: 200, width: 200, resizeMode: "contain" }}
                />
                <Text style={TextProps}>You have no tasks.</Text>
              </View>
            )
          ) : (
            <Skeleton width={120} height={20} radius="round" {...SkeletonCommonProps} />
          )}
        </View>
      </View>

      <ConfirmationModal
        isDelete={false}
        isOpen={isOpen}
        toggle={toggle}
        apiUrl={"/pm/tasks/close"}
        body={{ id: selectedTask?.id }}
        header="Close Task"
        description={`Are you sure to close task ${selectedTask?.title}?`}
        successMessage="Task closed"
        hasSuccessFunc
        onSuccess={refetch}
      />
    </>
  );
};

export default ActiveTaskCard;
