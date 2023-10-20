import React, { memo, useCallback, useState } from "react";

import { Actionsheet, Box, Flex, Icon, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import NewProjectSlider from "../../Band/Project/NewProjectSlider/NewProjectSlider";
import NewTaskSlider from "../../Band/Task/NewTaskSlider/NewTaskSlider";
import NewNoteSlider from "../../Band/Note/NewNoteSlider/NewNoteSlider";
import useCheckAccess from "../../../hooks/useCheckAccess";

const AddNewBandSlider = ({ isOpen, toggle }) => {
  const [newProjectIsOpen, setNewProjectIsOpen] = useState(false);
  const [newTaskIsOpen, setNewTaskIsOpen] = useState(false);
  const [newNoteIsOpen, setNewNoteIsOpen] = useState(false);
  const createProjectAccess = useCheckAccess("create", "Projects");
  const createTaskAccess = useCheckAccess("create", "Tasks");
  const createNoteAccess = useCheckAccess("create", "Notes");

  const onCloseTaskForm = useCallback(() => {
    setNewTaskIsOpen(false);
  }, []);

  const onCloseProjectForm = useCallback(() => {
    setNewProjectIsOpen(false);
  }, []);

  const onCloseNoteForm = useCallback(() => {
    setNewNoteIsOpen(false);
  }, []);

  const items = [
    {
      icons: "view-grid-outline",
      title: `New Project ${createProjectAccess ? "" : "(No access)"}`,
    },
    {
      icons: "plus",
      title: `New Task | ad hoc ${createTaskAccess ? "" : "(No access"}`,
    },
    {
      icons: "pencil-outline",
      title: `New Notes ${createNoteAccess ? "" : "(No access)"}`,
    },
  ];
  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={toggle}>
        <Actionsheet.Content>
          {items.map((item, idx) => {
            return (
              <Actionsheet.Item
                key={idx}
                borderColor="#E8E9EB"
                borderBottomWidth={1}
                onPress={() => {
                  if (item.title === "New Project") {
                    createProjectAccess && setNewProjectIsOpen(!newProjectIsOpen);
                  } else if (item.title === "New Task | ad hoc") {
                    createTaskAccess && setNewTaskIsOpen(!newTaskIsOpen);
                  } else {
                    createNoteAccess && setNewNoteIsOpen(!newNoteIsOpen);
                  }
                  toggle();
                }}
              >
                <Flex flexDir="row" alignItems="center" gap={21}>
                  <Box
                    bg="#f7f7f7"
                    borderRadius={5}
                    style={{ height: 32, width: 32 }}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={<MaterialCommunityIcons name={item.icons} />} size={6} color="#2A7290" />
                  </Box>
                  <Text key={item.title} fontWeight={700} color="black">
                    {item.title}
                  </Text>
                </Flex>
              </Actionsheet.Item>
            );
          })}
        </Actionsheet.Content>
      </Actionsheet>

      {newProjectIsOpen && <NewProjectSlider isOpen={newProjectIsOpen} onClose={onCloseProjectForm} />}
      {newTaskIsOpen && <NewTaskSlider isOpen={newTaskIsOpen} onClose={onCloseTaskForm} />}
      {newNoteIsOpen && <NewNoteSlider isOpen={newNoteIsOpen} onClose={onCloseNoteForm} refreshFunc={false} />}
    </>
  );
};

export default memo(AddNewBandSlider);
