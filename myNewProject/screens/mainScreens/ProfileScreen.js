import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
} from "react-native";
import { EvilIcons, Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import image from "../../assets/register-bg.jpg";
import {
  selectAvatar,
  selectError,
  selectIsLoading,
  selectUserId,
  selectUserName,
} from "../../redux/auth/authSelectors";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useState } from "react";
import { useEffect } from "react";
import { deleteAvatar, logOut } from "../../redux/auth/authOperations";
import { storage } from "../../firebase/config";
import { doc, deleteDoc } from "firebase/firestore";

export default function ProfileScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const currentUser = useSelector(selectUserId);
  const userName = useSelector(selectUserName);
  const avatar = useSelector(selectAvatar);
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const signOut = () => {
    console.log("exit");
    dispatch(logOut());
  };

  const fetchPostsByCurrentUser = () => {
    const dbRef = collection(db, "posts");
    const searchQuery = query(dbRef, where("userId", "==", currentUser));
    onSnapshot(searchQuery, (docSnap) =>
      setPosts(docSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );
  };

  const deleteAvatarFromUser = async () => {
    dispatch(deleteAvatar());
  };

  useEffect(() => {
    fetchPostsByCurrentUser();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ImageBackground source={image} style={styles.image}>
        <View style={styles.container}>
          {!isLoading && !error && (
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View style={styles.avatar}>
                {avatar ? (
                  <Image style={styles.uploadAvatar} source={{ uri: avatar }} />
                ) : (
                  <View style={styles.uploadAvatar}></View>
                )}
                <TouchableOpacity
                  style={styles.deleteAvatarIcon}
                  onPress={deleteAvatarFromUser}
                >
                  <EvilIcons name="close" size={24} color="#BDBDBD" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.logOutIcon} onPress={signOut}>
                <Feather name="log-out" size={24} color="#BDBDBD" />
              </TouchableOpacity>
              <View style={styles.header}>
                <Text style={styles.headerText}>{userName}</Text>
              </View>
              {posts.length >= 1 ? (
                <SafeAreaView style={{ marginHorizontal: 16 }}>
                  <FlatList
                    data={posts}
                    keyExtractor={posts.id}
                    renderItem={({ item }) => {
                      return (
                        <View style={{ marginBottom: 34 }}>
                          <Image
                            style={styles.imagePost}
                            source={{ uri: item.photo }}
                          />
                          <Text
                            style={{
                              ...styles.placeName,
                              fontFamily: "Roboto-Medium",
                            }}
                          >
                            {item.placeName}
                          </Text>
                          <View style={styles.locationCommentContainer}>
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate("CommentsScreen", {
                                  postId: item.id,
                                  photo: item.photo,
                                })
                              }
                            >
                              <View style={styles.commentContainer}>
                                <EvilIcons
                                  style={styles.commentLogo}
                                  name="comment"
                                  size={24}
                                  color="black"
                                />
                                <Text style={styles.commentAmount}>
                                  {item.comments}
                                </Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate("MapScreen", {
                                  location: item.location,
                                })
                              }
                            >
                              <View style={styles.location}>
                                <EvilIcons
                                  name="location"
                                  size={24}
                                  color="black"
                                />
                                <Text
                                  style={{
                                    ...styles.locationText,
                                    fontFamily: "Roboto-Regular",
                                  }}
                                >
                                  {item.placeName}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    }}
                  />
                </SafeAreaView>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("CreatePostsScreen");
                  }}
                >
                  <Text style={styles.bodyText}>
                    Додати перший пост в колекцію!
                  </Text>
                </TouchableOpacity>
              )}
            </KeyboardAvoidingView>
          )}
          {isLoading && (
            <View
              style={{
                flex: 1,
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <Text>Loading...</Text>
            </View>
          )}
          {!isLoading && error && (
            <View
              style={{
                flex: 1,
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <Text>{error}</Text>
            </View>
          )}
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "#fff",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    marginTop: 350,
    paddingBottom: 145,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  avatar: {
    position: "absolute",
    top: 0,
    left: 0,
    transform: [
      { translateY: -60 },
      { translateX: Dimensions.get("window").width * 0.5 - 60 },
    ],
    width: 120,
    height: 120,
    backgroundColor: "#f6f6f6",
    borderRadius: 16,
  },
  uploadAvatar: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  deleteAvatarIcon: {
    position: "absolute",
    top: 80,
    left: 108,
    zIndex: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: 25,
    height: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#BDBDBD",
  },
  logOutIcon: {
    width: 24,
    height: 24,
    marginLeft: "auto",
    marginRight: 16,
    marginTop: 16,
  },
  header: {
    paddingTop: 32,
    alignItems: "center",
    marginBottom: 32,
  },
  headerText: {
    color: "#212121",
    fontSize: 30,
    lineHeight: 35,
  },
  bodyText: {
    textAlign: "center",
    marginBottom: 50,
  },
  placeName: {
    fontWeight: "500",
    fontSize: 16,
    color: "#212121",
    marginBottom: 11,
  },
  imagePost: {
    height: 240,
    width: "100%",
    borderRadius: 8,
    marginBottom: 8,
  },
  locationCommentContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 8,
  },
  commentContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  commentLogo: {
    marginRight: 6,
  },
  commentAmount: {
    fontSize: 16,
    color: "#BDBDBD",
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 16,
    textDecorationLine: "underline",
    color: "#212121",
  },
});
