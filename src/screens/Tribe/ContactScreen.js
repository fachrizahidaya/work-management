import { useState, useRef, useCallback, useEffect } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import _ from "lodash";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { SafeAreaView, StyleSheet } from "react-native";
import { Box, Flex, Icon, Input, Pressable, Text } from "native-base";

import ContactList from "../../components/Tribe/Contact/ContactList";
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/shared/PageHeader";

const ContactScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  // Handler for search input
  const firstTimeRef = useRef(true);
  const dependencies = [currentPage, searchInput];

  const params = {
    page: currentPage,
    search: searchInput,
    limit: 100,
  };
  const handleSearch = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
      setCurrentPage(1);
    }, 500),
    []
  );
  const {
    data: employeeData,
    isLoading: employeeDataIsLoading,
    refetch,
  } = useFetch("/hr/employees", dependencies, params);

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
      <Flex
        borderBottomWidth={1}
        borderBottomColor="#DBDBDB"
        flexDir="row"
        alignItems="center"
        justifyContent="space-between"
        bgColor="white"
        py={14}
        px={15}
      >
        <PageHeader title="Contact" backButton={false} />
      </Flex>
      <Box backgroundColor="white" py={4} px={8}>
        <Input
          variant="unstyled"
          size="md"
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

      <Flex px={5} flex={1} flexDir="column">
        {/* Content here */}
        <FlashList
          data={employeeData?.data?.data}
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
