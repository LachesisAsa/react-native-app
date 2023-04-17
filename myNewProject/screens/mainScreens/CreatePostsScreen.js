import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import Toast from "react-native-root-toast";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/config";
import { selectAuth } from "../../redux/auth/authSelectors";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "@firebase/firestore";

const initialState = {
  placeName: "",
  location: "",
  name: "",
  photo: null,
  comments: 0,
  id: "",
};

export default function CreatePostsScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [state, setState] = useState(initialState);
  const { location, name, photo, placeName } = state;
  const { userId, userName } = useSelector(selectAuth);
  const cameraRef = useRef();
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoad(true);
      try {
        if (Platform.OS !== "web") {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          setHasPermission(status === "granted");
          if (status !== "granted") {
            console.log(
              "Sorry, we need camera roll permissions to make this work!"
            );
          }
          setLoad(false);
        }
      } catch (error) {
        setLoad(false);
        setError(error.message);
      }
    })();
    (async () => {
      setLoad(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
        }
        setLoad(false);
      } catch (error) {
        setLoad(false);
        setError(error.message);
      }
    })();
  }, []);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const uploadPhotoToServer = async () => {
    setLoad(true);
    try {
      const response = await fetch(state.photo);
      const file = await response.blob();
      const imgId = Date.now().toString();

      const storageRef = ref(storage, `images/${imgId}`);
      await uploadBytes(storageRef, file);

      const urlRef = await getDownloadURL(storageRef);
      setLoad(false);
      return urlRef;
    } catch (error) {
      console.error(error);
      setLoad(false);
      setError(error.message);
    }
  };

  const uploadPostToServer = async () => {
    setLoad(true);
    try {
      const uploadPhoto = await uploadPhotoToServer();
      const collectionRef = doc(collection(db, "posts"));

      await setDoc(collectionRef, {
        photo: uploadPhoto,
        location,
        placeName: placeName,
        comments: 0,
        userId,
        userName,
        timestamp: serverTimestamp(),
      });

      Toast.show("Пост додано", {
        duration: 3000,
        position: 50,
      });

      setLoad(false);
    } catch (error) {
      console.log("upload post", error);
      setLoad(false);
      setError(`upload post ${error.message}`);
    }
  };

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const onFocus = () => {
    setIsShowKeyboard(true);
  };

  const takePicture = async () => {
    const postId = Date.now().toString();
    setLoad(true);
    try {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!pickerResult.canceled) {
        setState((prevState) => ({
          ...prevState,
          photo: pickerResult.assets[0].uri,
          id: postId,
        }));
      }
      let locationCoords = await Location.getCurrentPositionAsync({});
      setState((prevState) => ({
        ...prevState,
        location: locationCoords.coords,
      }));
      setLoad(false);
    } catch (error) {
      console.log("take picture", error.message);
      setLoad(false);
      setLoad(`take picture ${error.message}`);
    }
  };

  const submitPublicForm = () => {
    uploadPostToServer();
    setIsShowKeyboard(false);

    Keyboard.dismiss();

    navigation.navigate("DefaultScreenPosts");
    setState(initialState);
  };

  const createNewPost =
    name === "" || photo === "" || placeName === "" || location === "";

  let locationText = "Waiting..";
  if (errorMsg) {
    locationText = errorMsg;
  } else if (locationText) {
    locationText = JSON.stringify(location);
  }

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <ScrollView style={styles.container}>
        <View style={styles.topContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("DefaultScreenPosts");
              setState((prevState) => ({ ...prevState, photo: null }));
            }}
          >
            <AntDesign
              name="arrowleft"
              size={24}
              color="rgba(33, 33, 33, 0.8)"
            />
          </TouchableOpacity>

          <Text style={styles.textTop}>Створити публікацію</Text>
        </View>
        {!error && !load && (
          <>
            <View style={styles.mainContainer}>
              <View>
                {photo ? (
                  <View style={styles.addPhoto}>
                    <Image
                      style={styles.imageBackground}
                      source={{ uri: photo }}
                    />
                    <TouchableOpacity
                      style={styles.photoIcon}
                      onPress={takePicture}
                    >
                      <MaterialIcons
                        name="photo-camera"
                        size={24}
                        color="#BDBDBD"
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Camera
                    style={styles.addPhoto}
                    ref={cameraRef}
                    onCameraReady={onCameraReady}
                  >
                    <TouchableOpacity
                      style={styles.photoIcon}
                      onPress={takePicture}
                    >
                      <MaterialIcons
                        name="photo-camera"
                        size={24}
                        color="#BDBDBD"
                      />
                    </TouchableOpacity>
                  </Camera>
                )}
              </View>
              {photo ? (
                <Text style={styles.textBottom}>Редагувати фото</Text>
              ) : (
                <Text style={styles.textBottom}>Завантажити фото</Text>
              )}
              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, name: value }))
                  }
                  value={name}
                  placeholder="Назва..."
                  placeholderColor="#BDBDBD"
                  onFocus={onFocus}
                />

                <TextInput
                  style={{ ...styles.input, marginBottom: 32 }}
                  onChangeText={(value) =>
                    setState((prevState) => ({
                      ...prevState,
                      placeName: value,
                    }))
                  }
                  value={placeName}
                  placeholder="Місцевість..."
                  onFocus={onFocus}
                />
              </View>
              <TouchableOpacity
                style={
                  createNewPost
                    ? styles.btnAddScreen
                    : styles.btnAddScreenActive
                }
                onPress={submitPublicForm}
                disabled={createNewPost}
              >
                <Text
                  style={createNewPost ? styles.btnText : { color: "#ffffff" }}
                >
                  Опублікувати
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {load && (
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
        {!load && error && (
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
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  topContainer: {
    flexDirection: "row",
    paddingLeft: 16,
    paddingTop: 55,
    paddingBottom: 11,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.3)",
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: 16,
    position: "relative",
  },
  textTop: {
    marginLeft: 63,
    fontFamily: "Roboto-Medium",
    fontSize: 17,
    lineHeight: 22,
    color: "#212121",
  },
  addPhoto: {
    width: Dimensions.get("window").width - 16 * 2,
    height: 240,
    backgroundColor: "#F6F6F6",
    position: "relative",
    marginTop: 32,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  imageBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 240,
  },
  photoIcon: {
    width: 60,
    height: 60,
    backgroundColor: "#ffffff",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  textBottom: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
    marginBottom: 48,
  },
  form: {
    width: "100%",
  },
  input: {
    borderBottomWidth: 1,
    paddingBottom: 16,
    borderBottomColor: "#E8E8E8",
    backgroundColor: "#ffffff",
    marginBottom: 47,
    color: "#212121",
    fontSize: 16,
  },
  btnAddScreen: {
    backgroundColor: "#F6F6F6",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 16,
    paddingTop: 16,
  },
  btnAddScreenActive: {
    backgroundColor: "#FF6C00",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 16,
    paddingTop: 16,
  },
  btnText: {
    color: "#BDBDBD",
  },
});