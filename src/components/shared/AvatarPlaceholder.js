import React from "react";

import { Avatar } from "native-base";
import { TouchableOpacity } from "react-native";

import { useDisclosure } from "../../hooks/useDisclosure";
import UserPreviewModal from "./UserPreviewModal";

const AvatarPlaceholder = ({ image, name, email, size, borderRadius, isThumb = true, isPressable }) => {
  const { isOpen, toggle } = useDisclosure(false);

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string?.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  const userInitialGenerator = () => {
    const nameArray = name?.split(" ");
    let alias = "";

    if (nameArray?.length >= 2) {
      alias = nameArray[0][0] + nameArray[1][0];
    } else {
      alias = nameArray[0][0];
    }

    return alias;
  };

  return (
    <>
      {image ? (
        <>
          {isPressable ? (
            <TouchableOpacity onPress={() => isPressable && toggle()}>
              <Avatar
                source={{
                  uri: isThumb
                    ? `${process.env.EXPO_PUBLIC_API}/image/${image}/thumb`
                    : `${process.env.EXPO_PUBLIC_API}/image/${image}`,
                }}
                size={size || "xs"}
                bg="transparent"
              />
            </TouchableOpacity>
          ) : (
            <Avatar
              source={{
                uri: isThumb
                  ? `${process.env.EXPO_PUBLIC_API}/image/${image}/thumb`
                  : `${process.env.EXPO_PUBLIC_API}/image/${image}`,
              }}
              size={size || "xs"}
              bg="transparent"
            />
          )}
        </>
      ) : (
        <>
          {isPressable ? (
            <TouchableOpacity onPress={() => isPressable && toggle()}>
              <Avatar size={size || "xs"} bgColor={stringToColor(name)} borderRadius={borderRadius}>
                {name ? userInitialGenerator() : "KSS"}
              </Avatar>
            </TouchableOpacity>
          ) : (
            <Avatar size={size || "xs"} bgColor={stringToColor(name)} borderRadius={borderRadius}>
              {name ? userInitialGenerator() : "KSS"}
            </Avatar>
          )}
        </>
      )}

      {isOpen && <UserPreviewModal isOpen={isOpen} onClose={toggle} name={name} image={image} email={email} />}
    </>
  );
};

export default AvatarPlaceholder;
