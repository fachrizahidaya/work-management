import { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";

import { Box, Flex, Icon, Image, Input, Pressable, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import FormButton from "../../shared/FormButton";

const UserAvatar = ({
  roomId,
  type,
  name,
  image,
  position,
  email,
  onUpdateGroup,
  selectedMembers = [],
  setSelectedMembers,
  imageAttachment,
  setImageAttachment,
  pickImageHandler,
  onEditGroupPicture,
}) => {
  const [editName, setEditName] = useState(false);
  const navigation = useNavigation();
  const editGroupNameHandler = () => {
    setEditName(!editName);
  };
  const formik = useFormik({
    initialValues: {
      name: name || "",
      image: imageAttachment || "",
      member: selectedMembers,
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Group name is required"),
    }),
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");
      onUpdateGroup(roomId, values, setSubmitting, setStatus);
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      editGroupNameHandler();
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <Flex pb={2} gap={2} bg="#FFFFFF" alignItems="center" justifyContent="center">
      <Box>
        {!imageAttachment ? (
          <AvatarPlaceholder size="2xl" name={name} image={!imageAttachment ? image : imageAttachment.uri} />
        ) : (
          <Image
            source={{
              uri: `${imageAttachment?.uri}`,
            }}
            resizeMode="contain"
            borderRadius="full"
            w={120}
            h={120}
            alt="profile picture"
          />
        )}
        <Pressable
          style={styles.editPicture}
          shadow="0"
          borderRadius="full"
          borderWidth={1}
          borderColor="#C6C9CC"
          onPress={!imageAttachment ? pickImageHandler : () => setImageAttachment(null)}
        >
          <Icon
            as={<MaterialCommunityIcons name={!imageAttachment ? "pencil-outline" : "close"} />}
            size={5}
            color="#3F434A"
          />
        </Pressable>
      </Box>
      {imageAttachment && <FormButton onPress={formik.handleSubmit} children="Save" />}

      {type === "personal" ? (
        <Text fontSize={16} fontWeight={500}>
          {name.length > 30 ? name.split(" ")[0] : name}
        </Text>
      ) : (
        <Flex alignItems="center">
          {editName ? (
            <Input
              type="text"
              InputRightElement={
                <Icon
                  onPress={
                    !formik.values.name.length || formik.values.name === name
                      ? editGroupNameHandler
                      : formik.handleSubmit
                  }
                  as={<MaterialCommunityIcons name="check" />}
                />
              }
              textAlign="center"
              size="lg"
              value={formik.values.name}
              onChangeText={(value) => formik.setFieldValue("name", value)}
              defaultValue={name.length > 30 ? name.split(" ")[0] : name}
              variant="underlined"
            />
          ) : (
            <Flex flexDirection="row" alignItems="center" gap={1}>
              <Text fontSize={16} fontWeight={500}>
                {name}
              </Text>
              <Icon onPress={editGroupNameHandler} as={<MaterialCommunityIcons name="pencil" />} />
            </Flex>
          )}
        </Flex>
      )}
      {type === "personal " ? (
        <Box alignItems="center">
          <Text color="#b8a9a3" fontSize={12} fontWeight={400}>
            {position}
          </Text>
          <Text color="#b8a9a3" fontSize={12} fontWeight={400}>
            {email}
          </Text>
        </Box>
      ) : null}
    </Flex>
  );
};

export default UserAvatar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  editPicture: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 2,
  },
});
