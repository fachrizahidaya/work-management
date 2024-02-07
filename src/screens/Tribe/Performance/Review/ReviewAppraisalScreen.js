import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { useNavigation, useRoute } from "@react-navigation/native";

import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ReturnConfirmationModal from "../../../../components/shared/ReturnConfirmationModal";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import { useLoading } from "../../../../hooks/useLoading";
import ReviewAppraisalDetailList from "../../../../components/Tribe/Performance/ReviewList/ReviewAppraisalDetailList";
import ReviewAppraisalDetailItem from "../../../../components/Tribe/Performance/ReviewList/ReviewAppraisalDetailItem";
import PageHeader from "../../../../components/shared/PageHeader";
import { useFetch } from "../../../../hooks/useFetch";
import axiosInstance from "../../../../config/api";
import { useFormik } from "formik";

const ReviewAppraisalScreen = () => {
  const [appraisalValues, setAppraisalValues] = useState([]);
  const [employeeAppraisalValue, setEmployeeAppraisalValue] = useState([]);
  const [appraisal, setAppraisal] = useState(null);
  const [formValue, setFormValue] = useState(null);

  const navigation = useNavigation();
  const formScreenSheetRef = useRef(null);
  const route = useRoute();

  const { id } = route.params;

  const { data: appraisalList } = useFetch(`/hr/employee-review/appraisal/${id}`);

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);

  const { isLoading: submitIsLoading, toggle: toggleSubmit } = useLoading(false);

  const openSelectedAppraisal = (data) => {
    setAppraisal(data);
    formScreenSheetRef.current?.show();
  };

  const closeSelectedAppraisal = () => {
    setAppraisal(null);
    formScreenSheetRef.current?.hide();
  };

  const getEmployeeAppraisalValue = (employee_appraisal_value) => {
    let employeeAppraisalValArr = [];
    if (Array.isArray(employee_appraisal_value)) {
      employee_appraisal_value.forEach((val) => {
        employeeAppraisalValArr = [
          ...employeeAppraisalValArr,
          {
            ...val?.performance_appraisal_value,
            id: val?.id,
            performance_appraisal_value_id: val?.performance_appraisal_value_id,
            choice: val?.choice,
          },
        ];
      });
    }
    return [...employeeAppraisalValArr];
  };

  const employeeAppraisalValueUpdateHandler = (data) => {
    setEmployeeAppraisalValue((prevState) => {
      let currentData = [...prevState];
      const index = currentData.findIndex(
        (employee_appraisal_val) =>
          employee_appraisal_val?.performance_appraisal_value_id === data?.performance_appraisal_value_id
      );
      if (index > -1) {
        currentData[index].choice = data?.choice;
      } else {
        currentData = [...currentData, data];
      }
      return [...currentData];
    });
  };

  const sumUpAppraisalValue = () => {
    setAppraisalValues(() => {
      const performanceAppraisalValue = appraisalList?.data?.performance_appraisal?.value;
      const employeeAppraisalValue = getEmployeeAppraisalValue(appraisalList?.data?.employee_appraisal_value);
      return [...employeeAppraisalValue, ...performanceAppraisalValue];
    });
  };

  const submitHandler = async () => {
    try {
      toggleSubmit();
      const res = await axiosInstance.patch(`/hr/employee-appraisal/${appraisalList?.data?.id}`, {
        appraisal_value: employeeAppraisalValue,
      });
      refetchAppraisalList();
      Toast.show("Data saved!", SuccessToastProps);
    } catch (err) {
      console.log(err);
      toggleSubmit();
      Toast.show(err.response.data.message, ErrorToastProps);
    } finally {
      toggleSubmit();
    }
  };

  const formik = useFormik({
    initialValues: {
      performance_appraisal_value_id: appraisal?.performance_appraisal_value_id || appraisal?.id,
      choice: appraisal?.choice || "",
    },
    onSubmit: (values) => {
      if (formik.isValid) {
        employeeAppraisalValueUpdateHandler(values);
      }
    },
    enableReinitialize: true,
  });

  const formikChangeHandler = (e, submitWithoutChange = false) => {
    if (!submitWithoutChange) {
      formik.handleChange("choice", e);
    }
    setFormValue(formik.values);
  };

  useEffect(() => {
    if (formValue) {
      formik.handleSubmit();
    }
  }, [formValue]);

  useEffect(() => {
    if (appraisalList?.data) {
      sumUpAppraisalValue();
      setEmployeeAppraisalValue(() => {
        const employeeAppraisalValue = getEmployeeAppraisalValue(appraisalList?.data?.employee_appraisal_value);
        return [...employeeAppraisalValue];
      });
    }
  }, [appraisalList?.data]);

  return (
    <>
      <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
        <View style={styles.header}>
          <PageHeader width={200} title="Employee Appraisal" backButton={true} onPress={() => toggleReturnModal()} />
          <TouchableOpacity
          // onPress={() => {
          //   submitHandler();
          //   navigation.goBack();
          // }}
          >
            <Text>Done</Text>
          </TouchableOpacity>
        </View>
        <ReviewAppraisalDetailList
          dayjs={dayjs}
          begin_date={appraisalList?.data?.performance_appraisal?.review?.begin_date}
          end_date={appraisalList?.data?.performance_appraisal?.review?.end_date}
          position={appraisalList?.data?.performance_appraisal?.target_level}
          target={appraisalList?.data?.performance_appraisal?.target_name}
          targetLevel={appraisalList?.data?.performance_appraisal?.target_level}
          name={appraisalList?.data?.employee?.name}
        />

        <View style={styles.container}>
          <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
            {appraisalValues &&
              appraisalValues.length > 0 &&
              appraisalValues.map((item, index) => {
                return (
                  <ReviewAppraisalDetailItem
                    key={index}
                    id={item?.id}
                    description={item?.description}
                    onChange={employeeAppraisalValueUpdateHandler}
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
    </>
  );
};

export default ReviewAppraisalScreen;

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
