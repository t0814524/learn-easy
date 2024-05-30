import React from "react";
import { Text, TouchableOpacity, StyleSheet, View, ScrollView } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Page, Topic } from "../Layout";
import { styles } from "../style";



export const HomeView: React.FC<{
    setPage: (page: Page, topic?: Topic) => void, // Change the type of topic parameter to Topic
    username?: string,
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
                    <Text style={styles.sectionDescription}>German, Italian, Spanish, and French vocabulary.</Text>
                    <View style={styles.topicBox}>
                        {["german", "italian", "spanish", "french"].map((topic) => (
                            <View key={topic} style={styles.topicContainer}>
                                <TouchableOpacity onPress={() => { setPage("learn", topic as Topic) }} style={styles.topic}>
                                    <Text style={styles.topicText}>{topic.charAt(0).toUpperCase() + topic.slice(1)}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setPage("statistics", topic as Topic) }} style={styles.settingsButton}>
                                    <FontAwesome name="bar-chart" size={20} color="black" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>Geography</Text>
                    <Text style={styles.sectionDescription}>Memorize countries' capitals.</Text>
                    <View style={styles.topicBox}>
                        <View style={styles.topicContainer}>
                            <TouchableOpacity onPress={() => { setPage("learn", "geography") }} style={styles.topic}>
                                <Text style={styles.topicText}>Geography</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setPage("statistics", "geography") }} style={styles.settingsButton}>
                                <FontAwesome name="bar-chart" size={20} color="black" />
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
                                <FontAwesome name="bar-chart" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};
