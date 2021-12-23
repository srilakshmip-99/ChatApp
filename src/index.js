import React, { useEffect, useState } from "react";
import Login from "./Screen/Login";
import Signup from "./Screen/Signup";
import Home from "./Screen/Home";
import Conversations from "./Screen/Conv";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Container, Header, Body, Text } from "native-base";
import { StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const MyTheme = {
    dark: false,
    colors: {
        primary: "#79018C",
        background: "rgb(242, 242, 242)",
        card: "white",
        text: "#79018C",
        border: "rgb(199, 199, 204)",
        notification: "#FFC107",
    },
};
function Top() {
    return (
        <Header style={{ backgroundColor: "#79018C" }}>
            <StatusBar backgroundColor={"#79018C"} barStyle='light-content' />
            <Body>
                <Text>Hello</Text>
            </Body>
        </Header>
    );
}
function createReg() {
    return (
        <Container>
            {/* <Top /> */}
            <Tab.Navigator initialRouteName='Login'>
                <Tab.Screen
                    name='Login'
                    component={Login}
                    options={{ tabBarLabel: "Login" }}
                />
                <Tab.Screen name='Signup' component={Signup} />
            </Tab.Navigator>
        </Container>
    );
}

export default function Router() {
    // useEffect(() => {
    //     AsyncStorage.clear();
    // }, []);
    return (
        <NavigationContainer theme={MyTheme}>
            <Stack.Navigator
                initialRouteName={"Reg"}
                screenOptions={{ headerShown: false }}>
                <Stack.Screen name='Home' component={Home} />
                <Stack.Screen name='Reg' children={createReg} />
                <Stack.Screen name='Conv' component={Conversations} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
