import React, { useEffect, useState } from "react";
import { Text, Dimensions, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    Content,
    Header,
    Container,
    Icon,
    Button,
    Body,
    Title,
    Item,
    Input,
    Card,
    CardItem,
    Right,
    Label,
    View,
    Left,
} from "native-base";
import { StatusBar } from "expo-status-bar";
import db, { getFriends, checkUser, addFriends } from "../database";
import { TouchableOpacity } from "react-native-gesture-handler";
let user;
const { height } = Dimensions.get("window");
const Search = () => {
    const [errorSearch, setError] = useState(false);
    const [successSearch, setSuccess] = useState(false);
    const [key, setKey] = useState("");

    const friendCheck = async () => {
        if (key == "") {
            setError(false);
            setSuccess(false);
            return;
        }
        let data = await checkUser(key.toLowerCase());
        if (!data.valid) {
            setSuccess(true);
            setError(false);
        } else {
            setSuccess(false);
            setError(true);
        }
    };
    const addToFriendList = async () => {
        if (successSearch) {
            await addFriends(user?.username, key.toLowerCase());
        }
    };
    useEffect(() => {
        (async () => {
            await friendCheck(key);
        })();
    }, [key]);
    return (
        <>
            <View
                style={{
                    marginTop: 8,
                    marginHorizontal: 25,
                    justifyContent: "center",
                }}>
                <Item>
                    <Item
                        floatingLabel
                        style={{ width: 250, borderBottomColor: "white" }}>
                        <Icon
                            name='search'
                            style={{ fontSize: 20, color: "#79018C" }}
                        />
                        <Label
                            style={{
                                fontSize: 13,
                                color: "#79018C",
                            }}>
                            Find Friends
                        </Label>
                        <Input
                            value={key}
                            onChangeText={(e) => {
                                setKey(e);
                            }}
                        />
                    </Item>
                    <Item>
                        {errorSearch || successSearch ? (
                            <Button
                                small
                                danger={errorSearch}
                                success={successSearch}
                                onPress={addToFriendList}>
                                {errorSearch ? (
                                    <Icon name={"close"} size={20} />
                                ) : (
                                    <Icon name={"checkmark"} size={20} />
                                )}
                            </Button>
                        ) : (
                            <></>
                        )}
                    </Item>
                </Item>
            </View>
        </>
    );
};
const HomeHeader = () => {
    return (
        <>
            <Header
                androidStatusBarColor='#79018C'
                style={{ backgroundColor: "#79018C" }}>
                <Body
                    style={{
                        alignSelf: "center",
                        alignItems: "center",
                        color: "#79018C",
                    }}>
                    <Title>
                        <Text>Welcome to Chat App</Text>
                        <Icon name='chatbox' style={{ color: "white" }} />
                    </Title>
                </Body>
            </Header>
            <Search />
        </>
    );
};
const Dashboard = (props) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        (async () => {
            user = await AsyncStorage.getItem("user");
            user = JSON.parse(user);
            if (user == null) {
                props.navigation.replace("Reg");
            }
            let a = await getFriends(user?.username);

            setData((e) => {
                if (a) return a;
                else return e;
            });
        })();
    }, []);

    useEffect(() => {
        let user;
        let newFriend;
        (async () => {
            user = await AsyncStorage.getItem("user");
            user = JSON.parse(user);
            newFriend = db.ref(`${user?.username}/friends`);
            newFriend.on("child_added", (snap) => {
                let val = snap.val();
                setData((e) => {
                    let z = [...e];
                    z.push(val);
                    return z;
                });
            });
        })();

        return () => {
            newFriend.off("child_added");
        };
    }, []);

    return (
        <Content>
            {data.length == 0 ? (
                <>
                    <View
                        style={{
                            height: height / 2.3,
                            backgroundColor: "white",
                            marginTop: height / 10,
                        }}>
                        <ImageBackground
                            resizeMode='cover'
                            style={{
                                flex: 1,
                                justifyContent: "center",
                            }}
                            source={{
                                uri: "https://www.pinclipart.com/picdir/big/372-3727140_front-end-loader-clip-art.png",
                            }}
                        />
                        <Text
                            style={{
                                fontSize: 20,
                                color: "grey",
                                textAlign: "center",
                            }}>
                            No record found
                        </Text>
                    </View>
                </>
            ) : (
                data.map((e, i) => (
                    <TouchableOpacity
                        key={i}
                        onPress={() => {
                            props.navigation.push("Conv", {
                                username: user?.username,
                                friends: e,
                            });
                        }}>
                        <Card style={{ height: 40 }}>
                            <CardItem>
                                <Icon
                                    active
                                    name={"people"}
                                    style={{ fontSize: 20, color: "#79018C" }}
                                />
                                <Text>
                                    {e.replace(/\b\w/g, (l) => l.toUpperCase())}
                                </Text>
                                <Right>
                                    <Icon name='arrow-forward' />
                                </Right>
                            </CardItem>
                        </Card>
                    </TouchableOpacity>
                ))
            )}
        </Content>
    );
};

const Home = (props) => {
    return (
        <Container>
            <HomeHeader />
            <StatusBar
                backgroundColor='#79018C'
                animated={true}
                networkActivityIndicatorVisible={true}
                style='light'
            />
            <Dashboard {...props} />
        </Container>
    );
};
export default Home;
