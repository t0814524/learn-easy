import React from "react";
import { Text, TouchableOpacity, StyleSheet, View, ScrollView } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Page } from "../Layout";
import { styles } from "../style";



export const HomeView: React.FC<{
    setPage: (page: Page, topic?: string) => void,
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
                                <TouchableOpacity onPress={() => { setPage("learn", topic) }} style={styles.topic}>
                                    <Text style={styles.topicText}>{topic.charAt(0).toUpperCase() + topic.slice(1)}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setPage("statistics") }} style={styles.settingsButton}>
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
                            <TouchableOpacity onPress={() => { setPage("statistics") }} style={styles.settingsButton}>
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
                            <TouchableOpacity onPress={() => { setPage("statistics") }} style={styles.settingsButton}>
                                <FontAwesome name="gear" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};
