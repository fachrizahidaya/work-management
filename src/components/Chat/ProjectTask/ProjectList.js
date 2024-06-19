import { Image, Text, View } from "react-native";

import { FlashList } from "@shopify/flash-list";

import ProjectItem from "./ProjectItem";
import { TextProps } from "../../shared/CustomStylings";

const ProjectList = ({
  data,
  isPinned,
  active_member,
  type,
  email,
  position,
  image,
  name,
  userId,
  roomId,
  setBandAttachment,
  setBandAttachmentType,
  navigation,
}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FAFAFA",
        borderRadius: 10,
        gap: 5,
        marginVertical: 10,
        marginHorizontal: 16,
      }}
    >
      {data?.length > 0 ? (
        <FlashList
          data={data}
          estimatedItemSize={100}
          keyExtractor={(item, index) => index}
          onEndReachedThreshold={0.1}
          renderItem={({ item, index }) => (
            <>
              <ProjectItem
                key={index}
                setBandAttachment={setBandAttachment}
                setBandAttachmentType={setBandAttachmentType}
                userId={userId}
                roomId={roomId}
                name={name}
                image={image}
                position={position}
                email={email}
                type={type}
                active_member={active_member}
                isPinned={isPinned}
                title={item?.title}
                deadline={item?.deadline}
                owner_image={item?.owner?.image}
                owner_name={item?.owner?.name}
                navigation={navigation}
                id={item?.id}
                item={item}
              />
            </>
          )}
        />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
            borderRadius: 10,
            gap: 5,
            padding: 5,
          }}
        >
          <View style={{ alignItems: "center", justifyContent: "center", gap: 5 }}>
            {/* <Image
              source={require("../../../assets/vectors/empty.png")}
              alt="task"
              style={{
                width: 180,
                height: 150,
                resizeMode: "cover",
              }}
            /> */}
            <Text style={[{ fontSize: 12 }, TextProps]}>No Task</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ProjectList;
