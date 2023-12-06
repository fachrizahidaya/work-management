import { Badge, Flex, Icon, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { card } from "../../../../styles/Card";
import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";
import dayjs from "dayjs";
import FormButton from "../../../shared/FormButton";

const TeamLeaveRequestItem = ({
  id,
  employee_image,
  employee_name,
  leave_name,
  days,
  begin_date,
  end_date,
  responseHandler,
  isSubmitting,
  formik,
  item,
  status,
}) => {
  return (
    <Flex key={id} my={2} flexDir="column" style={card.card} gap={1}>
      <Flex flexDir="row" justifyContent="space-between" alignItems="center">
        <Flex gap={2} flex={1} flexDir="row">
          <AvatarPlaceholder
            image={employee_image}
            name={employee_name}
            size="xs"
            borderRadius="full"
            isThumb={false}
          />
          <Flex flexDir="row" alignItems="center">
            <Text fontWeight={500} fontSize={14} color="#3F434A">
              {leave_name}
            </Text>{" "}
            |{" "}
            <Text fontWeight={500} fontSize={14} color="#377893">
              {employee_name}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex flexDir="row" justifyContent="space-between" alignItems="center">
        <Flex flex={1}>
          <Text color="#595F69" fontSize={12} fontWeight={400}>
            {item?.reason}
          </Text>
        </Flex>
        <Badge borderRadius={10} w={20}>
          <Flex gap={2} flexDir="row">
            <Icon as={<MaterialCommunityIcons name="clock-outline" />} size={5} color="#186688" />
            {days > 1 ? `${days} days` : `${days} day`}
          </Flex>
        </Badge>
      </Flex>
      <Flex flexDir="row" justifyContent="space-between" alignItems="center">
        <Text color="#595F69" fontSize={12} fontWeight={400}>
          {dayjs(begin_date).format("DD.MM.YYYY")} - {dayjs(end_date).format("DD.MM.YYYY")}
        </Text>
        {status === "Pending" ? (
          <Flex gap={1} flexDir="row">
            <FormButton
              onPress={() => responseHandler("Rejected", item)}
              isSubmitting={isSubmitting === "Rejected" ? formik.isSubmitting : null}
              size="xs"
              color="red.500"
              fontColor="white"
            >
              Decline
            </FormButton>
            <FormButton
              onPress={() => responseHandler("Approved", item)}
              isSubmitting={isSubmitting === "Approved" ? formik.isSubmitting : null}
              size="xs"
              bgColor="#377893"
              fontColor="white"
            >
              Approve
            </FormButton>
          </Flex>
        ) : (
          <Text color={"#FF6262"}>{item?.status}</Text>
        )}
      </Flex>
    </Flex>
  );
};

export default TeamLeaveRequestItem;
