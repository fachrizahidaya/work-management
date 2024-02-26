import React, { useEffect, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { useFormik } from "formik";

import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { ScrollView } from "react-native-gesture-handler";

import ReturnConfirmationModal from "../../../../components/shared/ReturnConfirmationModal";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import { useFetch } from "../../../../hooks/useFetch";
import PageHeader from "../../../../components/shared/PageHeader";
import { useLoading } from "../../../../hooks/useLoading";
import axiosInstance from "../../../../config/api";
import {
  ErrorToastProps,
  SuccessToastProps,
} from "../../../../components/shared/CustomStylings";
import AppraisalDetailList from "../../../../components/Tribe/Performance/AppraisalList/AppraisalDetailList";
import AppraisalDetailItem from "../../../../components/Tribe/Performance/AppraisalList/AppraisalDetailItem";
import AppraisalForm from "../../../../components/Tribe/Performance/Form/AppraisalForm";
import Button from "../../../../components/shared/Forms/Button";
import SuccessModal from "../../../../components/shared/Modal/SuccessModal";
import EmptyPlaceholder from "../../../../components/shared/EmptyPlaceholder";

const AppraisalScreen = () => {
  const [appraisalValues, setAppraisalValues] = useState([]);
  const [employeeAppraisalValue, setEmployeeAppraisalValue] = useState([]);
  const [appraisal, setAppraisal] = useState(null);
  const [formValue, setFormValue] = useState(null);
  const [employeeAppraisal, setEmployeeAppraisal] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();
  const formScreenSheetRef = useRef(null);

  const { id, isExpired } = route.params;

  const { data: appraisalSelected } = useFetch(
    `/hr/employee-appraisal/${id}/start`
  );

  const appraisalId = appraisalSelected?.data?.id;

  const { data: appraisalList, refetch: refetchAppraisalList } = useFetch(
    `/hr/employee-appraisal/${appraisalId}`
  );

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } =
    useDisclosure(false);
  const { isOpen: saveModalIsOpen, toggle: toggleSaveModal } =
    useDisclosure(false);

  const { isLoading: submitIsLoading, toggle: toggleSubmit } =
    useLoading(false);

  const openSelectedAppraisal = (data, value) => {
    setAppraisal(data);
    setEmployeeAppraisal(value);
    formScreenSheetRef.current?.show();
  };

  const closeSelectedAppraisal = () => {
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
          employee_appraisal_val?.performance_appraisal_value_id ===
          data?.performance_appraisal_value_id
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
      const performanceAppraisalValue =
        appraisalList?.data?.performance_appraisal?.value;
      const employeeAppraisalValue = getEmployeeAppraisalValue(
        appraisalList?.data?.employee_appraisal_value
      );
      return [...employeeAppraisalValue, ...performanceAppraisalValue];
    });
  };

  const submitHandler = async () => {
    try {
      toggleSubmit();
      const res = await axiosInstance.patch(
        `/hr/employee-appraisal/${appraisalList?.data?.id}`,
        {
          appraisal_value: employeeAppraisalValue,
        }
      );
      toggleSaveModal();
      // Toast.show("Data saved!", SuccessToastProps);
      refetchAppraisalList();
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
      performance_appraisal_value_id:
        appraisal?.performance_appraisal_value_id || appraisal?.id,
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

  function compareActualChoice(appraisalValues, employeeAppraisalValue) {
    let differences = [];

    for (let empAppraisal of employeeAppraisalValue) {
      let appraisalValue = appraisalValues.find(
        (appraisal) => appraisal.id === empAppraisal.id
      );

      if (appraisalValue && appraisalValue.choice !== empAppraisal.choice) {
        differences.push({
          id: empAppraisal.id,
          difference: [empAppraisal.choice, appraisalValue.choice],
        });
      }
    }

    return differences;
  }

  let differences = compareActualChoice(
    appraisalValues,
    employeeAppraisalValue
  );

  useEffect(() => {
    if (formValue) {
      formik.handleSubmit();
    }
  }, [formValue]);

  useEffect(() => {
    if (appraisalList?.data) {
      sumUpAppraisalValue();
      setEmployeeAppraisalValue(() => {
        const employeeAppraisalValue = getEmployeeAppraisalValue(
          appraisalList?.data?.employee_appraisal_value
        );
        return [...employeeAppraisalValue];
      });
    }
  }, [appraisalList?.data]);

  return (
    <>
      <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
        <View style={styles.header}>
          <PageHeader
            width={200}
            title={
              appraisalList?.data?.performance_appraisal?.review?.description
            }
            backButton={true}
            onPress={() => {
              if (differences.length === 0) {
                navigation.goBack();
              } else {
                toggleReturnModal();
              }
            }}
          />
          {isExpired || appraisalValues.length === 0 ? null : (
            <Button
              height={35}
              padding={10}
              children={
                submitIsLoading ? (
                  <ActivityIndicator />
                ) : (
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "500",
                      color: "#FFFFFF",
                    }}
                  >
                    Save
                  </Text>
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
          )}
        </View>
        <AppraisalDetailList
          dayjs={dayjs}
          begin_date={appraisalList?.data?.begin_date}
          end_date={appraisalList?.data?.end_date}
          name={appraisalList?.data?.description}
          target={appraisalList?.data?.performance_appraisal?.target_name}
          isExpired={isExpired}
        />

        <View style={styles.container}>
          <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
            {appraisalValues && appraisalValues.length > 0 ? (
              appraisalValues.map((item, index) => {
                const correspondingEmployeeAppraisal =
                  employeeAppraisalValue.find(
                    (empAppraisal) => empAppraisal.id === item.id
                  );
                return (
                  <AppraisalDetailItem
                    key={index}
                    id={item?.performance_appraisal_value_id || item?.id}
                    description={item?.description}
                    item={item}
                    choice={item?.choice}
                    onChange={employeeAppraisalValueUpdateHandler}
                    choice_a={item?.choice_a}
                    choice_b={item?.choice_b}
                    choice_c={item?.choice_c}
                    choice_d={item?.choice_d}
                    choice_e={item?.choice_e}
                    handleOpen={openSelectedAppraisal}
                    employeeAppraisalValue={correspondingEmployeeAppraisal}
                  />
                );
              })
            ) : (
              <View style={styles.content}>
                <EmptyPlaceholder height={250} width={250} text="No Data" />
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
      <ReturnConfirmationModal
        isOpen={returnModalIsOpen}
        toggle={toggleReturnModal}
        description="Are you sure want to return? Data changes will not be save."
        onPress={() => navigation.goBack()}
      />
      <AppraisalForm
        reference={formScreenSheetRef}
        handleClose={closeSelectedAppraisal}
        description={appraisal?.description}
        choice_a={appraisal?.choice_a}
        choice_b={appraisal?.choice_b}
        choice_c={appraisal?.choice_c}
        choice_d={appraisal?.choice_d}
        choice_e={appraisal?.choice_e}
        formik={formik}
        choice={appraisal?.choice}
        choiceValue={employeeAppraisal?.choice}
      />
      <SuccessModal
        isOpen={saveModalIsOpen}
        toggle={toggleSaveModal}
        topElement={
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "#CFCFCF", fontSize: 16, fontWeight: "500" }}>
              Changes{" "}
            </Text>
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "500" }}>
              saved!
            </Text>
          </View>
        }
        bottomElement={
          <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "400" }}>
            Data has successfully updated
          </Text>
        }
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
  content: {
    marginTop: 20,
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
