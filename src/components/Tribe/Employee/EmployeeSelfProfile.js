import dayjs from "dayjs";

import { TouchableOpacity } from "react-native";
import { Box, Flex, Icon, Image, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { CopyToClipboard } from "../../shared/CopyToClipboard";

const EmployeeSelfProfile = ({ employee, toggleTeammates, teammates }) => {
  return (
    <>
      <Image
        source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${employee?.data?.image}` }}
        resizeMethod="contain"
        borderRadius="full"
        w={100}
        h={100}
        alt="profile image"
        borderWidth={2}
        borderColor="#FFFFFF"
        position="relative"
        bottom="50px"
      />
      <Flex mt="-40px">
        <Flex gap={3} pb={3}>
          <Box>
            <Flex gap={1} alignItems="center" flexDir="row">
              <Text fontWeight={500} fontSize={20} color="#3F434A">
                {employee?.data?.name.length > 30 ? employee?.data?.name.split(" ")[0] : employee?.data?.name}
              </Text>
              <Text fontWeight={400} fontSize={14} color="#8A9099">
                {`(${employee?.data?.gender.charAt(0).toUpperCase() + employee?.data?.gender.slice(1)})`}
              </Text>
            </Flex>

            <Text fontWeight={400} fontSize={14} color="#8A9099">
              {employee?.data?.position_name}
            </Text>
          </Box>
          <Box>
            <Flex gap={1} alignItems="center" flexDir="row">
              <Icon as={<MaterialCommunityIcons name="phone-outline" />} size={3} color="#3F434A" />
              <TouchableOpacity onPress={() => CopyToClipboard(employee?.data?.phone_number)}>
                <Text fontWeight={400} fontSize={12} color="#8A9099">
                  {employee?.data?.phone_number}
                </Text>
              </TouchableOpacity>
            </Flex>
            <Flex gap={1} alignItems="center" flexDir="row">
              <Icon as={<MaterialCommunityIcons name="cake-variant-outline" />} size={3} color="#3F434A" />
              <Text fontWeight={400} fontSize={12} color="#8A9099">
                {dayjs(employee?.data?.birthdate).format("DD MMM YYYY")}
              </Text>
            </Flex>
          </Box>
          <Flex gap={1} alignItems="center" flexDir="row">
            <Text>{teammates?.data.length}</Text>
            <TouchableOpacity onPress={toggleTeammates}>
              <Text fontWeight={400} fontSize={12} color="#8A9099">
                Teammates
              </Text>
            </TouchableOpacity>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default EmployeeSelfProfile;
