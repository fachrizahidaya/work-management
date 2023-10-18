import { useNavigation } from "@react-navigation/native";

import { Dimensions } from "react-native";
import { Box, Text } from "native-base";

import PageHeader from "../../../../components/shared/PageHeader";
import NewReimbursementForm from "../../../../components/Tribe/Reimbursement/NewReimbursementForm";

const NewReimbursement = ({ route }) => {
  const { width, height } = Dimensions.get("window");

  const { onClose } = route.params;

  const navigation = useNavigation();

  return (
    <Box position="absolute" zIndex={3}>
      <Box w={width} height={height} bgColor="#FFFFFF" p={3}>
        <PageHeader title="New Reimbursement" onPress={() => navigation.navigate("Feed")} />
        <NewReimbursementForm />
      </Box>
    </Box>
  );
};

export default NewReimbursement;
