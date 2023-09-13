import React from "react";
import { useNavigation } from "@react-navigation/native";

import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

import { Box, Flex, Pressable, Text } from "native-base";

import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";

const ProjectListItem = ({ id, title, status, deadline, isArchive, image, ownerName }) => {
  const navigation = useNavigation();

  return (
    <Pressable onPress={() => navigation.navigate("Project Detail", { projectId: id })}>
      <Flex
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
        borderBottomColor="#cbcbcb"
        borderBottomWidth={1}
        py={2}
        px={4}
      >
        <Flex gap={0.5}>
          <Text>{title?.length > 24 ? title.slice(0, 24) + "..." : title}</Text>

          <Text
            fontWeight={400}
            color={
              isArchive ? "#979797" : status === "Open" ? "#E8A30A" : status === "On Progress" ? "#0090FF" : "#49C96D"
            }
          >
            {isArchive ? "Archived" : status}
          </Text>

          <AvatarPlaceholder name={ownerName} image={image} />
        </Flex>
        <Box
          alignItems="center"
          justifyContent="center"
          bgColor={dayjs(deadline).fromNow().includes("ago") ? "#fff5ef" : "#f8f8f8"}
          borderRadius={10}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
          }}
        >
          <Text color={dayjs(deadline).fromNow().includes("ago") ? "#e56e19" : "#3f434a"}>
            Over {dayjs(deadline).fromNow()}
          </Text>
        </Box>
      </Flex>
    </Pressable>
  );
};

export default ProjectListItem;
