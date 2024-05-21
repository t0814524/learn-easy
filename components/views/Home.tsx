import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Page } from "../Layout";

const style = StyleSheet.create({
    topicContainer: {
        width: "80%",
        margin: 10,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        borderRadius: 5,
        backgroundColor: "#58B9FA",
        borderWidth: 1,
        borderColor: "black"
    },
    topic: {
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    topicText: {
        color: "black",
        fontSize: 22,
        textTransform: "uppercase"
    },
    settingsButton: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 5,
        backgroundColor: "transparent",
        borderRadius: 5
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 50
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center"
    },
    instructionText: {
        fontSize: 18,
        marginBottom: 30,
        textAlign: "center"
    },
    headerSection: {
        width: "100%",
        alignItems: "center",
        marginBottom: 20,
    },
    usernameText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "black",
        marginBottom: 20,
    }
});

export const HomeView: React.FC<{
    setPage: (page: Page, topic?: string) => void,
    username: string
}> = ({ setPage, username }) => {
    const welcomeMessage = username ? `Welcome to Learn Easy, ${username}!` : "Welcome to Learn Easy!";

    return (
        <View style={style.container}>
            <View style={style.headerSection}>
                <Text style={style.welcomeText}>{welcomeMessage}</Text>
                <Text style={style.instructionText}>Choose a topic to start</Text>
            </View>
            {["italian", "spanish", "french", "geography", "history"].map((topic) => (
                <View key={topic} style={style.topicContainer}>
                    <TouchableOpacity onPress={() => { setPage("learn", topic) }} style={style.topic}>
                        <Text style={style.topicText}>{topic.charAt(0).toUpperCase() + topic.slice(1)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setPage("statistics") }} style={style.settingsButton}>
                        <FontAwesome name="gear" size={20} color="black" />
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};