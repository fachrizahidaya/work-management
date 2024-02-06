import React, { useEffect, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";

import { FlashList } from "@shopify/flash-list";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";

import ReturnConfirmationModal from "../../../../components/shared/ReturnConfirmationModal";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import { useFetch } from "../../../../hooks/useFetch";
import PageHeader from "../../../../components/shared/PageHeader";
import { useLoading } from "../../../../hooks/useLoading";
import axiosInstance from "../../../../config/api";
import { ErrorToastProps, SuccessToastProps } from "../../../../components/shared/CustomStylings";
import AppraisalDetailList from "../../../../components/Tribe/Performance/AppraisalList/AppraisalDetailList";
import AppraisalDetailItem from "../../../../components/Tribe/Performance/AppraisalList/AppraisalDetailItem";
import AppraisalForm from "../../../../components/Tribe/Performance/Form/AppraisalForm";
import { useFormik } from "formik";

const AppraisalScreen = () => {
  const [appraisalValues, setAppraisalValues] = useState([]);
  const [employeeAppraisalValue, setEmployeeAppraisalValue] = useState([]);
  const [selectedOption, setSelectedOption] = useState(false);
  const [appraisal, setAppraisal] = useState(null);
  const [formValue, setFormValue] = useState(null);

  console.log("a", appraisal);

  const route = useRoute();
  const formScreenSheetRef = useRef(null);

  const { id } = route.params;

  const { data: appraisalSelected } = useFetch(`/hr/employee-appraisal/${id}/start`);

  const appraisalId = appraisalSelected?.data?.id;

  const { data: appraisalList } = useFetch(`/hr/employee-appraisal/${appraisalId}`);

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);

  const { isLoading: submitIsLoading, toggle: toggleSubmit } = useLoading(false);

  const openSelectedAppraisal = (data) => {
    setAppraisal(data);
    formScreenSheetRef.current?.show();
  };

  const closeSelectedAppraisal = (data) => {
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
      toggleSubmit();
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
        onChange(values);
      }
    },
    enableReinitialize: true,
  });

  const formikChangeHandler = (e, submitWithoutChange = false) => {
    if (!submitWithoutChange) {
      formik.handleChange(e);
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

  useEffect(() => {
    console.log("here", employeeAppraisalValue);
  }, [employeeAppraisalValue]);

  return (
    <>
      <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
        <View style={styles.header}>
          <PageHeader width={200} title="Employee Appraisal" backButton={true} onPress={() => toggleReturnModal()} />
          <TouchableOpacity onPress={() => submitHandler()}>
            <Text>Done</Text>
          </TouchableOpacity>
        </View>
        <AppraisalDetailList
          dayjs={dayjs}
          begin_date={appraisalList?.data?.begin_date}
          end_date={appraisalList?.data?.end_date}
          name={appraisalList?.data?.description}
          position={appraisalList?.data?.target_level}
          target={appraisalList?.data?.performance_appraisal?.target_name}
          targetLevel={appraisalList?.data?.performance_appraisal?.target_level}
        />

        <View style={styles.container}>
          <View style={{ flex: 1, paddingHorizontal: 16 }}>
            {appraisalValues &&
              appraisalValues.length > 0 &&
              appraisalValues.map((item, index) => {
                return (
                  <AppraisalDetailItem
                    key={index}
                    id={item?.performance_appraisal_value_id || item?.id}
                    description={item?.description}
                    target={item?.target}
                    type="appraisal"
                    weight={item?.weight}
                    threshold={item?.threshold}
                    measurement={item?.measurement}
                    item={item}
                    choice={item?.choice}
                    onChange={employeeAppraisalValueUpdateHandler}
                    choice_a={item?.choice_a}
                    choice_b={item?.choice_b}
                    choice_c={item?.choice_c}
                    choice_d={item?.choice_d}
                    choice_e={item?.choice_e}
                    score_a={item?.score_a}
                    score_b={item?.score_a}
                    score_c={item?.score_a}
                    score_d={item?.score_a}
                    score_e={item?.score_a}
                    selected={selectedOption}
                    setSelected={setSelectedOption}
                    handleOpen={openSelectedAppraisal}
                  />
                );
              })}
          </View>
        </View>
      </SafeAreaView>
      <ReturnConfirmationModal
        isOpen={returnModalIsOpen}
        toggle={toggleReturnModal}
        description="Are you sure want to return? Data changes will not be save."
      />
      <AppraisalForm
        reference={formScreenSheetRef}
        selected={selectedOption}
        setSelected={setSelectedOption}
        handleClose={closeSelectedAppraisal}
        description={appraisal?.description}
        choice_a={appraisal?.choice_a}
        choice_b={appraisal?.choice_b}
        choice_c={appraisal?.choice_c}
        choice_d={appraisal?.choice_d}
        choice_e={appraisal?.choice_e}
        score_a={appraisal?.score_a}
        score_b={appraisal?.score_b}
        score_c={appraisal?.score_c}
        score_d={appraisal?.score_d}
        score_e={appraisal?.score_e}
        formik={formik}
      />
    </>
  );
};

export default AppraisalScreen;

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
