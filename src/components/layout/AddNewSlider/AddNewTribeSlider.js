import { Box, FlatList, Flex, Icon, Slide, Pressable, Text } from "native-base";
import { useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import NewFeedSlider from "../../Tribe/Feed/NewFeedSlider";

const AddNewTribeSlider = ({ isOpen, setIsOpen }) => {
  const [newFeedIsOpen, setNewFeedIsOpen] = useState(false);
  const [newLeaveIsOpen, setNewLeaveIsOpen] = useState(false);
  const [newReimbursementIsOpen, setNewReimbursementIsOpen] = useState(false);

  const items = [
    {
      icons: "plus",
      title: "New Post",
    },
    {
      icons: "plus",
      title: "New Leave Request",
    },
    {
      icons: "plus",
      title: "New Reimbursement",
    },
  ];

  return (
    <>
      <Slide in={isOpen} placement="bottom" duration={200}>
        <Box position="absolute" bottom={95} width="100%" bgColor="white">
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setIsOpen(!isOpen);
                  if (item.title === "New Post") {
                    setNewFeedIsOpen(!newFeedIsOpen);
                  } else if (item.title === "New Leave Request") {
                    setNewLeaveIsOpen(!newLeaveIsOpen);
                  } else {
                    setNewReimbursementIsOpen(!newReimbursementIsOpen);
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

      <NewFeedSlider isOpen={newFeedIsOpen} setIsOpen={setNewFeedIsOpen} />
    </>
  );
};

export default AddNewTribeSlider