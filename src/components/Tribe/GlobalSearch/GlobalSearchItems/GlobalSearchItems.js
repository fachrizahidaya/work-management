import React from "react";

import { StyleSheet, View } from "react-native";

import EmployeeSection from "../EmployeeSection/EmployeeSection";
import FeedSection from "../FeedSection/FeedSection";

const GlobalSearchItems = ({ data }) => {
  const { employee, post } = data;

  return (
    <View style={styles.flex}>
      {employee?.length > 0 && <EmployeeSection employee={employee} />}
      {post?.length > 0 && <FeedSection feed={post} />}
    </View>
  );
};

export default GlobalSearchItems;

const styles = StyleSheet.create({
  flex: {
    display: "flex",
    gap: 20,
  },
});
