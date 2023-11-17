import React, { memo, useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { Actionsheet, Box, Flex, Icon, Pressable, Text, VStack, useToast } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import axiosInstance from "../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../shared/ToastDialog";
import { useDisclosure } from "../../../../hooks/useDisclosure";

const StatusSection = ({ projectData, refetch, projectId }) => {
  const userSelector = useSelector((state) => state.auth);
  const toast = useToast();
  const [value, setValue] = useState("");
  const { isOpen, toggle, close } = useDisclosure(false);
  const statuses = ["Open", "On Progress", "Complete"];

  /**
   * Handles project status change
   * @param {*} status - selected status
   */
  const changeProjectStatusHandler = async (status) => {
    try {
      await axiosInstance.post(`/pm/projects/${status.toLowerCase()}`, {
        id: projectId,
      });
      refetch();
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message={`Project ${status}ed`} close={() => toast.close(id)} />;
        },
      });
    } catch (error) {
      console.log(error);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={error.response.data.message} close={() => toast.close(id)} />;
        },
      });
    }
  };

  useEffect(() => {
    if (projectData) {
      setValue(projectData.status);
    }

    return () => {
      close();
    };
  }, [projectData]);
  return (
    <>
      <Pressable onPress={toggle} disabled={projectData?.owner_id !== userSelector.id}>
        <Flex
          borderWidth={1}
          borderColor="#cbcbcb"
          borderRadius={15}
          py={1}
          px={3}
          bgColor={"#F8F8F8"}
          style={{ height: 40 }}
          flexDir="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex flexDir="row" alignItems="center" style={{ gap: 10 }}>
            <Box
              h={4}
              w={4}
              bgColor={value === "Open" ? "#FFD240" : value === "On Progress" ? "#20cce2" : "#49c86c"}
              borderRadius={4}
            />

            <Text>{value}</Text>
          </Flex>

          {projectData?.owner_id === userSelector.id && (
            <Icon as={<MaterialCommunityIcons name={isOpen ? "chevron-up" : "chevron-down"} />} size="md" />
          )}
        </Flex>
      </Pressable>

      <Actionsheet isOpen={isOpen} onClose={toggle}>
        <Actionsheet.Content>
          <VStack w="95%">
            {statuses.map((status) => {
              return (
                <Actionsheet.Item
                  key={status}
                  onPress={() => {
                    if (status !== "Open") {
                      setValue(status);
                      toggle();
                      changeProjectStatusHandler(status === "On Progress" ? "start" : "finish");
                    }
                  }}
                >
                  <Flex flexDir="row" gap={2} alignItems="center">
                    <Box
                      h={4}
                      w={4}
                      bgColor={status === "Open" ? "#FFD240" : status === "On Progress" ? "#20cce2" : "#49c86c"}
                      borderRadius={4}
                    />
                    <Text>{status}</Text>
                  </Flex>
                </Actionsheet.Item>
              );
            })}
          </VStack>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};

export default memo(StatusSection);
