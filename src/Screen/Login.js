import React from "react";
import {
    StyleSheet,
    Text,
    Alert,
    View,
    Linking,
    Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Content, Item, Input, Label } from "native-base";
import { validateUser } from "../database";

const { height } = Dimensions.get("window");

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        (async () => {
            let d = await AsyncStorage.getItem("user");
            if (d) {
                d = JSON.parse(d);
                if (d?.email && d?.username && d?.password) {
                    props.navigation.replace("Home");
                }
            }
        })();
    }
    state = {
        Username: "",
        Password: "",
        err: "",
    };
    val = async () => {
        // console.log(
        //     await validateUser(
        //         this.state.Username.toLowerCase(),
        //         this.state.Password
        //     )
        // );
        try {
            let res = await validateUser(
                this.state.Username.toLowerCase(),
                this.state.Password
            );
            //console.log(res);
            if (res.valid) {
                await AsyncStorage.setItem("user", JSON.stringify(res.details));
                Alert.alert("Login:", "Login with " + this.state.Username);
                this.setState({ err: "", Username: "", Password: "" });
                this.props.navigation.push("Home");
            } else {
                this.setState({ err: res.msg });
            }
        } catch (e) {
            console.error(e);
        }
    };
    validate = async () => {
        if (this.state.Username != "" && this.state.Password != "") {
            this.val();
            this.setState({ err: "" });
        } else {
            this.setState({ err: "All Fields Required" });
        }
    };

    render() {
        return (
            <Content>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Welcome to ChatApp</Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        paddingTop: 45,
                        alignItems: "center",
                        marginTop: height / 20,
                    }}>
                    <Text style={styles.text}>
                        <Text style={styles.log}>Log</Text>
                        <Text style={styles.in}>IN</Text>
                    </Text>
                    <Item floatingLabel style={{ width: 220, marginTop: 16 }}>
                        <Label>Username</Label>
                        <Input
                            value={this.state.Username}
                            onChangeText={(text) => {
                                this.setState({ Username: text });
                            }}
                        />
                    </Item>
                    <Item floatingLabel style={{ width: 220, marginTop: 16 }}>
                        <Label>Password</Label>
                        <Input
                            secureTextEntry={true}
                            value={this.state.Password}
                            onChangeText={(text) => {
                                this.setState({ Password: text });
                            }}
                        />
                    </Item>

                    <TouchableOpacity
                        style={{ marginTop: 25 }}
                        underlayColor='#ddd'
                        onPress={() => {
                            Linking.openURL(
                                "http://mrcorp.pythonanywhere.com/forgot/"
                            );
                        }}>
                        <Text>Forgot Password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonLay}
                        underlayColor='#fff'
                        onPress={() => {
                            this.validate();
                        }}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    {/* <Text style={{ marginTop: 20 }}>
                        <Text style={{ fontWeight: "100" }}>
                            ----------------------
                        </Text>
                        <Text style={{ fontWeight: "bold" }}>OR</Text>
                        <Text style={{ fontWeight: "100" }}>
                            ----------------------
                        </Text>
                    </Text>

                    <TouchableOpacity
                        style={styles.googleLay}
                        onPress={() => {
                            this.props.navigation.replace("Home");
                        }}
                        underlayColor="#fff"
                    >
                        <Text style={styles.googleText}>
                            <AntDesign
                                name="arrowleft"
                                size={20}
                                color="orange"
                            />{" "}
                            Go Back Home
                        </Text>
                    </TouchableOpacity> */}
                    <Text
                        style={{
                            color: "white",
                            marginTop: 15,
                        }}>
                        {this.state.err}
                    </Text>
                </View>
            </Content>
        );
    }
}
const styles = StyleSheet.create({
    header: {
        alignItems: "center",
    },
    headerText: {
        paddingVertical: 10,
        fontWeight: "bold",
        fontSize: 30,
        color: "grey",
        paddingBottom: 20,
    },
    text: {
        paddingVertical: 10,
    },
    log: {
        fontWeight: "bold",
        fontSize: 30,
        color: "black",
        paddingBottom: 20,
    },
    in: {
        fontWeight: "bold",
        fontSize: 35,
        backgroundColor: "#79018C",
        color: "white",
        paddingBottom: 100,
        shadowColor: "black",
        shadowOffset: {
            width: 100,
            height: 100,
        },
    },
    email: {
        marginTop: 16,
        width: 220,
        borderBottomColor: "#ddd",
        borderBottomWidth: 2,
        fontSize: 18,
    },
    pwd: {
        fontSize: 18,
        paddingTop: 10,
        marginTop: 16,
        width: 220,
        borderBottomColor: "#ddd",
        borderBottomWidth: 2,
    },
    buttonLay: {
        marginTop: 25,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "white",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#79018C",
        width: 220,
        height: 45,
        shadowColor: "#79018C",
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        color: "#79018C",
        textAlign: "center",
        paddingLeft: 8,
        paddingRight: 8,
        fontWeight: "bold",
        fontSize: 15,
    },
    googleLay: {
        marginTop: 20,
        paddingTop: 12,
        paddingBottom: 10,
        backgroundColor: "white",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "orange",
        width: 220,
        height: 45,
        shadowColor: "orange",
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    googleText: {
        color: "orange",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 15,
    },
});
