import { StyleSheet, View, Text, Dimensions, Image } from "react-native";
import { useSelector } from "react-redux";
import { selectUserId } from "../redux/auth/authSelectors";

export const CommentItem = ({ item, isShowKeyboard }) => {
  const currentUserId = useSelector(selectUserId);
  const currentUser = currentUserId === item.userId;
  return (
    <View
      style={{
        flexDirection: currentUser ? "row" : "row-reverse",
        display: isShowKeyboard ? "none" : "flex",
      }}
    >
      {item.avatar ? (
        <Image style={styles.avatar} source={{ uri: item.avatar }} />
      ) : (
        <View style={styles.avatar}></View>
      )}
      <View
        style={{
          ...styles.commentBody,
          borderTopRightRadius: currentUser ? 6 : 0,
          borderTopLeftRadius: currentUser ? 0 : 6,
          marginLeft: currentUser ? 16 : 0,
          marginRight: currentUser ? 0 : 16,
        }}
      >
        <Text style={styles.commentAuthor}>
          {currentUser ? "You" : item.userName}
          {!item.userName && "Anonimous"}
        </Text>
        <Text style={styles.commentText}>{item.comment || item.text}</Text>
        <View style={styles.commentInfo}>
          <Text style={styles.commentDate}>{item.date}</Text>
          <Text style={styles.commentTime}> {item.time} </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: "#E8E8E8",
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  commentBody: {
    padding: 16,
    marginBottom: 24,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    maxWidth: Dimensions.get("window").width - 76,
  },
  commentAuthor: {
    fontSize: 11,
    fontWeight: "700",
  },
  commentText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#212121",
    marginBottom: 8,
  },
  commentInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  commentDate: {
    borderRightWidth: 1,
    borderRightColor: "#BDBDBD",
    paddingRight: 2,
    fontSize: 10,
    lineHeight: 12,
    color: "#BDBDBD",
  },
  commentTime: {
    paddingLeft: 2,
    fontSize: 10,
    lineHeight: 12,
    color: "#BDBDBD",
  },
});