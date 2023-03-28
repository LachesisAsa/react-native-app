import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import image from "../../assets/register-bg.jpg";
import { register } from "../../redux/auth/authOperations";
import { useDispatch } from "react-redux";

const initialState = {
  login: "",
  email: "",
  password: "",
};

const windowDimensions = Dimensions.get("window").width;

export default function RegistrationScreen({ navigation }) {
  const [dimensions, setDimensions] = useState(windowDimensions);
  const [isNotShownPassword, setIsNotShownPassword] = useState(true);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);
  const { login, email, password } = state;

  const dispatch = useDispatch();

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width;
      setDimensions(width);
    };

    const listener = Dimensions.addEventListener("change", onChange);
    return () => {
      listener.remove();
    };
  }, []);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const onFocus = () => {
    setIsShowKeyboard(true);
  };

  const submitRegisterForm = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();

    dispatch(register(state));
    setState(initialState);
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={{ ...styles.container, width: dimensions }}>
        <ImageBackground source={image} style={styles.image}>
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            keyboardVerticalOffset={-100}
          >
            <View
              style={{
                ...styles.form,
                paddingBottom: isShowKeyboard ? 0 : 66,
              }}
            >
              <View style={styles.userImage}>
                <TouchableOpacity style={styles.btnAdd}>
                  <AntDesign name="pluscircleo" size={24} color={"#FF6C00"} />
                </TouchableOpacity>
              </View>
              <Text style={styles.title}>Реєстрація</Text>

              <View
                style={{
                  ...styles.formContainer,
                  marginBottom: isShowKeyboard ? 32 : 43,
                }}
              >
                <TextInput
                  style={styles.input}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, login: value }))
                  }
                  value={login}
                  placeholder="Логін"
                  onFocus={onFocus}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, email: value }))
                  }
                  value={email}
                  placeholder="E-mail адрес"
                  onFocus={onFocus}
                />
                <View style={{ position: "relative" }}>
                  <TextInput
                    style={{ ...styles.input, marginBottom: 0 }}
                    onChangeText={(value) =>
                      setState((prevState) => ({
                        ...prevState,
                        password: value,
                      }))
                    }
                    value={password}
                    placeholder="Пароль"
                    secureTextEntry={isNotShownPassword}
                    onFocus={onFocus}
                  />
                  <TouchableOpacity
                    style={styles.shownBtn}
                    onPress={() => {
                      setIsNotShownPassword((prevState) => !prevState);
                    }}
                  >
                    <Text style={styles.textBtnShown}>Показати</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {!isShowKeyboard && (
                <View>
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={submitRegisterForm}
                  >
                    <Text style={styles.btnTitle}>Зареєструватися</Text>
                  </TouchableOpacity>
                  <View style={styles.navigationContainer}>
                    <Text style={styles.bottomText}>Вже є акаунт? </Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("LoginScreen");
                      }}
                    >
                      <Text style={styles.bottomText}>Увійти</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>

        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  userImage: {
    position: "absolute",
    top: -60,
    right: Dimensions.get("window").width / 2 - 60,
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
  },
  btnAdd: {
    position: "absolute",
    bottom: 14,
    right: -12.5,
    maxWidth: 25,
  },
  title: {
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    //  lineHeight: "1.17",
    marginBottom: 33,
    textAlign: "center",
  },

  form: {
    position: "relative",
    width: "100%",
    paddingTop: 92,
    marginTop: "auto",
    backgroundColor: "#ffffff",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  formContainer: {
    justifyContent: "flex-end",
  },
  input: {
    borderWidth: 1,
    padding: 16,
    borderColor: "#e8e8e8",
    backgroundColor: "#F6F6F6",
    height: 50,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    color: "#212121",
    fontSize: 16,
  },
  shownBtn: { position: "absolute", top: 15, right: 40 },
  textBtnShown: {
    color: "#1B4371",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
  },
  btn: {
    backgroundColor: "#FF6C00",
    borderRadius: 100,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingBottom: 16,
    paddingTop: 16,
    color: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  btnTitle: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    //  lineHeight: 1.19,
    color: "#ffffff",
  },
  bottomText: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    //  lineHeight: 1.18,
    textAlign: "center",
    color: "#1B4371",
  },
  navigationContainer: { flexDirection: "row", justifyContent: "center" },
});
