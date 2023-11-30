import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/core";

import { Box, Flex, Icon, Text, useToast, Button } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../../components/shared/AvatarPlaceholder";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import { ErrorToast, SuccessToast } from "../../../../components/shared/ToastDialog";
import axiosInstance from "../../../../config/api";
import PageHeader from "../../../../components/shared/PageHeader";
import NewFeedForm from "../../../../components/Tribe/Feed/NewFeed/NewFeedForm";
import ReturnConfirmationModal from "../../../../components/shared/ReturnConfirmationModal";
import { useFetch } from "../../../../hooks/useFetch";

const NewFeedScreen = ({ route }) => {
  const [image, setImage] = useState(null);
  const [isAnnouncementSelected, setIsAnnouncementSelected] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Public");

  const { isOpen: postTypeIsOpen, close: postTypeIsClose, toggle: togglePostType } = useDisclosure(false);
  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);

  const toast = useToast();

  const navigation = useNavigation();

  const inputRef = useRef(null);

  const {
    loggedEmployeeImage,
    loggedEmployeeName,
    loggedEmployeeDivision,
    postRefetchHandler,
    scrollNewMessage,
    setScrollNewMessage,
  } = route.params;

  const { data: employees, isFetching: employeesIsFetching, refetch: refetchEmployees } = useFetch("/hr/employees");

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
      setStatus("processing");
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
   * Submit a post handler
   * @param {*} form
   * @param {*} setSubmitting
   * @param {*} setStatus
   */
  const postSubmitHandler = async (form, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.post("/hr/posts", form, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      postRefetchHandler();
      setScrollNewMessage(!scrollNewMessage);
      setSubmitting(false);
      setStatus("success");
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message={`Posted succesfuly!`} close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={`Process Failed, please try again later...`} close={() => toast.close(id)} />;
        },
      });
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
   * Date for announcement handler
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

  const mentionSelectHandler = (updatedContent) => {
    formik.setFieldValue("content", updatedContent);
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

    const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri); // Handling for file information

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
    if (!formik.isSubmitting && formik.status === "success") {
      formik.resetForm();
      navigation.goBack();
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <Box flex={1} bgColor="#FFFFFF" p={5}>
      <PageHeader
        title="New Post"
        onPress={
          formik.values.content || image !== null
            ? !formik.isSubmitting && formik.status !== "processing" && toggleReturnModal
            : () => {
                !formik.isSubmitting && formik.status !== "processing" && navigation.goBack();
                formik.resetForm();
                setImage(null);
              }
        }
      />

      <ReturnConfirmationModal
        isOpen={returnModalIsOpen}
        toggle={toggleReturnModal}
        onPress={() => {
          toggleReturnModal();
          navigation.goBack();
          setImage(null);
        }}
        description="Are you sure want to exit? It will be deleted."
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
        employees={employees?.data}
        mentionSelectHandler={mentionSelectHandler}
        inputRef={inputRef}
      />
    </Box>
  );
};

export default NewFeedScreen;
