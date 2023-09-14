import React, { memo, useEffect, useState } from "react";

import { StyleSheet } from "react-native";
import { Center, Flex, Icon, Pressable, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

/**
 * @param {Object} data - The data object containing pagination information.
 * @param {function} setCurrentPage - Function to set the current page.
 * @param {number} currentPage - The current page number.
 */
const Pagination = ({ data, setCurrentPage, currentPage }) => {
  // State to store pagination array
  const [pagination, setPagination] = useState([]);

  // Generate pagination array based on data and current page
  const paginationHandler = () => {
    const totalPage = data.data.last_page;
    let arrayPage = [];

    if (totalPage > 5) {
      if (currentPage > 1) {
        arrayPage.push(1);
        arrayPage.push("...");
      }

      arrayPage.push(currentPage);

      if (currentPage < totalPage) {
        arrayPage.push("...");
        arrayPage.push(totalPage);
      }
    } else {
      for (let i = 1; i <= totalPage; i++) {
        arrayPage.push(i);
      }
    }

    setPagination(arrayPage);
  };

  // Update pagination array when data changes
  useEffect(() => {
    paginationHandler();
  }, [data]);
  return (
    <Center>
      <Flex flexDir="row" gap={1}>
        {/* Previous page button */}
        <Pressable
          style={styles.page}
          onPress={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          background="#176688"
        >
          <Icon as={<MaterialCommunityIcons name="chevron-left" />} color="white" size="md" />
        </Pressable>

        {/* Page number buttons */}
        {pagination.map((page, idx) => {
          return (
            <Pressable
              style={styles.page}
              key={idx}
              onPress={() => (page !== "..." ? setCurrentPage(page) : null)}
              background={currentPage === page ? "#FAFAFA" : "#176688"}
              borderWidth={1}
              borderColor={currentPage === page ? "#FAFAFA" : "#176688"}
            >
              <Text fontSize={14} color={currentPage === page ? "#176688" : "white"}>
                {page}
              </Text>
            </Pressable>
          );
        })}

        {/* Next page button */}
        <Pressable
          style={styles.page}
          onPress={() => pagination.length > 1 && setCurrentPage(currentPage + 1)}
          background="#176688"
        >
          <Icon as={<MaterialCommunityIcons name="chevron-right" />} color="white" size="md" />
        </Pressable>
      </Flex>
    </Center>
  );
};

const styles = StyleSheet.create({
  page: {
    borderRadius: 10,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(Pagination);
