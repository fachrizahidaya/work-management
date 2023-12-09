import { Flex, Icon, Image, Text } from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const MediaItem = ({ image, path, type, name }) => {
  return (
    <TouchableOpacity>
      {type === "application/pdf" ? (
        <Flex flexDir="row" alignItems="center" gap={2}>
          <Icon as={<MaterialCommunityIcons name="delete-outline" />} size="md" color="red.600" />
          <Text color="red.500">{image}</Text>
        </Flex>
      ) : (
        <Image
          width={60}
          height={60}
          borderRadius={5}
          source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${path}` }}
          alt="Chat Image"
          resizeMode="contain"
          resizeMethod="auto"
        />
      )}
    </TouchableOpacity>
  );
};

export default MediaItem;
