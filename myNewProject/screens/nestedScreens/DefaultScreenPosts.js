import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SimpleLineIcons, EvilIcons } from "@expo/vector-icons";
import photo from "../../assets/photo.jpg";
import { logOut } from "../../redux/auth/authOperations";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../../redux/auth/authSelectors";

export default function DefaultScreenPosts({ route, navigation }) {
  const userAuth = useSelector(selectAuth);
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();

  console.log("userAuth", userAuth);

  useEffect(() => {
    if (route.params) {
      setPosts((prevState) => [...prevState, route.params.state]);
    }
  }, [route.params]);

  console.log(posts);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.textTop}>Публікації</Text>
        <TouchableOpacity onPress={() => dispatch(logOut())}>
          <SimpleLineIcons
            style={{ marginRight: 18 }}
            name="login"
            size={24}
            color="#BDBDBD"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.mainContent}>
        <View style={styles.userContent}>
          <Image style={styles.userAvatar} source={photo} />
          <View style={styles.textContent}>
            <Text style={styles.userName}>Serhii Artyshchuk</Text>
            <Text style={styles.userEmail}>serban9999@gmail.com</Text>
          </View>
        </View>
        {posts.length > 0 && (
          <View>
            <FlatList
              data={posts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{ marginBottom: 34 }}>
                  <Image style={styles.image} source={{ uri: item.photo }} />
                  <Text
                    style={{ ...styles.placeName, fontFamily: "Roboto-Medium" }}
                  >
                    {item.name}
                  </Text>
                  <View style={styles.locationCommentContainer}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("CommentsScreen")}
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
                      onPress={() => navigation.navigate("MapScreen")}
                    >
                      <View style={styles.location}>
                        <EvilIcons name="location" size={24} color="black" />
                        <Text
                          style={{
                            ...styles.locationText,
                            fontFamily: "Roboto-Regular",
                          }}
                        >
                          {item.location}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  topContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 55,
    paddingBottom: 11,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.3)",
  },
  textTop: {
    marginRight: 103,
    fontFamily: "Roboto-Medium",
    fontSize: 17,
    lineHeight: 22,
    color: "#212121",
  },
  mainContent: { flex: 1, marginHorizontal: 16 },
  userContent: {
    flexDirection: "row",
    marginTop: 32,
    marginBottom: 32,
  },
  textContent: { paddingTop: 15 },
  userAvatar: { width: 60, height: 60, marginRight: 8 },
  userName: {
    fontFamily: "Roboto-Bold",
    fontSize: 13,
    lineHeight: 15,
  },
  userEmail: {
    fontFamily: "Roboto-Regular",
    fontSize: 11,
    lineHeight: 13,
    color: "rgba(33, 33, 33, 0.8)",
  },
  placeName: {
    fontWeight: "500",
    fontSize: 16,
    color: "#212121",
    marginBottom: 11,
  },
  image: {
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
