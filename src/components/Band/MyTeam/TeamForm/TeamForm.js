import React, { useEffect } from "react";

import { useFormik } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";

import Modal from "react-native-modal";
import { Dimensions, Platform, Text, View } from "react-native";
import Toast from "react-native-toast-message";

import FormButton from "../../../shared/FormButton";
import axiosInstance from "../../../../config/api";
import Input from "../../../shared/Forms/Input";

const TeamForm = ({ isOpen, toggle, teamData, refetch, setSelectedTeam, setSelectedTeamId }) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  const userSelector = useSelector((state) => state.auth);

  const submitTeam = async (form, setSubmitting, setStatus) => {
    try {
      let res;
      if (teamData) {
        res = await axiosInstance.patch(`/pm/teams/${teamData.id}`, form);
        setSelectedTeam({
          ...teamData,
          ...form,
          owner_id: userSelector.id,
          owner_name: userSelector.name,
        });
      } else {
        res = await axiosInstance.post("/pm/teams", form);
        setSelectedTeam({
          ...res.data.data,
          ...form,
          owner_name: userSelector.name,
        });

        setSelectedTeamId(res.data.data.id);
      }

      refetch();
      setSubmitting(false);
      setStatus("success");
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      setStatus("error");
      Toast.show({
        type: "error",
        text1: error.response.data.message,
      });
    }
  };
  const formik = useFormik({
    enableReinitialize: teamData ? true : false,
    initialValues: {
      name: teamData?.name || "",
    },
    validationSchema: yup.object().shape({
      name: yup.string().max(20, "Max 20 characters").required("Team name is required"),
    }),
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus("processing");
      submitTeam(values, setSubmitting, setStatus);
    },
  });

  useEffect(() => {
    if (!formik.isSubmitting && formik.status === "success") {
      toggle(formik.resetForm);
    }
  }, [formik.isSubmitting, formik.status]);
  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={() => !formik.isSubmitting && formik.status !== "processing" && toggle(formik.resetForm)}
      deviceHeight={deviceHeight}
      deviceWidth={deviceWidth}
    >
      <View style={{ display: "flex", gap: 10, backgroundColor: "white", padding: 20, borderRadius: 10 }}>
        <Text style={{ fontWeight: 500 }}>{teamData ? "Edit Team" : "New Team"}</Text>

        <Input formik={formik} fieldName="name" placeHolder="Input team name..." value={formik.values.name} />

        <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", gap: 5 }}>
          <FormButton
            isSubmitting={formik.isSubmitting}
            onPress={() => toggle(formik.resetForm)}
            variant="outline"
            backgroundColor="white"
            style={{ paddingHorizontal: 8 }}
          >
            <Text style={{ fontWeight: 500 }}>Cancel</Text>
          </FormButton>

          <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit} style={{ paddingHorizontal: 8 }}>
            <Text style={{ fontWeight: 500, color: "white" }}>Submit</Text>
          </FormButton>
        </View>

        <Toast position="bottom" />
      </View>
    </Modal>
  );
};

export default TeamForm;
