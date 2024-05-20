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
        backgroundColor: "#c39bd3",
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
        justifyContent: "center"
    },
    mainMenuText: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 40
    }
});


export const HomeView: React.FC<{
    setPage: (page: Page, topic?: string) => void
}> = ({ setPage }) => {
    return (
        <View style={style.container}>
            <Text style={style.mainMenuText}>Main Menu</Text>
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
