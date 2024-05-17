import {  StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from 'react';
import CheckBox from 'expo-checkbox';


/**
 * Settings view    
 */
export const SettingsView: React.FC<{}> = ({ }) => {

    const [username, setUsername] = useState("");
    const [notifications, setNotifications] = useState(true);
    const [showImages, setShowImages] = useState(true);
    const [showAudio, setShowAudio] = useState(true);
    const [autoplay, setAutoplay] = useState(true);

    return (
    <View style={styles.mainContainer}>
        <Text style={styles.title}>General</Text>
        <View style={styles.subContainer}>
            <View style={styles.rowContainer}>
                <Text style={styles.inputText}>username:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(value) => setUsername(value)}
                    placeholder={"enter your username here"}
                />
            </View>
            <View style={styles.checkboxContainer}>
                <Text style={styles.inputText}>Notifications:</Text>
                <CheckBox
                    disabled={false}
                    value={notifications}
                    onValueChange={(newValue) => setNotifications(newValue)}
                />
            </View>
        </View>
        <Text style={styles.title}>Media</Text>
        <View style={styles.subContainer}>
            <View style={styles.checkboxContainer}>
                <Text style={styles.inputText}>Show Images:</Text>
                <CheckBox
                    disabled={false}
                    value={showImages}
                    onValueChange={(newValue) => setShowImages(newValue)}
                />
            </View>
            <View style={styles.checkboxContainer}>
                <Text style={styles.inputText}>Show Audio:</Text>
                <CheckBox
                    disabled={false}
                    value={showAudio}
                    onValueChange={(newValue) => setShowAudio(newValue)}
                />
            </View>
            <View style={styles.checkboxContainer}>
                <Text style={styles.inputText}>Autoplay:</Text>
                <CheckBox
                    disabled={false}
                    value={autoplay}
                    onValueChange={(newValue) => setAutoplay(newValue)}
                />
            </View>
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
    button: {
      height: 40,
      padding: 10,
      marginVertical: 2,
      backgroundColor: '#0645AD',
    },
    buttonText: {
      color: '#fff',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        marginLeft: 64,
        marginRight: 64,
        marginBottom: 10,
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    input: {
      height: 40,
      margin: 2,
      borderWidth: 1,
      padding: 10,
    },
    inputText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    mainContainer: {
        marginHorizontal: 20,
        backgroundColor: '#d2d2d2',
        padding: 10,
        borderRadius: 5,
      },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    subContainer: {
        marginHorizontal: 20,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 5,
    },
    title: {
      fontSize: 16,
      textAlign: 'center',
      fontWeight: 'bold',
      marginTop: 42,
    },
  });
  