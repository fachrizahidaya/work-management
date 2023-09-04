import React, { useState } from "react";
import { Box, FlatList, Flex, Icon, Pressable, Slide, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import NewProjectSlider from "../../Band/Project/NewProjectSlider/NewProjectSlider";
import NewTaskSlider from "../../Band/Task/NewTaskSlider/NewTaskSlider";
import NewNoteSlider from "../../Band/Note/NewNoteSlider/NewNoteSlider";

const AddNewBandSlider = ({ isOpen, setIsOpen }) => {
  const [newProjectIsOpen, setNewProjectIsOpen] = useState(false);
  const [newTaskIsOpen, setNewTaskIsOpen] = useState(false);
  const [newNoteIsOpen, setNewNoteIsOpen] = useState(false);

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
      <Slide in={isOpen} placement="bottom" duration={200}>
        <Box
          position="absolute"
          bottom={95} // Adjust this value to position the slide component
          width="100%"
          bgColor="white"
        >
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setIsOpen(!isOpen);
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
      </Slide>

      <NewProjectSlider isOpen={newProjectIsOpen} setIsOpen={setNewProjectIsOpen} />
      <NewTaskSlider isOpen={newTaskIsOpen} setIsOpen={setNewTaskIsOpen} />
      <NewNoteSlider isOpen={newNoteIsOpen} setIsOpen={setNewNoteIsOpen} />
    </>
  );
};

export default AddNewBandSlider;
