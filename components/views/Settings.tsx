import { StyleSheet, Text, TextInput, View } from "react-native";
import { FunctionComponent, useEffect, useState } from 'react';
import CheckBox from 'expo-checkbox';
import { EventRegister } from 'react-native-event-listeners';
import { Picker } from '@react-native-picker/picker';
import { AppConfig, AppConfigInterface, Medium, SettingsParams, Topic, topicsAvailable } from "../Layout";

/**
 * Settings view    
 */
export const SettingsView: FunctionComponent<AppConfigInterface> = ({ config, setConfig}) => {

    //console.log(config);
    let currentConfig = config;
    const [currentTopic, setCurrentTopic] = useState("en_de");
    const [currentMedia, setCurrentMedia] = useState(Array<Medium>());
    const [cardsPerDay, setCardsPerDay] = useState(0);

    const [nickname, setNickname] = useState("");
    const [notifications, setNotifications] = useState(true);
    const [showImages, setShowImages] = useState(false);
    const [showText, setShowText] = useState(false);
    const [showAudio, setShowAudio] = useState(false);
    const [autoplay, setAutoplay] = useState(true);

    function saveSettings(mediaArray: Medium[]){
        switch(currentTopic){
            case topicsAvailable[0]:{
                if(currentConfig.topics.en_de){
                    currentConfig.topics.en_de.mediums = mediaArray;
                }
                break;
            }
            case topicsAvailable[1]:{
                if(currentConfig.topics.geography){
                    currentConfig.topics.geography.mediums = mediaArray;
                }
                break;
            }
            case topicsAvailable[2]:{
                if(currentConfig.topics.idktodo){
                    currentConfig.topics.idktodo.mediums = mediaArray;
                }
                break;
            }
        }
        setConfig(currentConfig);
        determineSettings();
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
        console.log(currentConfig);
        let mediums: Medium[] | undefined;
        let cardsPerDay: number = 0;
        switch(currentTopic){
            case topicsAvailable[0]:{
                if(currentConfig.topics.en_de && currentConfig.topics.en_de.mediums){
                    mediums = currentConfig.topics.en_de!.mediums;
                    cardsPerDay = currentConfig.topics.en_de!.cardsPerDay;
                    console.log("en_de-media: "+mediums);
                }
                break;
            }
            case topicsAvailable[1]:{
                if(currentConfig.topics.geography && currentConfig.topics.geography.mediums){
                    mediums = currentConfig.topics.geography!.mediums;
                    cardsPerDay = currentConfig.topics.geography!.cardsPerDay;
                    console.log("geography-media: "+mediums);
                }
                break;
            }
            case topicsAvailable[2]:{
                if(currentConfig.topics.idktodo && currentConfig.topics.idktodo.mediums){
                    mediums = currentConfig.topics.idktodo!.mediums;
                    cardsPerDay = currentConfig.topics.idktodo!.cardsPerDay;
                    console.log("idktodo-media: "+mediums);
                }
                break;
            }
        }
        //console.log(mediums);
        //reset checkboxes:
        setShowImages(false);
        setShowText(false);
        setShowAudio(false);
        //set checkboxes:
        if(mediums){
            for (let i = 0; i < mediums.length; ++i) {
                switch (mediums[i]) {
                    case "img": setShowImages(true); break;
                    case "text": setShowText(true); break;
                    case "audio": setShowAudio(true); break;
                }
            }
        }
        setNickname(currentConfig.username ?? "");
        setCardsPerDay(cardsPerDay);
    }

    function submitNewUsername() {
        //console.log(nickname);
        EventRegister.emit('submitUsername', nickname);
    }

    useEffect(() => {
        determineSettings();
    }, [])

    // on value change of currentTopic: show settings for that topic!
    useEffect(() => {
        console.log("currentTopic=="+currentTopic);
        determineSettings();
        //console.log("currentTopic=="+currentTopic);
    }, [currentTopic])

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
            <Picker
                selectedValue={currentTopic}
                onValueChange={(itemValue, itemIndex) => {
                    setCurrentTopic(itemValue); 
                }}
            >
                <Picker.Item label="English" value="en_de" />
                <Picker.Item label="Geography" value="geography" />
                <Picker.Item label="History" value="idktodo" />
                <Picker.Item label="Italian" value="idktodo" />
                <Picker.Item label="Spanish" value="idktodo" />
            </Picker>
                <View style={styles.checkboxContainer}>
                    <Text style={styles.inputText}>Show Images:</Text>
                    <CheckBox
                        disabled={false}
                        value={showImages}
                        onValueChange={() => toggleShowImages(!showImages)}
                    />
                </View>
                {/*<View style={styles.checkboxContainer}>
                    <Text style={styles.inputText}>Show Text:</Text>
                    <CheckBox
                        disabled={true}
                        value={showText}
                        onValueChange={() => toggleShowText(!showText)}
                    />
                </View>*/}
                <View style={styles.checkboxContainer}>
                    <Text style={styles.inputText}>Show Audio:</Text>
                    <CheckBox
                        disabled={false}
                        value={showAudio}
                        onValueChange={() => toggleShowAudio(!showAudio)}
                    />
                </View>
                <View style={styles.checkboxContainerAutoplay}>
                    <Text style={styles.inputTextAutoplay}>Autoplay Audio:</Text>
                    <CheckBox
                        disabled={false}
                        value={autoplay}
                        onValueChange={(newValue) => setAutoplay(newValue)}
                    />
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.inputText}>Cards per Day:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(value) => setCardsPerDay(Number(value))}
                        onSubmitEditing={() => {}}
                        placeholder="xxx"
                        value={String(cardsPerDay)}
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
        marginLeft: 32,
        marginRight: 64,
        marginBottom: 10,
    },
    checkboxContainerAutoplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
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
    inputTextAutoplay: {
        color: '#212f3d',
        fontSize: 14,
        fontWeight: 'regular',
        marginRight: 10,
    },
    mainContainer: {
        marginHorizontal: 20,
        backgroundColor: '#d2d2d2',
        padding: 10,
        borderRadius: 5,
        paddingBottom: 300,
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
