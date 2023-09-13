import React, { useState } from "react";

import { Dimensions } from "react-native";
import { Box, FlatList, Flex, Icon, Pressable, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import NewProjectSlider from "../../Band/Project/NewProjectSlider/NewProjectSlider";
import NewTaskSlider from "../../Band/Task/NewTaskSlider/NewTaskSlider";
import NewNoteSlider from "../../Band/Note/NewNoteSlider/NewNoteSlider";

const AddNewBandSlider = ({ isOpen, setIsOpen }) => {
  const { height } = Dimensions.get("window");
  const [newProjectIsOpen, setNewProjectIsOpen] = useState(false);
  const [newTaskIsOpen, setNewTaskIsOpen] = useState(false);
  const [newNoteIsOpen, setNewNoteIsOpen] = useState(false);

  const onClose = () => {
    setNewTaskIsOpen(false);
  };

  const items = [
    {
      icons: "view-grid-outline",
      title: "New Project",
    },
    {
      icons: "plus",
      title: "New Task | ad hoc",
    },
    {
      icons: "pencil-outline",
      title: "New Notes",
    },
  ];
  return (
    <>
      <Box>
        <Pressable
          position="absolute"
          bottom={79}
          height={height}
          width="100%"
          zIndex={2}
          onPress={() => setIsOpen(!isOpen)}
        ></Pressable>
        <Box position="absolute" bottom={79} width="100%" bgColor="white" zIndex={3}>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  // setIsOpen(!isOpen);
                  if (item.title === "New Project") {
                    setNewProjectIsOpen(!newProjectIsOpen);
                  } else if (item.title === "New Task | ad hoc") {
                    setNewTaskIsOpen(!newTaskIsOpen);
                  } else {
                    setNewNoteIsOpen(!newNoteIsOpen);
                  }
                }}
              >
                <Flex
                  flexDir="row"
                  alignItems="center"
                  gap={25}
                  px={8}
                  py={4}
                  borderColor="#E8E9EB"
                  borderBottomWidth={1}
                  borderTopWidth={item.icons === "home" ? 1 : 0}
                >
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
              </Pressable>
            )}
          />
        </Box>
      </Box>

      {newProjectIsOpen && <NewProjectSlider isOpen={newProjectIsOpen} setIsOpen={setNewProjectIsOpen} />}
      {newTaskIsOpen && <NewTaskSlider isOpen={newTaskIsOpen} onClose={onClose} />}
      {newNoteIsOpen && <NewNoteSlider isOpen={newNoteIsOpen} setIsOpen={setNewNoteIsOpen} />}
    </>
  );
};

export default AddNewBandSlider;
