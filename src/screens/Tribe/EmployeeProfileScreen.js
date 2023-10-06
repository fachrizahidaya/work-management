import { useNavigation } from "@react-navigation/core";

import { SafeAreaView, StyleSheet } from "react-native";
import { Avatar, Badge, Button, Flex, Icon, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../components/shared/PageHeader";
import AvatarPlaceholder from "../../components/shared/AvatarPlaceholder";
import { card } from "../../styles/Card";
import { useFetch } from "../../hooks/useFetch";

const EmployeeProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { employeeId } = route.params;

  const {} = useFetch();

  return (
    <SafeAreaView style={styles.container}>
      <Flex
        borderBottomWidth={1}
        borderBottomColor="#E8E9EB"
        flexDir="row"
        alignItems="center"
        justifyContent="space-between"
        bgColor="#FFFFFF"
        py={14}
        px={15}
      >
        <PageHeader title="" onPress={() => navigation.navigate("Feed")} />
        <Button>Chat</Button>
      </Flex>
      <Flex my={3} mx={3} flexDir="column" style={card.card}>
        <Flex alignItems="center" flexDir="row-reverse"></Flex>
        <Flex gap={3} alignItems="center">
          {/* <AvatarPlaceholder
              image={image} name={name}
            size="2xl"
            borderRadius="full"
          /> */}
          <Text fontWeight={500} fontSize={20} color="#3F434A">
            {/* {name.length > 30 ? name.split(" ")[0] : name} */}
            Jeremy Gerald
          </Text>
          <Badge borderRadius={10}>
            <Text fontWeight={400} fontSize={16} color="#20A144">
              {/* {position} */}
              Tech Staff
            </Text>
          </Badge>
          <Flex gap={1} alignItems="center" flexDir="row">
            <Text fontWeight={400} fontSize={12} color="#8A9099">
              {/* {email} */}
              @gmail
            </Text>
            <Icon
              //   onPress={() => CopyToClipboard(email)}
              as={<MaterialCommunityIcons name="content-copy" />}
              size={3}
              color="#3F434A"
            />
          </Flex>
          <Flex gap={1} alignItems="center" flexDir="row">
            <Text fontWeight={400} fontSize={12} color="#8A9099">
              {/* {phone} */}
              08111111111
            </Text>
            <Icon
              //   onPress={() => CopyToClipboard(phone)}
              as={<MaterialCommunityIcons name="content-copy" />}
              size={3}
              color="#3F434A"
            />
          </Flex>
        </Flex>
      </Flex>
    </SafeAreaView>
  );
};

export default EmployeeProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    position: "relative",
  },
});
