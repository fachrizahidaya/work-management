import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFormik } from "formik";
import * as yup from "yup";

import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";

import ReturnConfirmationModal from "../../../../components/shared/ReturnConfirmationModal";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import { useLoading } from "../../../../hooks/useLoading";
import CommentDetailList from "../../../../components/Tribe/Performance/CommentList/CommentDetailList";
import PageHeader from "../../../../components/shared/PageHeader";
import { useFetch } from "../../../../hooks/useFetch";
import axiosInstance from "../../../../config/api";
import { ErrorToastProps, SuccessToastProps } from "../../../../components/shared/CustomStylings";
import Button from "../../../../components/shared/Forms/Button";
import CommentDetailItem from "../../../../components/Tribe/Performance/CommentList/CommentDetailItem";
import CommentForm from "../../../../components/Tribe/Performance/Form/CommentForm";

const CommentScreen = () => {
  const [commentValues, setCommentValues] = useState([]);
  const [employeeCommentValue, setEmployeeCommentValue] = useState([]);
  const [comment, setComment] = useState(null);
  const [formValue, setFormValue] = useState(null);
  const [employeeComment, setEmployeeComment] = useState(null);

  const navigation = useNavigation();
  const formScreenSheetRef = useRef(null);
  const route = useRoute();

  const { id } = route.params;

  const {
    data: commentList,
    isFetching: commentListIsFetching,
    refetch: refetchCommentList,
  } = useFetch(`/hr/employee-review/comment/${
    id 
    // '9b4694be-487b-410a-a4ae-49f3264ceee4'
  }`);

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);

  const { isLoading: submitIsLoading, toggle: toggleSubmit } = useLoading(false);

  const openSelectedComment = (data, value) => {
    setComment(data);
    setEmployeeComment(value);
    formScreenSheetRef.current?.show();
  };

  const closeSelectedComment = () => {
    formScreenSheetRef.current?.hide();
  };

  const getEmployeeCommentValue = (employee_comment_value) => {
    let employeeCommentValArr = [];
    if (Array.isArray(employee_comment_value)) {
      employee_comment_value.forEach((val) => {
        employeeCommentValArr = [
          ...employeeCommentValArr,
          {
            ...val?.performance_review_comment,
            id: val?.id,
            performance_review_comment_id: val?.performance_review_comment_id,
            comment: val?.comment,
          },
        ];
      });
    }
    return [...employeeCommentValArr];
  };

  const employeeCommentValueUpdateHandler = (data) => {
    setEmployeeCommentValue((prevState) => {
      let currentData = [...prevState];
      const index = currentData.findIndex(
        (employee_comment_val) =>
          employee_comment_val?.performance_review_comment_id === data?.performance_review_comment_id
      );
      if (index > -1) {
        currentData[index].comment = data?.comment;
      } else {
        currentData = [...currentData, data];
      }
      return [...currentData];
    });
  };

  const sumUpCommentValue = () => {
    setCommentValues(() => {
      // const performanceCommentValue = commentList?.data?.performance_review?.comment;
      const employeeCommentValue = getEmployeeCommentValue(commentList?.data?.employee_review_comment_value);
      return [
        ...employeeCommentValue,
        // ...performanceCommentValue,
      ];
    });
  };

  const submitHandler = async () => {
    try {
      toggleSubmit();
      const res = await axiosInstance.patch(`/hr/employee-review/comment/${commentList?.data?.id}`, {
        comment_value: employeeCommentValue,
      });
      Toast.show("Data saved!", SuccessToastProps);
      refetchCommentList();
    } catch (err) {
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
      toggleSubmit();
    } finally {
      toggleSubmit();
    }
  };

  const formik = useFormik({
    initialValues: {
      performance_review_comment_id: comment?.performance_review_comment_id || comment?.id,
      comment: comment?.comment || "",
    },
    validationSchema: yup.object().shape({
      comment: yup.string().required("Comment is required"),
    }),
    onSubmit: (values) => {
      if (formik.isValid) {
        employeeCommentValueUpdateHandler(values);
      }
    },
    enableReinitialize: true,
  });

  const formikChangeHandler = (e, submitWithoutChange = false) => {
    if (!submitWithoutChange) {
      formik.handleChange("comment", e);
    }
    setFormValue(formik.values);
  };

  function compareCommentExisting(commentValues, employeeCommentValue) {
    let differences = [];

    for (let empComment of employeeCommentValue) {
      let commentValue = commentValues.find((comment) => comment.id === empComment.id);
      if (commentValue && commentValue.comment !== empComment.comment) {
        differences.push({
          id: empComment.id,
          difference: [empComment.comment, commentValue.comment],
        });
      }
    }

    return differences;
  }

  let differences = compareCommentExisting(commentValues, employeeCommentValue);

  useEffect(() => {
    if (formValue) {
      formik.handleSubmit();
    }
  }, [formValue]);

  useEffect(() => {
    if (commentList?.data) {
      sumUpCommentValue();
      setEmployeeCommentValue(() => {
        const employeeCommentValue = getEmployeeCommentValue(commentList?.data?.employee_review_comment_value);
        return [...employeeCommentValue];
      });
    }
  }, [commentList?.data]);

  return (
    <>
      <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
        <View style={styles.header}>
          <PageHeader
            width={200}
            title="Employee Comment"
            backButton={true}
            onPress={() => {
              if (differences.length === 0) {
                navigation.goBack();
              } else {
                toggleReturnModal();
              }
            }}
          />

          <Button
            height={35}
            padding={10}
            children={
              submitIsLoading ? (
                <ActivityIndicator />
              ) : (
                <Text style={{ fontSize: 12, fontWeight: "500", color: "#FFFFFF" }}>Save</Text>
              )
            }
            onPress={() => {
              if (submitIsLoading || differences.length === 0) {
                null;
              } else {
                submitHandler();
              }
            }}
            disabled={differences.length === 0 || submitIsLoading}
          />
        </View>
        <CommentDetailList
          dayjs={dayjs}
          begin_date={commentList?.data?.performance_review?.begin_date}
          end_date={commentList?.data?.performance_review?.end_date}
          target={null}
          name={commentList?.data?.employee?.name}
          title={commentList?.data?.performance_review?.description}
          type='ongoing'
        />

        <View style={styles.container}>
          <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
            {commentValues &&
              commentValues.length > 0 &&
              commentValues.map((item, index) => {
                const correspondingEmployeeComment = employeeCommentValue.find(
                  (empComment) => empComment.id === item.id
                );
                return (
                  <CommentDetailItem
                    key={index}
                    item={item}
                    description={item?.description}
                    handleOpen={openSelectedComment}
                    employeeCommentValue={correspondingEmployeeComment}
                    comment={item?.comment}
                  />
                );
              })}
          </ScrollView>
        </View>
      </SafeAreaView>
      <ReturnConfirmationModal
        isOpen={returnModalIsOpen}
        toggle={toggleReturnModal}
        description="Are you sure want to return? Data changes will not be save."
        onPress={() => navigation.goBack()}
      />
      <CommentForm
        reference={formScreenSheetRef}
        description={comment?.description}
        formik={formik}
        handleClose={closeSelectedComment}
        onChange={formikChangeHandler}
        comment={comment?.comment}
        commentValue={employeeComment?.comment}
      />
    </>
  );
};

export default CommentScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8",
    flex: 1,
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
