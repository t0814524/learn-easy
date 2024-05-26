import { StyleSheet, Text, TextInput, View } from "react-native";
import { FunctionComponent, useEffect, useState } from 'react';
import CheckBox from 'expo-checkbox';
import { EventRegister } from 'react-native-event-listeners';
import { AppConfig, AppConfigInterface, Medium, SettingsParams } from "../Layout";

/**
 * Settings view    
 */
export const SettingsView: FunctionComponent<AppConfigInterface> = ({ config, setConfig}) => {

    const [currentTopic, setCurrentTopic] = useState("");
    const [currentMedia, setCurrentMedia] = useState(Array<Medium>());
    const [cardsPerDay, setCardsPerDay] = useState(0);

    const [nickname, setNickname] = useState("");
    const [notifications, setNotifications] = useState(true);
    const [showImages, setShowImages] = useState(false);
    const [showText, setShowText] = useState(false);
    const [showAudio, setShowAudio] = useState(false);
    const [autoplay, setAutoplay] = useState(true);

    function saveSettings(mediaArray: Medium[]){
        let newConfig = {
            username: nickname,
            topics: { "en_de": {mediums: mediaArray, cardsPerDay: cardsPerDay, cardsLearning: [], cardsLastAdded: 42, interval: 1000 * 60 * 1},
                        "geography": {mediums: Array<Medium>("img", "text", "audio"), cardsPerDay: 42, cardsLearning: [], cardsLastAdded: 42, interval: 1000 * 60 * 1},
                        "idktodo": {mediums: Array<Medium>("img", "text", "audio"), cardsPerDay: 42, cardsLearning: [], cardsLastAdded: 42, interval: 1000 * 60 * 1}
                    }
        }
        setConfig(newConfig);
    }
    
    function makeMediaArray(char: string, activated: boolean) {
        let array = new Array<Medium>();
        switch (char) {
            case 'i': {
                activated ? array = array.concat("img") : {};
                showText ? array = array.concat("text") : {};
                showAudio ? array = array.concat("audio") : {};
                break;
            }
            case 't': {
                showImages ? array = array.concat("img") : {};
                activated ? array = array.concat("text") : {};
                showAudio ? array = array.concat("audio") : {};
                break;
            }
            case 'a': {
                showImages ? array = array.concat("img") : {};
                showText ? array = array.concat("text") : {};
                activated ? array = array.concat("audio") : {};
                break;
            }
        }
        //console.log(array[0]+array[1]+array[2]);
        return array;
    }

    function toggleShowImages(newValue: boolean) {
        setShowImages(newValue);
        saveSettings(makeMediaArray('i', newValue));
    }

    function toggleShowText(newValue: boolean) {
        setShowText(newValue);
        saveSettings(makeMediaArray('t', newValue));
    }

    function toggleShowAudio(newValue: boolean) {
        setShowAudio(newValue);
        saveSettings(makeMediaArray('a', newValue));
    }

    function determineSettings() {
        console.log("determineSettings() has been called!");
        console.log(config);
        let mediums = config.topics.en_de?.mediums;
        console.log(mediums);
        if(mediums){
            for (let i = 0; i < mediums.length; ++i) {
                switch (mediums[i]) {
                    case "img": setShowImages(true); break;
                    case "text": setShowText(true); break;
                    case "audio": setShowAudio(true); break;
                }
            }
        }
        setNickname(config.username ?? "");
        setCurrentTopic("en_de");
        setCurrentMedia(config.topics.en_de?.mediums ?? ["img","text"]);
        setCardsPerDay(config.topics.en_de?.cardsPerDay ?? 42);
    }

    function submitNewUsername() {
        //console.log(nickname);
        EventRegister.emit('submitUsername', nickname);
    }

    useEffect(() => {
        determineSettings();
    }, [])

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title}>General</Text>
            <View style={styles.subContainer}>
                <View style={styles.rowContainer}>
                    <Text style={styles.inputText}>username:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(value) => setNickname(value)}
                        onSubmitEditing={() => submitNewUsername()}
                        placeholder="enter username here"
                        value={nickname}
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
                        onValueChange={() => toggleShowImages(!showImages)}
                    />
                </View>
                <View style={styles.checkboxContainer}>
                    <Text style={styles.inputText}>Show Text:</Text>
                    <CheckBox
                        disabled={false}
                        value={showText}
                        onValueChange={() => toggleShowText(!showText)}
                    />
                </View>
                <View style={styles.checkboxContainer}>
                    <Text style={styles.inputText}>Show Audio:</Text>
                    <CheckBox
                        disabled={false}
                        value={showAudio}
                        onValueChange={() => toggleShowAudio(!showAudio)}
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
