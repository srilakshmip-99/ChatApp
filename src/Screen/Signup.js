import React from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { Content, Item, Input, Label, Icon } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import { checkUser, createUser } from "../database";
export default class Signup extends React.Component {
    state = {
        userErr: "",
        Username: "",
        Email: "",
        password: "",
        "Confirm Password": "",
        emailErr: "",
        pwdErr: "",
        cpwdErr: "",
        err: "",
        errUsr: false,
        sucUsr: false,
        sucEmail: false,
        errEmail: false,
        errPwd: false,
        sucPwd: false,
        errCp: false,
        sucCp: false,
        eval: false,
        emval: false,
        pwdval: false,
        cpval: false,
    };
    userData = async (str) => {
        this.state.eval = true;
        if (str.length < 2) {
            this.setState({ errUsr: true, sucUsr: false });
            this.setState({ userErr: "Username more than 4 characters" });
        } else if (str != "") {
            try {
                let res = await checkUser(str.toLowerCase());

                if (res.valid == true) {
                    this.setState({ errUsr: false, sucUsr: true });
                    this.setState({ userErr: "" });
                } else {
                    this.setState({ errUsr: true, sucUsr: false });

                    this.setState({
                        userErr: "Username already taken...",
                    });
                }
            } catch (e) {
                console.error(e);
            }
        } else {
            this.setState({ errUsr: true, sucUsr: false });
            this.setState({ userErr: "User Name Reqiured..." });
        }
    };
    validate = (text) => {
        this.setState({ emval: true });
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false) {
            this.setState({
                emailErr: "Email is invalid",
                sucEmail: false,
                errEmail: true,
            });
            return false;
        } else {
            this.setState({ emailErr: "", sucEmail: true, errEmail: false });
        }
    };
    pwdSize = (text) => {
        var len = text.length;
        this.setState({ pwdval: true });
        if (text == "") {
            this.setState({
                pwdErr: "Password is required",
                errPwd: true,
                sucPwd: false,
            });
        } else if (len < 4) {
            this.setState({
                pwdErr: "Password Must be 4 or more characters",
                errPwd: true,
                sucPwd: false,
            });
        } else {
            this.setState({ pwdErr: "", errPwd: false, sucPwd: true });
        }
    };
    cpwdSize = (text) => {
        var passwordString = this.state.password;
        var cpasswordString = text;
        const len = text.length;
        this.setState({ cpval: true });
        if (cpasswordString == "" || passwordString == "") {
            this.setState({
                errCp: true,
                sucCp: false,
                cpwdErr: "Confirm Password is required",
            });
        } else if (passwordString.slice(0, len) === cpasswordString) {
            if (len == passwordString.length) {
                if (len < 3) {
                    this.setState({
                        errCp: true,
                        sucCp: false,
                        cpwdErr: "Password Must be more than 4 character",
                    });
                } else {
                    this.setState({ cpwdErr: "", errCp: false, sucCp: true });
                }
            } else {
                this.setState({ errCp: false, sucCp: true, cpwdErr: "" });
            }
        } else {
            this.setState({
                errCp: true,
                sucCp: false,
                cpwdErr: "Confirm Password is not match with Password",
            });
        }
    };
    checkFinal() {
        var s = this.state;
        if (s.sucCp && s.sucEmail && s.sucPwd && s.sucUsr) {
            return true;
        }
        return false;
    }
    val = async () => {
        if (this.checkFinal()) {
            try {
                let res = await createUser(
                    this.state.Username.toLowerCase(),
                    this.state.Email,
                    this.state.password
                );
                if (res.valid == true) {
                    this.setState({
                        err:
                            'Signup Successfully "' + this.state.Username + '"',
                        userErr: "",
                        Username: "",
                        Email: "",
                        password: "",
                        "Confirm Password": "",
                        emailErr: "",
                        pwdErr: "",
                        cpwdErr: "",
                        errUsr: false,
                        sucUsr: false,
                        sucEmail: false,
                        errEmail: false,
                        errPwd: false,
                        sucPwd: false,
                        errCp: false,
                        sucCp: false,
                        eval: false,
                        emval: false,
                        pwdval: false,
                        cpval: false,
                    });
                    Alert.alert("Signup Successfully:", this.state.err);
                    this.props.navigation.replace("Reg");
                } else {
                    this.setState({ err: "SomeThingWent Wrong" });
                }
            } catch (e) {
                console.error(e);
            }
        }
    };
    validateEmail = () => {
        if (
            this.state.Username != "" &&
            this.state.Email != "" &&
            this.state.password != "" &&
            this.state["Confirm Password"] != ""
        ) {
            if (this.state.password == this.state["Confirm Password"]) {
                this.setState({ err: "" });
                this.val();
            } else {
                this.setState({ err: "Password Not Match" });
            }
        } else {
            this.setState({ err: "All Fields is Required" });
        }
    };

    render() {
        var usr, email, pwd, cp;

        if (this.state.eval) {
            usr = (
                <Icon
                    name={this.state.sucUsr ? "checkmark" : "close"}
                    size={20}
                />
            );
        }
        if (this.state.emval) {
            email = (
                <Icon
                    name={this.state.sucEmail ? "checkmark" : "close"}
                    size={20}
                />
            );
        }
        if (this.state.pwdval) {
            pwd = (
                <Icon
                    name={this.state.sucPwd ? "checkmark" : "close"}
                    size={20}
                />
            );
        }
        if (this.state.cpval) {
            cp = (
                <Icon
                    name={this.state.sucCp ? "checkmark" : "close"}
                    size={20}
                />
            );
        }
        return (
            <Content>
                <View style={{ flex: 1, paddingTop: 40, alignItems: "center" }}>
                    <Text style={styles.text}>
                        <Text style={styles.sign}>Sign</Text>
                        <Text style={styles.up}>Up</Text>
                    </Text>
                    <Item
                        floatingLabel
                        style={{ width: 260, marginTop: 16, height: 45 }}
                        success={this.state.sucUsr}
                        error={this.state.errUsr}
                    >
                        <Label>Username</Label>
                        <Input
                            value={this.state.Username}
                            onChangeText={(text) => {
                                this.setState({ Username: text });
                                this.userData(text);
                            }}
                        />
                        {usr}
                    </Item>
                    <Text
                        style={{
                            color: "red",
                            fontSize: 12,
                            width: 220,
                        }}
                    >
                        {this.state.userErr}
                    </Text>
                    <Item
                        floatingLabel
                        style={{ width: 260, height: 50 }}
                        success={this.state.sucEmail}
                        error={this.state.errEmail}
                    >
                        <Label>Email</Label>
                        <Input
                            onChangeText={(text) => {
                                this.setState({ Email: text });
                                this.validate(text);
                            }}
                            value={this.state.Email}
                        />
                        {email}
                    </Item>
                    <Text
                        style={{
                            color: "red",
                            fontSize: 12,
                        }}
                    >
                        {this.state.emailErr}
                    </Text>
                    <Item
                        floatingLabel
                        style={{ width: 260, height: 50 }}
                        success={this.state.sucPwd}
                        error={this.state.errPwd}
                    >
                        <Label>Password</Label>
                        <Input
                            secureTextEntry={true}
                            onChangeText={(text) => {
                                this.pwdSize(text);
                                this.setState({ password: text });
                            }}
                            value={this.state.password}
                        />
                        {pwd}
                    </Item>
                    <Text
                        style={{
                            color: "red",
                            fontSize: 12,
                        }}
                    >
                        {this.state.pwdErr}
                    </Text>
                    <Item
                        floatingLabel
                        style={{ width: 260, height: 50 }}
                        success={this.state.sucCp}
                        error={this.state.errCp}
                    >
                        <Label>Confirm Password</Label>
                        <Input
                            secureTextEntry={true}
                            onChangeText={(text) => {
                                this.cpwdSize(text);
                                this.setState({ "Confirm Password": text });
                            }}
                            value={this.state["Confirm Password"]}
                        />
                        {cp}
                    </Item>
                    <Text
                        style={{
                            color: "red",
                            fontSize: 12,
                        }}
                    >
                        {this.state.cpwdErr}
                    </Text>
                    <TouchableOpacity
                        style={styles.buttonLay}
                        onPress={() => {
                            this.validateEmail();
                        }}
                        underlayColor="#fff"
                    >
                        <Text style={styles.buttonText}>Signup</Text>
                    </TouchableOpacity>
                    <Text
                        style={{
                            color: "red",
                            marginTop: 10,
                        }}
                    >
                        {this.state.err}
                    </Text>
                </View>
            </Content>
        );
    }
}

