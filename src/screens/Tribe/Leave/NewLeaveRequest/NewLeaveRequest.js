import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import { Dimensions } from "react-native";
import { Box, Flex, Skeleton, Spinner, Text, VStack, useToast } from "native-base";

import PageHeader from "../../../../components/shared/PageHeader";
import axiosInstance from "../../../../config/api";
import { useFetch } from "../../../../hooks/useFetch";
import { ErrorToast, SuccessToast } from "../../../../components/shared/ToastDialog";
import NewLeaveRequestForm from "../../../../components/Tribe/Leave/NewLeaveRequestForm";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import ReturnConfirmationModal from "../../../../components/shared/ReturnConfirmationModal";

const NewLeaveRequest = ({ route }) => {
  const [availableLeaves, setAvailableLeaves] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const { width, height } = Dimensions.get("window");

  const { employeeId } = route.params;

  const { isOpen: returnModalIsOpen, toggle: toggleReturnModal } = useDisclosure(false);

  const toast = useToast();

  const navigation = useNavigation();

  const {
    data: leaveHistory,
    refetch: refetchLeaveHistory,
    isFetching: leaveHistoryIsFetching,
  } = useFetch(`/hr/employee-leaves/employee/${employeeId}`);

  /**
   * Calculate available leave quota and day-off
   */
  const filterAvailableLeaveHistory = () => {
    let availableLeave = [];
    leaveHistory?.data.map((item) => {
      if (item?.active) {
        const index = availableLeave.findIndex((leave) => leave?.leave_name === item?.name); // Fix: use item?.name instead of leaveHistory?.name
        if (availableLeave.length > 0 && index > -1) {
          availableLeave[index].quota += item?.quota;
        } else {
          availableLeave.push({ leave_name: item?.leave_name, quota: item?.quota });
        }
      }
    });

    if (availableLeave.length > 0) {
      setAvailableLeaves(availableLeave);
    }
  };

  /**
   * Submit leave request handler
   * @param {*} form
   * @param {*} setSubmitting
   * @param {*} setStatus
   */

  const leaveRequestAddHandler = async (form, setSubmitting, setStatus) => {
    try {
      const res = await axiosInstance.post(`/hr/leave-requests`, form);
      refetchLeaveHistory();
      setSubmitting(false);
      setStatus("success");
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message={`Request Created`} close={() => toast.close(id)} />;
        },
      });
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      setStatus("error");
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={`Creating failed,${err.response.data.message}`} close={() => toast.close(id)} />;
        },
      });
    }
  };

  useEffect(() => {
    filterAvailableLeaveHistory();
  }, [leaveHistory?.data]);

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 100);
  }, []);

  return (
    <Box>
      {isReady ? (
        <Box w={width} height={height} bgColor="#FFFFFF" p={3}>
          <PageHeader
            title="New Leave Request"
            onPress={
              () =>
                // formik.values.leave_id || formik.values.reason || formik.values.begin_date || formik.values.end_date
                //   ? !formik.isSubmitting && formik.status !== "processing" && toggleReturnModal
                //   : () => {
                // !formik.isSubmitting && formik.status !== "processing" && formik.resetForm();
                navigation.goBack()
              // }
            }
          />

          <ReturnConfirmationModal
            isOpen={returnModalIsOpen}
            toggle={toggleReturnModal}
            onPress={() => {
              toggleReturnModal();
              navigation.navigate("Dashboard");
            }}
            description="Are you sure want to exit? It will be deleted"
          />

          <Flex alignItems="center" justifyContent="center" gap={3} flexDir="row" my={3}>
            {leaveHistoryIsFetching ? (
              <VStack space={2} alignItems="center">
                <Skeleton h={41} w={10} />
                <Skeleton h={5} w={100} />
              </VStack>
            ) : (
              availableLeaves?.map((item, index) => {
                return (
                  <Box key={index} alignItems="center" justifyContent="center" gap={2}>
                    <Text fontWeight={500} fontSize={20}>
                      {item.quota}
                    </Text>
                    <Text width={20} height={10} fontWeight={400} fontSize={12} color="#8A9099" textAlign="center">
                      {item.leave_name}
                    </Text>
                  </Box>
                );
              })
            )}
          </Flex>

          <NewLeaveRequestForm toast={toast} onSubmit={leaveRequestAddHandler} />
        </Box>
      ) : null}
    </Box>
  );
};

export default NewLeaveRequest;
