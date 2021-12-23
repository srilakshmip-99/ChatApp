import React, { useEffect, useState, useRef } from "react";
import {
    Header,
    Body,
    Title,
    Text,
    Right,
    Button,
    Left,
    Icon,
    Footer,
    Item,
    Input,
    Content,
    View,
    Form,
    Card,
} from "native-base";
import { KeyboardAvoidingView } from "react-native";
import { StatusBar } from "expo-status-bar";
import db, { message } from "../database";

const ConvHeader = (props) => {
    return (
        <>
            <Header
                androidStatusBarColor='#79018C'
                style={{ backgroundColor: "#79018C" }}>
                <Left>
                    <Button
                        transparent
                        onPress={() => {
                            props.navigation.goBack();
                        }}>
                        <Icon name='arrow-back' />
                    </Button>
                </Left>
                <Body
                    style={{
                        alignSelf: "center",
                        alignItems: "center",
                        color: "#79018C",
                    }}>
                    <Title style={{ fontSize: 25 }}>
                        {props.route.params.friends.replace(/\b\w/g, (l) =>
                            l.toUpperCase()
                        )}
                    </Title>
                </Body>
                <Right></Right>
            </Header>
        </>
    );
};

const ComLeft = ({ msg }) => {
    return (
        <View>
            <Card style={{ flex: 1 }}>
                <Text
                    style={{
                        fontSize: 30,
                        backgroundColor: "#79018C",
                        color: "white",
                    }}>
                    {msg}
                </Text>
            </Card>
        </View>
    );
};

const ComRight = ({ msg }) => {
    return (
        <View>
            <Card style={{ flex: 1 }}>
                <Text style={{ fontSize: 30, textAlign: "right" }}>{msg}</Text>
            </Card>
        </View>
    );
};

const ConvBody = (props) => {
    let username = props.route.params.username;
    let friends = props.route.params.friends;

    const [data, setData] = useState([]);
    const scrollViewRef = useRef();
    useEffect(() => {
        setData([]);
        let childAdded = db.ref(`/${username}/conservations/${friends}/`);

        childAdded.on("child_added", (snap) => {
            let val = snap.val();
            setData((e) => {
                let f = [...e];
                f.push(val);
                return [...f];
            });
        });

        return () => {
            childAdded.off("child_added");
        };
    }, []);
    return (
        <Content
            ref={scrollViewRef}
            onContentSizeChange={() => {
                //console.log("assd", s, scrollViewRef.current);
                return scrollViewRef.current._root.scrollToEnd({
                    animated: true,
                });
            }}>
            <KeyboardAvoidingView
                behavior='position'
                enabled
                style={{ flex: 1 }}
                keyboardVerticalOffset={-110}>
                {data.map((e, i) => {
                    if (e.friend !== friends)
                        return <ComLeft msg={e.msg} key={i} />;
                    return <ComRight msg={e.msg} key={i} />;
                })}
            </KeyboardAvoidingView>
        </Content>
    );
};

const ConvFooter = (props) => {
    const [msg, setMsg] = useState("");
    const sendMessage = async () => {
        if (msg == null || msg.trim() == "") return;
        await message(
            props.route.params.username,
            props.route.params.friends,
            msg
        );
        setMsg("");
    };
    return (
        <>
            <Footer style={{ backgroundColor: "#79018C", paddingBottom: 3 }}>
                <Item
                    rounded
                    style={{
                        width: "100%",
                        backgroundColor: "white",
                        marginVertical: 4,
                    }}>
                    <Icon
                        active
                        name='chatbubbles'
                        style={{ marginLeft: 20, color: "#79018C" }}
                    />
                    <Input
                        placeholder='Enter message to text.....'
                        value={msg}
                        onChangeText={(e) => {
                            setMsg(e);
                        }}
                    />
                    <Button transparent onPress={sendMessage}>
                        <Icon
                            active
                            name='paper-plane'
                            style={{ marginLeft: 20, color: "#79018C" }}
                        />
                    </Button>
                </Item>
            </Footer>
        </>
    );
};

const Conversations = (props) => {
    return (
        <>
            <ConvHeader {...props} />
            <StatusBar
                backgroundColor='#79018C'
                animated={true}
                networkActivityIndicatorVisible={true}
                style='light'
            />
            <ConvBody {...props} />
            <ConvFooter {...props} />
        </>
    );
};

export default Conversations;
