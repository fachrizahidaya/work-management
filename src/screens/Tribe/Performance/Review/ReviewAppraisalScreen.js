import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFormik } from "formik";

import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-root-toast";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import ReturnConfirmationModal from "../../../../components/shared/ReturnConfirmationModal";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import { useLoading } from "../../../../hooks/useLoading";
import ReviewAppraisalDetailList from "../../../../components/Tribe/Performance/ReviewList/ReviewAppraisalDetailList";
import ReviewAppraisalDetailItem from "../../../../components/Tribe/Performance/ReviewList/ReviewAppraisalDetailItem";
import PageHeader from "../../../../components/shared/PageHeader";
import { useFetch } from "../../../../hooks/useFetch";
import axiosInstance from "../../../../config/api";
import AppraisalReviewForm from "../../../../components/Tribe/Performance/Form/AppraisalReviewForm";
import {
  ErrorToastProps,
  SuccessToastProps,
} from "../../../../components/shared/CustomStylings";
import Button from "../../../../components/shared/Forms/Button";
import SuccessModal from "../../../../components/shared/Modal/SuccessModal";
import ConfirmationModal from "../../../../components/shared/ConfirmationModal";
import EmptyPlaceholder from "../../../../components/shared/EmptyPlaceholder";

const ReviewAppraisalScreen = () => {
  const [appraisalValues, setAppraisalValues] = useState([]);
  const [employeeAppraisalValue, setEmployeeAppraisalValue] = useState([]);
  const [appraisal, setAppraisal] = useState(null);
  const [formValue, setFormValue] = useState(null);
  const [employeeAppraisal, setEmployeeAppraisal] = useState(null);

  const navigation = useNavigation();
  const formScreenSheetRef = useRef(null);
  const route = useRoute();

  const { id } = route.params;

  const {
    data: appraisalList,
    isFetching: appraisalListIsFetching,
    refetch: refetchAppraisalList,
  } = useFetch(`/hr/employee-review/appraisal/${id}`);

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } =
    useDisclosure(false);
  const { isOpen: saveModalIsOpen, toggle: toggleSaveModal } =
    useDisclosure(false);
  const { isOpen: confirmationModalIsOpen, toggle: toggleConfirmationModal } =
    useDisclosure(false);
  const { isOpen: confirmedModalIsOpen, toggle: toggleConfirmedModal } =
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
            supervisor_choice: val?.supervisor_choice,
            employee_choice: val?.choice,
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
        currentData[index].supervisor_choice = data?.supervisor_choice;
      } else {
        currentData = [...currentData, data];
      }
      return [...currentData];
    });
  };

  const sumUpAppraisalValue = () => {
    setAppraisalValues(() => {
      // const performanceAppraisalValue = appraisalList?.data?.performance_appraisal?.value;
      const employeeAppraisalValue = getEmployeeAppraisalValue(
        appraisalList?.data?.employee_appraisal_value
      );
      return [
        ...employeeAppraisalValue,
        // ...performanceAppraisalValue
      ];
    });
  };

  const submitHandler = async () => {
    try {
      toggleSubmit();
      const res = await axiosInstance.patch(
        `/hr/employee-review/appraisal/${appraisalList?.data?.id}`,
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
      supervisor_choice: appraisal?.supervisor_choice || "",
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
      formik.handleChange("supervisor_choice", e);
    }
    setFormValue(formik.values);
  };

  function compareActualChoice(appraisalValues, employeeAppraisalValue) {
    let differences = [];

    for (let empAppraisal of employeeAppraisalValue) {
      let appraisalValue = appraisalValues.find(
        (appraisal) => appraisal.id === empAppraisal.id
      );

      if (
        appraisalValue &&
        appraisalValue.supervisor_choice !== empAppraisal.supervisor_choice
      ) {
        differences.push({
          id: empAppraisal.id,
          difference: [
            empAppraisal.supervisor_choice,
            appraisalValue.supervisor_choice,
          ],
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
            title="Appraisal Review"
            backButton={true}
            onPress={() => {
              if (differences.length === 0) {
                navigation.goBack();
              } else {
                toggleReturnModal();
              }
            }}
          />
          {appraisalValues.length === 0 ||
          appraisalList?.data?.confirm ? null : (
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
        {appraisalValues.length > 0 ? (
          <Pressable
            style={styles.confirmIcon}
            onPress={toggleConfirmationModal}
          >
            <MaterialCommunityIcons name="check" size={30} color="#FFFFFF" />
          </Pressable>
        ) : null}
        <ReviewAppraisalDetailList
          dayjs={dayjs}
          begin_date={
            appraisalList?.data?.performance_appraisal?.review?.begin_date
          }
          end_date={
            appraisalList?.data?.performance_appraisal?.review?.end_date
          }
          target={appraisalList?.data?.performance_appraisal?.target_name}
          name={appraisalList?.data?.employee?.name}
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
                  <ReviewAppraisalDetailItem
                    key={index}
                    item={item}
                    id={item?.id}
                    description={item?.description}
                    onChange={employeeAppraisalValueUpdateHandler}
                    handleOpen={openSelectedAppraisal}
                    choice_a={item?.choice_a}
                    choice_b={item?.choice_b}
                    choice_c={item?.choice_c}
                    choice_d={item?.choice_d}
                    choice_e={item?.choice_e}
                    choice={item?.supervisor_choice}
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
      <AppraisalReviewForm
        reference={formScreenSheetRef}
        handleClose={closeSelectedAppraisal}
        description={appraisal?.description}
        choice_a={appraisal?.choice_a}
        choice_b={appraisal?.choice_b}
        choice_c={appraisal?.choice_c}
        choice_d={appraisal?.choice_d}
        choice_e={appraisal?.choice_e}
        formik={formik}
        choice={appraisal?.supervisor_choice}
        choiceValue={employeeAppraisal?.supervisor_choice}
        employee_choice={appraisal?.employee_choice}
      />
      <ConfirmationModal
        isOpen={confirmationModalIsOpen}
        toggle={toggleConfirmationModal}
        isGet={true}
        isDelete={false}
        isPatch={false}
        apiUrl={`/hr/employee-review/appraisal/${id}/finish`}
        color="#377893"
        hasSuccessFunc={true}
        onSuccess={() => {
          toggleConfirmedModal();
          navigation.goBack();
        }}
        description="Are you sure want to confirm this review?"
        successMessage="Review confirmed"
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
      <SuccessModal
        isOpen={confirmedModalIsOpen}
        toggle={toggleConfirmedModal}
        topElement={
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "#CFCFCF", fontSize: 16, fontWeight: "500" }}>
              Report{" "}
            </Text>
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "500" }}>
              submitted!
            </Text>
          </View>
        }
        bottomElement={
          <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "400" }}>
            Your report is logged
          </Text>
        }
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
  confirmIcon: {
    backgroundColor: "#377893",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 50,
    right: 15,
    zIndex: 2,
    borderRadius: 30,
    shadowOffset: 0,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  content: {
    marginTop: 20,
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
