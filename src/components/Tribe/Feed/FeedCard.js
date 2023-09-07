import { Avatar, Box, Flex, Image, Text, ScrollView, Skeleton, Icon, Pressable } from "native-base";
import { Dimensions } from "react-native";
import { card } from "../../../styles/Card";
import { useSelector } from "react-redux";
import { FlashList } from "@shopify/flash-list";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import FeedCardItem from "./FeedCardItem";

const FeedCard = ({ feeds, feedIsLoading, loggedEmployeeId, loggedEmployeeImage, onToggleLike, postFetchDone }) => {
  return (
    <>
      {!feedIsLoading ? (
        <>
          <ScrollView flex={3} showsVerticalScrollIndicator={false} bounces={false}>
            <FlashList
              data={feeds}
              onEndReachedThreshold={0.1}
              keyExtractor={(item) => item.id.toString()}
              estimatedItemSize={200}
              renderItem={({ item }) => (
                <FeedCardItem
                  key={item?.id}
                  loggedEmployeeId={loggedEmployeeId}
                  loggedEmployeeImage={loggedEmployeeImage}
                  onToggleLike={onToggleLike}
                  post={item}
                  id={item?.id}
                  employee_name={item?.employee_name}
                  created_at={item?.created_at}
                  employee_image={item?.employee_image}
                  content={item?.content}
                  total_like={item?.total_like}
                  total_comment={item?.total_comment}
                  liked_by={item?.liked_by}
                />
              )}
            />
          </ScrollView>
        </>
      ) : (
        <Skeleton h={40} />
      )}
    </>
  );
};

export default FeedCard;
