import React, { useState, useEffect, useRef } from "react";
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
import "react-native-get-random-values";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import { v4 as uuidv4 } from "uuid";
import * as Location from "expo-location";

const initialState = {
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
  const [isPreview, setIsPreview] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [state, setState] = useState(initialState);
  const { location, name, photo } = state;
  const cameraRef = useRef();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
    })();
  }, []);

  let locationText = "Waiting..";
  if (errorMsg) {
    locationText = errorMsg;
  } else if (locationText) {
    locationText = JSON.stringify(location);
  }

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const onFocus = () => {
    setIsShowKeyboard(true);
  };

  const submitPublicForm = async () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    let locationCoords = await Location.getCurrentPositionAsync({});
    setState((prevState) => ({
      ...prevState,
      location: `${locationCoords.coords.latitude}, ${locationCoords.coords.longitude}`,
    }));
    navigation.navigate("DefaultScreenPosts", { state });
    setState(initialState);
    cancelPreview();
  };

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.uri;
      if (source) {
        await cameraRef.current.pausePreview();
        setIsPreview(true);
        setState((prevState) => ({
          ...prevState,
          photo: source,
          id: uuidv4(),
        }));
      }
    }
  };

  async function cancelPreview() {
    await cameraRef.current.resumePreview();
    setIsPreview(false);
    setVideoSource(null);
  }

  const createNewPost = location === "" || name === "" || photo === "";

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
        <View style={styles.mainContainer}>
          <View>
            {photo ? (
              <View style={styles.addPhoto}>
                <Image style={styles.imageBackground} source={{ uri: photo }} />
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
            <Text style={styles.textBottom}>Загрузити фото</Text>
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
                  location: value,
                }))
              }
              value={location}
              placeholder="Місцевість..."
              onFocus={onFocus}
            />
          </View>
          <TouchableOpacity
            style={
              createNewPost ? styles.btnAddScreen : styles.btnAddScreenActive
            }
            onPress={submitPublicForm}
            disabled={createNewPost}
          >
            <Text style={createNewPost ? styles.btnText : { color: "#ffffff" }}>
              Опоблікувати
            </Text>
          </TouchableOpacity>
        </View>
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
