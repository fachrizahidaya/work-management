import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/core";

import { Dimensions } from "react-native";
import { Box, Flex, Icon, Text, useToast, Button, Modal, VStack, Image } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../../components/shared/AvatarPlaceholder";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import { SuccessToast } from "../../../../components/shared/ToastDialog";
import axiosInstance from "../../../../config/api";
import PageHeader from "../../../../components/shared/PageHeader";
import NewFeedForm from "../../../../components/Tribe/Feed/NewFeed/NewFeedForm";
import ReturnConfirmationModal from "../../../../components/shared/ReturnConfirmationModal";

const NewFeedScreen = ({ route }) => {
  const [image, setImage] = useState(null);
  const [isAnnouncementSelected, setIsAnnouncementSelected] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Public");

  const { isOpen: postTypeIsOpen, close: postTypeIsClose, toggle: togglePostType } = useDisclosure(false);
  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);

  const toast = useToast();
  const navigation = useNavigation();

  const { refetch, loggedEmployeeImage, loggedEmployeeName, loggedEmployeeDivision } = route.params;

  /**
   * Create a new post handler
   */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      content: "",
      type: selectedOption || "Public",
      end_date: "",
    },
    validationSchema: yup.object().shape({
      content: yup.string().required("Content is required"),
    }),
    onSubmit: (values, { resetForm, setSubmitting, setStatus }) => {
      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }

      formData.append("file", image);

      if (values.type === "Public") {
        postSubmitHandler(formData, setSubmitting, setStatus);
      } else {
        if (values.end_date) {
          postSubmitHandler(formData, setSubmitting, setStatus);
        } else {
          throw new Error("For Announcement type, end date is required");
        }
      }
    },
  });

  /**
   * Submit a Post Handler
   * @param {*} form
   */
  const postSubmitHandler = async (form, setSubmitting, setStatus) => {
    try {
      await axiosInstance.post("/hr/posts", form, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      navigation.navigate("Dashboard");
      refetch();
      setSubmitting(false);
      setStatus("success");
      toast.show({
        render: () => {
          return <SuccessToast message={`Posted succesfuly!`} />;
        },
        placement: "top",
      });
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
    }
  };

  /**
   * End date of announcement handler
   * @param {*} value
   */

  const endDateAnnouncementHandler = (value) => {
    formik.setFieldValue("end_date", value);
  };

  /**
   * Handler for date
   */
  const [dateShown, setDateShown] = useState(false);
  const announcementToggleHandler = () => {
    setDateShown(true);
    setIsAnnouncementSelected(true);
    setSelectedOption("Announcement");
    formik.setFieldValue("type", "Announcement");
  };

  /**
   * Toggle to Public Handler
   */

  const publicToggleHandler = () => {
    setSelectedOption("Public");
    formik.setFieldValue("type", "Public");
    formik.setFieldValue("end_date", "");
    setDateShown(false);
    setIsAnnouncementSelected(false);
    togglePostType();
  };

  /**
   * Pick an image Handler
   */
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

  useEffect(() => {
    if (formik.isSubmitting && formik.status === "success") {
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <Box flex={1} bgColor="#FFFFFF" p={5}>
      <PageHeader
        title="New Post"
        onPress={
          formik.values.content
            ? toggleReturnModal
            : () => {
                navigation.navigate("Dashboard");
                setImage(null);
              }
        }
      />

      <ReturnConfirmationModal
        isOpen={returnModalIsOpen}
        toggle={toggleReturnModal}
        onPress={() => {
          toggleReturnModal();
          navigation.navigate("Dashboard");
          setImage(null);
        }}
        description="If you return, It will be discarded"
      />

      <Flex mt={22} mx={2} gap={2} flexDir="row" alignItems="center">
        <AvatarPlaceholder image={loggedEmployeeImage} name={loggedEmployeeName} size="md" isThumb={false} />
        <Flex gap={1}>
          <Button height={25} onPress={() => togglePostType()} borderRadius="full" variant="outline">
            <Flex alignItems="center" flexDir="row">
              <Text fontSize={10}>{formik.values.type}</Text>
              <Icon as={<MaterialCommunityIcons name="chevron-down" />} />
            </Flex>
          </Button>
          {formik.values.type === "Public" ? (
            ""
          ) : (
            <Flex alignItems="center" gap={2} flexDir="row">
              <Icon as={<MaterialCommunityIcons name="clock-time-three-outline" />} />
              <Text fontSize={12}>
                {!formik.values.end_date ? "Please select" : dayjs(formik.values.end_date).format("YYYY-MM-DD")}
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
      <NewFeedForm
        formik={formik}
        image={image}
        setImage={setImage}
        pickImageHandler={pickImageHandler}
        postTypeIsOpen={postTypeIsOpen}
        postTypeIsClose={postTypeIsClose}
        publicToggleHandler={publicToggleHandler}
        announcementToggleHandler={announcementToggleHandler}
        isAnnouncementSelected={isAnnouncementSelected}
        dateShown={dateShown}
        endDateAnnouncementHandler={endDateAnnouncementHandler}
        loggedEmployeeDivision={loggedEmployeeDivision}
        refetch={refetch}
      />
    </Box>
  );
};

export default NewFeedScreen;
