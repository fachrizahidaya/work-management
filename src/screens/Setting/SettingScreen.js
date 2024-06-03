import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";

import { useSelector } from "react-redux";

import { ScrollView } from "react-native-gesture-handler";
import { TouchableOpacity, StyleSheet, SafeAreaView, View, Text } from "react-native";
import { Skeleton } from "moti/skeleton";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../components/shared/PageHeader";
import { useFetch } from "../../hooks/useFetch";
import AvatarPlaceholder from "../../components/shared/AvatarPlaceholder";
import FormButton from "../../components/shared/FormButton";
import { SkeletonCommonProps, TextProps } from "../../components/shared/CustomStylings";

const SettingScreen = () => {
  const navigation = useNavigation();
  const appVersion = Constants.expoConfig.version;
  const userSelector = useSelector((state) => state.auth);
  const { data: team, isLoading: teamIsLoading } = useFetch("/hr/my-team");
  const { data: myProfile } = useFetch("/hr/my-profile"); // for other user data, use myProfile

  const moreTeamMember = team?.data.length - 17;
  const first = [
    {
      icons: "lock-outline",
      title: "Passwords",
      color: "#FF965D",
      screen: "Change Password",
    },
    // {
    //   icons: "alert-octagon-outline",
    //   title: "Privacy and security",
    //   color: "#FF6262",
    // },
    // {
    //   icons: "bell-outline",
    //   title: "Notifications",
    //   color: "#5B5D6E",
    // },
  ];

  const second = [
    // {
    //   icons: "folder-move-outline",
    //   title: "Data usage and media quality",
    //   color: "#5E74EA",
    // },
    // {
    //   icons: "swap-vertical",
    //   title: "Server status",
    //   color: "#69E86E",
    // },
    // {
    //   icons: "cellphone",
    //   title: "iOS guide",
    //   color: "#000000",
    // },
    {
      icons: "forum",
      title: "FAQs",
      color: "#176688",
      screen: "FAQ",
    },
    {
      icons: null,
      title: "Privacy Policy",
      color: null,
      screen: "Privacy Policy",
    },
    // {
    //   icons: null,
    //   title: "Terms and Conditions",
    //   color: null,
    //   screen: "Terms Conditions",
    // },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            display: "flex",
            gap: 15,
            marginHorizontal: 16,
            marginVertical: 13,
            flex: 1,
          }}
        >
          <PageHeader backButton={true} title="Settings" onPress={() => navigation.goBack()} />

          <View style={{ backgroundColor: "#FAFAFA", borderRadius: 9 }}>
            <TouchableOpacity onPress={() => navigation.navigate("Account Screen", { profile: myProfile })}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 8,
                }}
              >
                <View>
                  <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                    <AvatarPlaceholder name={userSelector.name} image={userSelector.image} size="md" isThumb={false} />
                    <View>
                      <Text style={[{ fontSize: 20, fontWeight: 700 }, TextProps]}>
                        {userSelector.name.length > 30 ? userSelector.name.split(" ")[0] : userSelector.name}
                      </Text>
                      {myProfile?.data && (
                        <Text style={TextProps}>{myProfile.data.position_name || "You have no position"}</Text>
                      )}
                    </View>
                  </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" color="#3F434A" size={20} />
              </View>
            </TouchableOpacity>

            <View style={styles.item}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {team?.data?.length > 0 &&
                  (!teamIsLoading ? (
                    <>
                      {team?.data.slice(0, 17).map((item, index) => (
                        <AvatarPlaceholder
                          key={item.id}
                          image={item.image}
                          name={item.name}
                          style={{
                            marginLeft: index === 0 ? 0 : -12,
                          }}
                          size="xs"
                        />
                      ))}
                      {team?.data.length > 17 && (
                        <AvatarPlaceholder
                          key="more"
                          name={`+${moreTeamMember.toString()}`}
                          style={{
                            marginLeft: -12,
                          }}
                          size="xs"
                        />
                      )}
                    </>
                  ) : (
                    <Skeleton height={30} width={100} radius="round" {...SkeletonCommonProps} />
                  ))}

                {myProfile?.data && <Text style={TextProps}>{myProfile.data.division_name || "You have no team"}</Text>}
              </View>
              {/* <MaterialCommunityIcons name="chevron-right" color="#3F434A" size={20} /> */}
            </View>
          </View>

          <View style={{ backgroundColor: "#FAFAFA", borderRadius: 9 }}>
            {first.map((item) => {
              return (
                <TouchableOpacity
                  key={item.title}
                  style={[styles.item, { opacity: item.screen ? 1 : 0.5 }]}
                  onPress={() => item.screen && navigation.navigate(item.screen)}
                >
                  <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View style={{ backgroundColor: item.color, padding: 1, borderRadius: 4 }}>
                      <MaterialCommunityIcons name={item.icons} color="white" size={20} />
                    </View>
                    <Text style={TextProps}>{item.title}</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" color="#3F434A" size={20} />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* <TouchableOpacity style={styles.item}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ backgroundColor: "#8B63E7", padding: 1, borderRadius: 4 }}>
                <MaterialCommunityIcons name="link-variant" color="white" size={20} />
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
                <Text style={{ fontWeight: "bold", color: "#176688" }}>KSS</Text>
                <Text style={TextProps}>integrations</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" color="#3F434A" size={20} />
          </TouchableOpacity> */}

          {/* <TouchableOpacity style={styles.item}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ backgroundColor: "#B5B5B5", padding: 1, borderRadius: 4 }}>
                <MaterialCommunityIcons name="view-grid-outline" color="white" size={20} />
              </View>
              <Text style={TextProps}>Personal dashboard</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" color="#3F434A" size={20} />
          </TouchableOpacity> */}

          <View
            style={{
              backgroundColor: "#FAFAFA",
              borderRadius: 9,
            }}
          >
            {second.map((item) => {
              return (
                <TouchableOpacity
                  style={[styles.item, { opacity: item.screen ? 1 : 0.5 }]}
                  key={item.title}
                  onPress={() => item.screen && navigation.navigate(item.screen)}
                >
                  <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View style={{ backgroundColor: item.color, padding: 1, borderRadius: 4 }}>
                      <MaterialCommunityIcons name={item.icons} size={20} color="white" />
                    </View>
                    <Text style={TextProps}>{item.title}</Text>
                  </View>
                  {item.title === "Server status" ? (
                    <Text style={{ color: "green", marginRight: 4 }}>Online</Text>
                  ) : (
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#3F434A" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <FormButton onPress={() => navigation.navigate("Log Out")} fontColor="red" backgroundColor="#FAFAFA">
            <Text style={{ color: "red" }}>Log Out</Text>
          </FormButton>

          <Text style={[TextProps, { textAlign: "center", opacity: 0.5 }]}>version {appVersion}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  item: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 42,
    padding: 8,
  },
});
