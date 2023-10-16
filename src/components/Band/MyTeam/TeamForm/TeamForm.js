import React, { useEffect } from "react";

import { useFormik } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";

import { Button, FormControl, Input, Modal, Text, useToast } from "native-base";

import FormButton from "../../../shared/FormButton";
import { ErrorToast, SuccessToast } from "../../../shared/ToastDialog";
import axiosInstance from "../../../../config/api";

const TeamForm = ({ isOpen, toggle, teamData, refetch, setSelectedTeam, setSelectedTeamId }) => {
  const toast = useToast();
  const userSelector = useSelector((state) => state.auth);

  const submitTeam = async (form, setSubmitting, setStatus) => {
    try {
      let res;
      if (teamData) {
        res = await axiosInstance.patch(`/pm/teams/${teamData.id}`, form);
        setSelectedTeam({
          ...teamData,
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

      toast.show({
        render: () => {
          return <SuccessToast message={"Team Saved"} />;
        },
      });
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      setStatus("error");
      toast.show({
        render: () => {
          return <ErrorToast message={error.response.data.message} />;
        },
      });
    }
  };
  const formik = useFormik({
    enableReinitialize: teamData ? true : false,
    initialValues: {
      name: teamData?.name || "",
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Team name is required"),
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
      isOpen={isOpen}
      onClose={() => !formik.isSubmitting && formik.status !== "processing" && toggle(formik.resetForm)}
    >
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{teamData ? "Edit Team" : "New Team"}</Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormControl.Label>Team Name</FormControl.Label>
            <Input
              placeholder="Input team name..."
              value={formik.values.name}
              onChangeText={(value) => formik.setFieldValue("name", value)}
            />
          </FormControl>
        </Modal.Body>

        <Modal.Footer>
          <Button.Group space={2}>
            <FormButton
              isSubmitting={formik.isSubmitting}
              onPress={() => toggle(formik.resetForm)}
              color="transparent"
              variant="outline"
            >
              <Text>Cancel</Text>
            </FormButton>

            <FormButton isSubmitting={formik.isSubmitting} onPress={formik.handleSubmit}>
              <Text color="white">Submit</Text>
            </FormButton>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default TeamForm;
