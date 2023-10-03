import { useState } from "react";

import { Box, Flex, Icon, Image, Pressable, Text } from "native-base";

import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ImagePickerAction = ({}) => {
  const [image, setImage] = useState(null);

  const pickImageHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Handling for name
    var filename = result.assets[0].uri.substring(
      result.assets[0].uri.lastIndexOf("/") + 1,
      result.assets[0].uri.length
    );

    // Handling for file information
    const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);

    if (result) {
      setImage({
        name: filename,
        size: fileInfo.size,
        type: `${result.assets[0].type}/jpg`,
        webkitRelativePath: "",
        uri: result.assets[0].uri,
      });
    }
  };
  return (
    <>
      <Flex p={2} flexDir="column" justifyContent="space-between">
        {image ? (
          image.size >= 1000000 ? (
            <Text textAlign="center">Image size is too large!</Text>
          ) : (
            <Box alignSelf="center">
              <Image
                source={{ uri: image.uri }}
                style={{ width: 300, height: 250, borderRadius: 15 }}
                alt="image selected"
              />
              <Box
                backgroundColor="#4b4f53"
                borderRadius="full"
                width={8}
                height={8}
                top={1}
                padding={1.5}
                right={1}
                position="absolute"
              >
                <Pressable onPress={() => setImage(null)}>
                  <Icon as={<MaterialCommunityIcons name="close" />} size={5} color="#FFFFFF" />
                </Pressable>
              </Box>
            </Box>
          )
        ) : null}
      </Flex>
      <Pressable padding={11} width={50} height={50} onPress={pickImageHandler}>
        <Icon as={<MaterialCommunityIcons name="image-outline" />} size={30} color="#377893" />
      </Pressable>
    </>
  );
};

export default ImagePickerAction;
