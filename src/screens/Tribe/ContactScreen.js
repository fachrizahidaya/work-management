import { useState, useRef, useCallback, useEffect } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import _ from "lodash";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { SafeAreaView, StyleSheet } from "react-native";
import { Box, Flex, Icon, Input, Pressable, Text } from "native-base";

import ContactList from "../../components/Tribe/Contact/ContactList";
import { useFetch } from "../../hooks/useFetch";

const ContactScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const firstTimeRef = useRef(true);
  const dependencies = [currentPage, searchInput];
  const params = {
    page: currentPage,
    search: searchInput,
    limit: 10,
  };
  const handleSearch = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
      setCurrentPage(1);
    }, 500),
    []
  );
  const { data, isLoading, refetch } = useFetch("/hr/employees", dependencies, params);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput]);

  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      refetch();
    }, [refetch])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="white" py={14} px={15}>
        <Flex flexDir="row" gap={1}>
          <Text fontSize={16}>Contact</Text>
        </Flex>
      </Flex>
      <Box backgroundColor="white" pt={4} px={4} pb={4}>
        <Input
          variant="unstyled"
          size="md"
          InputRightElement={
            <Pressable>
              <Icon as={<MaterialCommunityIcons name="tune-variant" />} size="md" mr={3} color="black" />
            </Pressable>
          }
          InputLeftElement={
            <Pressable>
              <Icon as={<MaterialCommunityIcons name="magnify" />} size="md" ml={2} color="muted.400" />
            </Pressable>
          }
          placeholder="Search contact"
          borderRadius={15}
          borderWidth={1}
          style={{ height: 40 }}
          onChangeText={(value) => handleSearch(value)}
        />
      </Box>

      <Flex px={5} flex={1} flexDir="column" gap={5} my={5}>
        {/* Content here */}
        <FlashList
          data={data?.data?.data}
          keyExtractor={(item, index) => index}
          onEndReachedThreshold={0.1}
          estimatedItemSize={200}
          renderItem={({ item }) => (
            <ContactList
              key={item?.id}
              id={item?.id}
              name={item?.name}
              position={item?.position_name}
              division={item?.division_name}
              status={item?.status}
              image={item?.image}
              phone={item?.phone_number}
              email={item?.email}
            />
          )}
        />
      </Flex>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    position: "relative",
  },
});

export default ContactScreen;
