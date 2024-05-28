import React from "react";
import { Text, TouchableOpacity, StyleSheet, View, ScrollView } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Page } from "../Layout";
import { styles } from "../style";


const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center",
    },
    headerSection: {
        width: "100%",
        alignItems: "center",
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 33,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    instructionText: {
        fontSize: 22,
        marginBottom: 10,
        textAlign: "center",
    },
    separator: {
        width: '80%',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        marginBottom: 20,
    },
    sectionContainer: {
        width: "100%",
        marginBottom: 20,
        alignItems: "center",
    },
    sectionHeader: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
    },
    sectionDescription: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: "center",
    },
    topicBox: {
        width: "90%",
        marginVertical: 10,
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#B8FBFC",
        alignItems: "center",
    },
    topicContainer: {
        width: "100%",
        margin: 10,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        borderRadius: 5,
        backgroundColor: "#58B9FA",
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
    },
    topic: {
        alignItems: "center",
        justifyContent: "center",
    },
    topicText: {
        color: "black",
        fontSize: 22,
        textTransform: "uppercase",
    },
    settingsButton: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 5,
        backgroundColor: "transparent",
        borderRadius: 5,
    },
});

export const HomeView: React.FC<{
    setPage: (page: Page, topic?: Topic) => void, // Change the type of topic parameter to Topic
    username: string,
}> = ({ setPage, username }) => {
    const welcomeMessage = username ? `Welcome to Learn Easy, ${username}!` : "Welcome to Learn Easy!";

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.headerSection}>
                    <Text style={styles.welcomeText}>{welcomeMessage}</Text>
                    <Text style={styles.instructionText}>Choose a topic to start</Text>
                    <View style={styles.separator} />
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>Languages</Text>
                    <Text style={styles.sectionDescription}>Learn vocabulary for Italian, Spanish, and French.</Text>
                    <View style={styles.topicBox}>
                        {["italian", "spanish", "french"].map((topic) => (
                            <View key={topic} style={styles.topicContainer}>
                                <TouchableOpacity onPress={() => { setPage("learn", topic as Topic) }} style={styles.topic}>
                                    <Text style={styles.topicText}>{topic.charAt(0).toUpperCase() + topic.slice(1)}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setPage("statistics", topic as Topic) }} style={styles.settingsButton}>
                                    <FontAwesome name="gear" size={20} color="black" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>Geography</Text>
                    <Text style={styles.sectionDescription}>Learn about world geography, countries, capitals, and more.</Text>
                    <View style={styles.topicBox}>
                        <View style={styles.topicContainer}>
                            <TouchableOpacity onPress={() => { setPage("learn", "geography") }} style={styles.topic}>
                                <Text style={styles.topicText}>Geography</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setPage("statistics", "geography") }} style={styles.settingsButton}>
                                <FontAwesome name="gear" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>History</Text>
                    <Text style={styles.sectionDescription}>Learn important historical events and figures.</Text>
                    <View style={styles.topicBox}>
                        <View style={styles.topicContainer}>
                            <TouchableOpacity onPress={() => { setPage("learn", "history") }} style={styles.topic}>
                                <Text style={styles.topicText}>History</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setPage("statistics", "history") }} style={styles.settingsButton}>
                                <FontAwesome name="gear" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};
