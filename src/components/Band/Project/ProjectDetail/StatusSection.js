import React, { useEffect, useState } from "react";

import { Box, Flex, Menu, Text, useToast } from "native-base";

import axiosInstance from "../../../../config/api";
import { ErrorToast, SuccessToast } from "../../../shared/ToastDialog";
import CustomSelect from "../../../shared/CustomSelect";

const StatusSection = ({ projectData, refetch, projectId }) => {
  const toast = useToast();
  const [value, setValue] = useState("");
  const [openSelect, setOpenSelect] = useState(false);
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
        render: () => {
          return <SuccessToast message={`Project ${status}ed`} />;
        },
      });
    } catch (error) {
      console.log(error);
      toast.show({
        render: () => {
          return <ErrorToast message={error.response.data.message} />;
        },
      });
    }
  };

  useEffect(() => {
    if (projectData) {
      setValue(projectData.status);
    }

    return () => {
      setOpenSelect(false);
    };
  }, [projectData]);
  return (
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
              if (status !== "Open") {
                setValue(status);
                setOpenSelect(!openSelect);
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
              ></Box>
              <Text>{status}</Text>
            </Flex>
          </Menu.Item>
        );
      })}
    </CustomSelect>
  );
};

export default StatusSection;
