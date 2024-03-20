import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as yup from "yup";
import * as DocumentPicker from "expo-document-picker";

import {
  ActivityIndicator,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../../hooks/useFetch";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import axiosInstance from "../../../../config/api";
import { useLoading } from "../../../../hooks/useLoading";
import { ErrorToastProps } from "../../../../components/shared/CustomStylings";
import PageHeader from "../../../../components/shared/PageHeader";
import ReturnConfirmationModal from "../../../../components/shared/ReturnConfirmationModal";
import KPIDetailItem from "../../../../components/Tribe/Performance/KPI/KPIDetailItem";
import KPIDetailList from "../../../../components/Tribe/Performance/KPI/KPIDetailList";
import KPIForm from "../../../../components/Tribe/Performance/KPI/KPIForm";
import Button from "../../../../components/shared/Forms/Button";
import SuccessModal from "../../../../components/shared/Modal/SuccessModal";
import EmptyPlaceholder from "../../../../components/shared/EmptyPlaceholder";
import Tabs from "../../../../components/shared/Tabs";
import AttachmentForm from "../../../../components/Tribe/Performance/KPI/AttachmentForm";
import AttachmentItem from "../../../../components/Tribe/Performance/KPI/AttachmentItem";

const KPIScreen = () => {
  const [kpiValues, setKpiValues] = useState([]);
  const [employeeKpiValue, setEmployeeKpiValue] = useState([]);
  const [kpi, setKpi] = useState(null);
  const [employeeKpi, setEmployeeKpi] = useState(null);
  const [fileAttachment, setFileAttachment] = useState(null);
  const [requestType, setRequestType] = useState("");
  const [tabValue, setTabValue] = useState("KPI");
  const [attachments, setAttachments] = useState([]);
  const [currentAttachments, setCurrentAttachments] = useState([]);

  const navigation = useNavigation();
  const route = useRoute();
  const formScreenSheetRef = useRef(null);
  const formAttachmentScreenSheetRef = useRef(null);

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);
  const { isOpen: saveModalIsOpen, toggle: toggleSaveModal } = useDisclosure(false);

  const { isLoading: submitIsLoading, toggle: toggleSubmit } = useLoading(false);

  const { id } = route.params;

  const { data: kpiSelected } = useFetch(`/hr/employee-kpi/${id}/start`);
  const kpiId = kpiSelected?.data?.id;

  const { data: kpiList, refetch: refetchKpiList } = useFetch(`/hr/employee-kpi/${kpiId}`);

  /**
   * Handle selected KPI item
   * @param {*} data
   * @param {*} value
   */
  const openSelectedKpi = (data, value) => {
    setKpi(data);
    setEmployeeKpi(value);
    formScreenSheetRef.current?.show();
  };
  const closeSelectedKpi = () => {
    formScreenSheetRef.current?.hide();
  };

  const openSelectedAttachmentKpi = (data, value) => {
    formAttachmentScreenSheetRef.current?.show();
  };
  const closeSelectedAttachmentKpi = () => {
    formAttachmentScreenSheetRef.current?.hide();
  };

  const attachmentDownloadHandler = async (file_path) => {
    try {
      Linking.openURL(`${process.env.EXPO_PUBLIC_API}/download/${file_path}`, "_blank");
    } catch (err) {
      console.log(err);
    }
  };

  const tabs = useMemo(() => {
    return [
      {
        title: `KPI`,
        value: "KPI",
      },
      { title: `Attachment`, value: "Attachment" },
    ];
  }, []);

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
  }, []);

  const getEmployeeKpiValue = (employee_kpi_value) => {
    let employeeKpiValArr = [];
    employee_kpi_value.map((val) => {
      employeeKpiValArr = [
        ...employeeKpiValArr,
        {
          ...val?.performance_kpi_value,
          id: val?.id,
          performance_kpi_value_id: val?.performance_kpi_value_id,
          actual_achievement: val?.actual_achievement,
          attachment: val?.attachment,
        },
      ];
    });
    return [...employeeKpiValArr];
  };

  /**
   * Handle update value of KPI item
   * @param {*} data
   */
  const employeeKpiValueUpdateHandler = (data) => {
    setEmployeeKpiValue((prevState) => {
      let currentData = [...prevState];
      const index = currentData.findIndex((employee_kpi_val) => employee_kpi_val?.id === data?.id);
      if (index > -1) {
        currentData[index].actual_achievement = data?.actual_achievement;
      } else {
        currentData = [...currentData, data];
      }
      return [...currentData];
    });
  };

  const employeeKpiAttachmentUpdateHandler = (data, setStatus, setSubmitting) => {
    setEmployeeKpiValue((prevState) => {
      let currentData = [...prevState];
      const index = currentData.findIndex((employee_kpi_val) => employee_kpi_val?.id === data?.id);
      if (index > -1) {
        currentData[index].attachment = [...currentData[index].attachment, data.file];
      }
      return [...currentData];
    });
    setStatus("success");
    setSubmitting(false);
  };

  const employeeKpiAttachmentDeleteHandler = (employee_kpi_id, id, att_index) => {
    if (att_index > -1) {
      setEmployeeKpiValue((prevState) => {
        let currentData = [...prevState];
        const index = currentData.findIndex((employee_kpi_val) => employee_kpi_val?.id === employee_kpi_id);
        if (index > -1) {
          currentData[index].attachment.splice(att_index, 1);
          if (id) {
            currentData[index].deleted_attachment = [];
            currentData[index].deleted_attachment = [...currentData[index].deleted_attachment, id];
          }
        }
        return [...currentData];
      });
    }
  };

  /**
   * Handle array of update KPI item
   */
  const sumUpKpiValue = () => {
    setKpiValues(() => {
      const performanceKpiValue = kpiList?.data?.performance_kpi?.value;
      const employeeKpiValue = getEmployeeKpiValue(kpiList?.data?.employee_kpi_value);
      return [...employeeKpiValue, ...performanceKpiValue];
    });
  };

  const sumAttachments = () => {
    setAttachments(() => {
      let attachmentArr = [];
      employeeKpiValue.map((kpiVal) => {
        kpiVal?.attachment?.map((attVal, index) => {
          attachmentArr = [
            ...attachmentArr,
            {
              employee_kpi_id: kpiVal?.id,
              attachment_id: attVal?.id || null,
              index: index,
              description: kpiVal?.description || kpiVal?.performance_kpi_value?.description,
              file_name: attVal?.file_name || null,
              file_path: attVal?.file_path || null,
              attachment: !attVal?.file_name ? attVal : null,
            },
          ];
        });
      });
      return [...attachmentArr];
    });
  };

  const sumCurrentAttachments = () => {
    setCurrentAttachments(() => {
      let attachmentArr = [];
      kpiValues.map((kpiVal) => {
        kpiVal?.attachment?.map((attVal, index) => {
          attachmentArr = [
            ...attachmentArr,
            {
              employee_kpi_id: kpiVal?.id,
              attachment_id: attVal?.id || null,
              index: index,
              description: kpiVal?.description || kpiVal?.performance_kpi_value?.description,
              file_name: attVal?.file_name || null,
              file_path: attVal?.file_path || null,
              attachment: !attVal?.file_name ? attVal : null,
            },
          ];
        });
      });
      return [...attachmentArr];
    });
  };

  /**
   * Handle saved actual achievement value to be can saved or not
   * @param {*} kpiValues
   * @param {*} employeeKpiValue
   * @returns
   */
  const compareActualAchievement = (kpiValues, employeeKpiValue) => {
    let differences = [];

    for (let empKpi of employeeKpiValue) {
      let kpiValue = kpiValues.find((kpi) => kpi.id === empKpi.id);

      if (kpiValue && kpiValue.actual_achievement !== empKpi.actual_achievement) {
        differences.push({
          id: empKpi.id,
          difference: empKpi.actual_achievement - kpiValue.actual_achievement,
        });
      }
    }

    return differences;
  };

  let differences = compareActualAchievement(kpiValues, employeeKpiValue);

  /**
   * Handle convert integer to string for KPI
   */
  if (!kpi?.actual_achievement) {
    var actualString = null;
  } else {
    var actualString = kpi?.actual_achievement.toString();
  }

  /**
   * Handle save filled or updated KPI
   */
  const submitHandler = async () => {
    try {
      toggleSubmit();
      const formData = new FormData();
      employeeKpiValue.forEach((kpiObj, index) => {
        Object.keys(kpiObj).forEach((key) => {
          if (Array.isArray(kpiObj[key])) {
            kpiObj[key].forEach((att_obj, att_index) => {
              formData.append(`kpi_value[${index}][${key}][${att_index}]`, att_obj);
            });
          } else {
            formData.append(`kpi_value[${index}][${key}]`, kpiObj[key]);
          }
        });
      });
      formData.append("_method", "PATCH");
      const res = await axiosInstance.post(
        `/hr/employee-kpi/${kpiList?.data?.id}`,
        formData,

        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );
      toggleSaveModal();
      setRequestType("info");
      refetchKpiList();
    } catch (err) {
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
      toggleSubmit();
    } finally {
      toggleSubmit();
    }
  };

  /**
   * Handle select file for attendance attachment
   */
  const selectFileHandler = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
      });

      // Check if there is selected file
      if (result) {
        if (result.assets[0].size < 3000001) {
          setFileAttachment({
            name: result.assets[0].name,
            size: result.assets[0].size,
            type: result.assets[0].mimeType,
            uri: result.assets[0].uri,
            webkitRelativePath: "",
          });
        } else {
          Toast.show("Max file size is 3MB", ErrorToastProps);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fileChangeHandler = () => {
    if (fileAttachment) {
      formikAttachment.setFieldValue("file", fileAttachment);
    }
  };

  /**
   * Handle create kpi value
   */
  const formik = useFormik({
    initialValues: {
      id: kpi?.id,
      actual_achievement:
        // achievement || 0,
        actualString || 0,
    },
    validationSchema: yup.object().shape({
      actual_achievement: yup
        .number()
        .required("Value is required")
        .min(0, "Value should not be negative")
        .max(kpi?.target, "Value should not exceed target"),
    }),
    onSubmit: (values) => {
      if (formik.isValid) {
        if (values.actual_achievement) {
          values.actual_achievement = Number(values.actual_achievement);
        } else {
          values.actual_achievement = null;
        }
        employeeKpiValueUpdateHandler(values);
      }
    },
    enableReinitialize: true,
  });

  const formikAttachment = useFormik({
    initialValues: {
      id: "",
      file: fileAttachment || "",
    },

    onSubmit: (values, { setSubmitting, setStatus }) => {
      setSubmitting("processing");
      employeeKpiAttachmentUpdateHandler(values, setStatus, setSubmitting);
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (kpiList?.data) {
      sumUpKpiValue();
      setEmployeeKpiValue(() => {
        const employeeKpiValue = getEmployeeKpiValue(kpiList?.data?.employee_kpi_value);
        return [...employeeKpiValue];
      });
    }
  }, [kpiList?.data]);

  useEffect(() => {
    sumAttachments();
  }, [employeeKpiValue]);

  useEffect(() => {
    sumCurrentAttachments();
  }, [employeeKpiValue]);

  useEffect(() => {
    if (!formikAttachment.isSubmitting && formikAttachment.status === "success") {
      formikAttachment.resetForm();
      setFileAttachment(null);
    }
  }, [formikAttachment.isSubmitting, formikAttachment.status]);

  return (
    <>
      <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
        <View style={styles.header}>
          <PageHeader
            width={200}
            title={kpiList?.data?.performance_kpi?.review?.description}
            backButton={true}
            onPress={() => {
              if (differences.length === 0 && attachments.length === currentAttachments.length) {
                navigation.goBack();
              } else {
                toggleReturnModal();
              }
            }}
          />
          {kpiList?.data?.confirm || kpiValues?.length === 0 ? null : (
            <Button
              height={35}
              padding={10}
              onPress={() => {
                if (submitIsLoading || (differences.length === 0 && attachments.length === currentAttachments.length)) {
                  null;
                } else {
                  submitHandler();
                }
              }}
              disabled={
                submitIsLoading || (differences.length === 0 && attachments.length === currentAttachments.length)
              }
            >
              {submitIsLoading ? (
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
              )}
            </Button>
          )}
        </View>
        <KPIDetailList
          dayjs={dayjs}
          begin_date={kpiList?.data?.performance_kpi?.review?.begin_date}
          end_date={kpiList?.data?.performance_kpi?.review?.end_date}
          target={kpiList?.data?.performance_kpi?.target_name}
          target_level={kpiList?.data?.performance_kpi?.target_level}
        />

        <View style={{ paddingTop: 12, paddingHorizontal: 16 }}>
          <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />
        </View>

        <View style={styles.container}>
          {tabValue === "KPI" ? (
            <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
              {kpiValues && kpiValues.length > 0 ? (
                kpiValues.map((item, index) => {
                  const correspondingEmployeeKpi = employeeKpiValue.find((empKpi) => empKpi.id === item.id);
                  return (
                    <KPIDetailItem
                      key={index}
                      description={item?.description}
                      target={item?.target}
                      weight={item?.weight}
                      threshold={item?.threshold}
                      measurement={item?.measurement}
                      achievement={item?.actual_achievement}
                      item={item}
                      handleOpen={openSelectedKpi}
                      employeeKpiValue={correspondingEmployeeKpi}
                    />
                  );
                })
              ) : (
                <View style={styles.content}>
                  <EmptyPlaceholder height={250} width={250} text="No Data" />
                </View>
              )}
            </ScrollView>
          ) : (
            <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
              {!kpiList?.data?.confirm && (
                <TouchableOpacity
                  onPress={() => openSelectedAttachmentKpi()}
                  style={{ flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 14 }}
                >
                  <MaterialCommunityIcons name="plus" size={20} color="#304FFD" />
                  <Text style={[{ color: "#304FFD", fontWeight: "500" }]}>Add Attachment</Text>
                </TouchableOpacity>
              )}
              {attachments && attachments.length > 0 ? (
                attachments.map((item, index) => {
                  return (
                    <AttachmentItem
                      description={item?.description}
                      file_name={item?.attachment ? item?.attachment?.name : item?.file_name}
                      onDelete={employeeKpiAttachmentDeleteHandler}
                      employee_kpi_id={item?.employee_kpi_id}
                      attachment_id={item?.attachment_id}
                      index={item?.index}
                      confirmed={kpiList?.data?.confirm}
                      file_path={item?.file_path}
                      onDownload={attachmentDownloadHandler}
                    />
                  );
                })
              ) : (
                <View style={styles.content}>
                  <EmptyPlaceholder height={250} width={250} text="No Data" />
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
      <ReturnConfirmationModal
        isOpen={returnModalIsOpen}
        toggle={toggleReturnModal}
        description="Are you sure want to return? Data changes will not be save."
        onPress={() => navigation.goBack()}
      />
      <KPIForm
        reference={formScreenSheetRef}
        threshold={kpi?.threshold}
        weight={kpi?.weight}
        measurement={kpi?.measurement}
        description={kpi?.description}
        formik={formik}
        handleClose={closeSelectedKpi}
        achievement={kpi?.actual_achievement}
        target={kpi?.target}
        achievementValue={employeeKpi?.actual_achievement}
        confirmed={kpiList?.data?.confirm}
        attachment={kpi?.attachment}
        onDownload={attachmentDownloadHandler}
      />
      <AttachmentForm
        reference={formAttachmentScreenSheetRef}
        onSelectFile={selectFileHandler}
        kpiValues={employeeKpiValue}
        formik={formikAttachment}
        onChange={fileChangeHandler}
        handleClose={closeSelectedAttachmentKpi}
        fileAttachment={fileAttachment}
      />
      <SuccessModal
        isOpen={saveModalIsOpen}
        toggle={toggleSaveModal}
        type={requestType}
        title="Changes saved!"
        description="Data has successfully updated"
      />
    </>
  );
};

export default KPIScreen;

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
