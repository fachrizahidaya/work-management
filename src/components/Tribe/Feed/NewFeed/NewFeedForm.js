import { useState } from "react";

import { Box, Flex, FormControl, Icon, Image, Pressable, Spinner } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import MentionInput from "./MentionInput";

const NewFeedForm = ({ formik, image, setImage, pickImageHandler, employees, mentionSelectHandler, inputRef }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Flex borderWidth={1} borderRadius={10} borderColor="#dfdfdf" mt={3}>
      <FormControl>
        <MentionInput
          employees={employees}
          formik={formik}
          name="content"
          onMentionSelect={mentionSelectHandler}
          inputRef={inputRef}
        />

        <Flex p={2} flexDir="column" justifyContent="space-between">
          {image ? (
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
          ) : null}
        </Flex>
      </FormControl>
      <Flex mt={2} py={3} px={2} flexDir="row" justifyContent="space-between" alignItems="center">
        <Pressable onPress={pickImageHandler}>
          <Icon
            as={<MaterialCommunityIcons name="attachment" />}
            size={25}
            color="#377893"
            style={{ transform: [{ rotate: "-35deg" }] }}
          />
        </Pressable>

        <Pressable
          borderRadius="full"
          borderWidth={1}
          borderColor="#FFFFFF"
          justifyContent="center"
          alignItems="center"
          backgroundColor="#377893"
          width={50}
          height={50}
          opacity={formik.values.content === "" ? 0.5 : 1}
          onPress={
            formik.values.content === ""
              ? null
              : () => {
                  setIsLoading(true);
                  formik.handleSubmit();
                }
          }
        >
          {isLoading ? (
            <Spinner color="#FFFFFF" />
          ) : (
            <Icon
              as={<MaterialCommunityIcons name={formik.values.type === "Public" ? "send" : "bullhorn-variant"} />}
              size={25}
              color="#FFFFFF"
              style={{ transform: [{ rotate: "-45deg" }] }}
            />
          )}
        </Pressable>
      </Flex>
    </Flex>
  );
};

export default NewFeedForm;