var styles = StyleSheet.create({
    text: {
        paddingVertical: 10,
    },
    sign: {
        fontWeight: "bold",
        fontSize: 30,
        color: "black",
        paddingBottom: 20,
    },
    up: {
        fontWeight: "bold",
        fontSize: 35,
        backgroundColor: "red",
        color: "white",
        paddingBottom: 20,
    },
    username: {
        marginTop: 16,
        width: 220,
        borderBottomColor: "#ddd",
        borderBottomWidth: 2,
        fontSize: 18,
    },
    email: {
        marginTop: 10,
        width: 220,
        borderBottomColor: "#ddd",
        borderBottomWidth: 2,
        fontSize: 18,
    },
    pwd: {
        marginTop: 10,
        width: 220,
        borderBottomColor: "#ddd",
        borderBottomWidth: 2,
        fontSize: 18,
    },
    cpwd: {
        fontSize: 18,
        marginTop: 10,
        width: 220,
        borderBottomColor: "#ddd",
        borderBottomWidth: 2,
    },
    buttonLay: {
        marginTop: 30,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "white",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "red",
        width: 230,
        height: 45,
        shadowColor: "red",
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        color: "red",
        textAlign: "center",
        paddingLeft: 8,
        paddingRight: 8,
        fontWeight: "bold",
        fontSize: 15,
    },
});
