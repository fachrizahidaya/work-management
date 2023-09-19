import { Box, FlatList, Flex, Icon, Slide, Pressable, Text } from "native-base";
import { useState } from "react";
import { Dimensions } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const AddNewTribeSlider = ({ toggle }) => {
  const { height } = Dimensions.get("window");
  const [newLeaveIsOpen, setNewLeaveIsOpen] = useState(false);
  const [newReimbursementIsOpen, setNewReimbursementIsOpen] = useState(false);

  const onCloseLeaveRequestForm = () => {
    setNewLeaveIsOpen(false);
  };

  const onCloseReimbursementForm = () => {
    setNewReimbursementIsOpen(false);
  };

  const items = [
    {
      icons: "clipboard-clock-outline",
      title: "New Leave Request",
    },
    {
      icons: "clipboard-minus-outline",
      title: "New Reimbursement",
    },
    {
      icons: "clock-outline",
      title: "Clock in",
    },
    // {
    //   icons: "clock-outline",
    //   title: "Clock out",
    // },
  ];

  return (
    <>
      <Box>
        <Pressable position="absolute" bottom={79} height={height} width="100%" zIndex={2} onPress={toggle}></Pressable>
        <Box position="absolute" bottom={79} width="100%" bgColor="white">
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setIsOpen(!isOpen);
                  if (item.title === "New Leave Request") {
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
                  {item.title !== "Clock in" && item.title !== "Clock out" ? (
                    <>
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
                    </>
                  ) : (
                    <Flex
                      bg="#f7f7f7"
                      borderRadius={5}
                      style={{ height: 32, width: "100%" }}
                      flexDir="row"
                      gap={25}
                      alignItems="center"
                    >
                      <Box style={{ height: 32, width: 32 }} alignItems="center" justifyContent="center">
                        <Icon as={<MaterialCommunityIcons name={item.icons} />} size={6} color="#2A7290" />
                      </Box>
                      <Text key={item.title} fontWeight={700} color="black">
                        {item.title}
                      </Text>
                    </Flex>
                  )}
                </Flex>
              </Pressable>
            )}
          />
        </Box>
      </Box>
    </>
  );
};

export default AddNewTribeSlider;
