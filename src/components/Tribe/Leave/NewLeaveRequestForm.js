import { useEffect, useState } from "react";
import { useFormik } from "formik";
import dayjs from "dayjs";
import * as yup from "yup";

import { Flex, FormControl, HStack, Icon, Select, Spinner, Text, TextArea } from "native-base";
import { TouchableWithoutFeedback, Keyboard } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import CustomDateTimePicker from "../../shared/CustomDateTimePicker";
import FormButton from "../../shared/FormButton";
import { ErrorToast, SuccessToast } from "../../shared/ToastDialog";
import axiosInstance from "../../../config/api";
import { useFetch } from "../../../hooks/useFetch";

const NewLeaveRequestForm = ({ toast, onSubmit }) => {
  const [selectedGenerateType, setSelectedGenerateType] = useState(null);
  const [dateChanges, setDateChanges] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [formError, setFormError] = useState(true);
  console.log("change", dateChanges);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const { data: leaveType } = useFetch("/hr/leaves");

  /**
   * Calculate leave quota handler
   * @param {*} action
   */
  const countLeave = async (action = null) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post(`/hr/leave-requests/count-leave`, {
        leave_id: formik.values.leave_id,
        begin_date: formik.values.begin_date,
        end_date: formik.values.end_date,
      });

      formik.setFieldValue("days", res.data.days);
      formik.setFieldValue("begin_date", dayjs(res.data.begin_date).format("YYYY-MM-DD"));
      formik.setFieldValue("end_date", dayjs(res.data.end_date).format("YYYY-MM-DD"));
      setIsLoading(false);
      toast.show({
        render: () => {
          return <SuccessToast message="Leave request available" />;
        },
      });
      setFormError(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setIsError(true);
      toast.show({
        render: () => {
          return <ErrorToast message={err.response.data.message} />;
        },
      });
    }
  };

  /**
   * Create leave request handler
   */
  const formik = useFormik({
    initialValues: {
      leave_id: "",
      begin_date: dayjs().format("YYYY-MM-DD"),
      end_date: dayjs().format("YYYY-MM-DD"),
      days: "",
      reason: "",
    },
    validationSchema: yup.object().shape({
      leave_id: yup.string().required("Leave Type is required"),
      reason: yup.string().required("Purpose of Leave is required"),
      begin_date: yup.date().required("Start date is required"),
      end_date: yup.date().min(yup.ref("begin_date"), "End date can't be less than start date"),
    }),
    onSubmit: (values, { resetForm, setSubmitting, setStatus }) => {
      setStatus("processing");
      onSubmit(values, setSubmitting, setStatus);
      // resetForm();
    },
  });

  /**
   * Begin and End date Leave handler
   * @param {*} value
   */
  const onChangeStartDate = (value) => {
    formik.setFieldValue("begin_date", value);
    setDateChanges(true); // every time there is change of date, it will set to true
  };

  const onChangeEndDate = (value) => {
    formik.setFieldValue("end_date", value);
    setDateChanges(true); // every time there is change of date, it will set to true
  };

  useEffect(() => {
    if (formik.values.leave_id && dateChanges) {
      countLeave();
      setDateChanges(false);
    }
  }, [formik.values.leave_id, dateChanges]);

  useEffect(() => {
    if (selectedGenerateType === null) {
      setDateChanges(true);
    }
  }, [selectedGenerateType]);

  useEffect(() => {
    setSelectedGenerateType(() => {
      const selectedLeave = leaveType?.data.find((leave) => leave.id === formik.values.leave_id);
      console.log(selectedLeave?.generate_type);
      return selectedLeave?.generate_type;
    });
  }, [formik.values.leave_id]);

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      navigation.goBack();
    }
  }, [formik.isSubmitting, formik.status]);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <Flex px={1} gap={11}>
        <FormControl isInvalid={formik.errors.leave_id}>
          <FormControl.Label>Leave Type</FormControl.Label>
        </FormControl>

        <Select
          mt={-3}
          selectedValue={formik.values.leave_id}
          onValueChange={(value) => formik.setFieldValue("leave_id", value)}
          borderRadius={15}
          borderWidth={1}
          variant="unstyled"
          key="leave_id"
          accessibilityLabel="Select Leave type"
          placeholder="Select Leave type"
          dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
        >
          {leaveType?.data.map((item, index) => {
            return (
              <Select.Item _pressed={{ backgroundColor: "#f1f1f1" }} key={index} label={item?.name} value={item?.id} />
            );
          })}
        </Select>
        <FormControl mt={-2} isInvalid={formik.errors.leave_id}>
          <FormControl.ErrorMessage>{formik.errors.leave_id}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl isInvalid={formik.errors.reason}>
          <FormControl.Label>Purpose of Leaving</FormControl.Label>
          <TextArea
            value={formik.values.reason}
            h={100}
            onChangeText={(value) => formik.setFieldValue("reason", value)}
            placeholder="Input purpose"
          />
          <FormControl.ErrorMessage>{formik.errors.reason}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl isInvalid={formik.errors.begin_date}>
          <FormControl.Label>Start Date</FormControl.Label>
          <CustomDateTimePicker
            defaultValue={formik.values.begin_date}
            onChange={onChangeStartDate}
            disabled={!formik.values.leave_id}
          />
          <FormControl.ErrorMessage>{formik.errors.begin_date}</FormControl.ErrorMessage>
        </FormControl>
        <FormControl isInvalid={formik.errors.end_date}>
          <FormControl.Label>End Date</FormControl.Label>
          <CustomDateTimePicker
            defaultValue={formik.values.end_date}
            onChange={onChangeEndDate}
            disabled={!formik.values.leave_id}
          />
          <FormControl.ErrorMessage>{formik.errors.end_date}</FormControl.ErrorMessage>
        </FormControl>
        {isLoading && (
          <HStack>
            <Spinner />
            <Text fontSize={10} fontWeight={400}>
              Checking availability...
            </Text>
          </HStack>
        )}

        {formik.values.leave_id &&
        formik.values.reason &&
        formik.values.begin_date &&
        formik.values.end_date &&
        !isLoading &&
        !isError ? (
          <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
            <Text color="#FFFFFF">Submit</Text>
          </FormButton>
        ) : (
          <FormButton opacity={0.5}>
            <Text color="#FFFFFF">Submit</Text>
          </FormButton>
        )}
      </Flex>
    </TouchableWithoutFeedback>
  );
};

export default NewLeaveRequestForm;
