import {  StyleSheet, Text, TextInput, View } from "react-native";
import { FunctionComponent, useEffect, useState } from 'react';
import CheckBox from 'expo-checkbox';
import { EventRegister } from 'react-native-event-listeners';
import { SettingsParams } from "../Layout";

/**
 * Settings view    
 */
export const SettingsView: FunctionComponent<SettingsParams> = ({mediums, cardsPerDay}) => {

    const [username, setUsername] = useState("");
    const [notifications, setNotifications] = useState(true);
    const [showImages, setShowImages] = useState(false);
    const [showText, setShowText] = useState(false);
    const [showAudio, setShowAudio] = useState(false);
    const [autoplay, setAutoplay] = useState(true);

    function makeMediaArray(char: string, activated: boolean){
        let array = new Array<string>();
        switch(char){
            case 'i':{
                activated ? array = array.concat("img") : {};
                showText ? array = array.concat("text") : {};
                showAudio ? array = array.concat("audio") : {};
                break;
            }
            case 't':{
                showImages ? array = array.concat("img") : {};
                activated ? array = array.concat("text") : {};
                showAudio ? array = array.concat("audio") : {};
                break;
            }
            case 'a':{
                showImages ? array = array.concat("img") : {};
                showText ? array = array.concat("text") : {};
                activated ? array = array.concat("audio") : {};
                break;
            }
        }
        //console.log(array[0]+array[1]+array[2]);
        return array;
    }
    
    function toggleShowImages(newValue: boolean){
        setShowImages(newValue);
        EventRegister.emit('toggleMedia', makeMediaArray('i',newValue));
    }

    function toggleShowText(newValue: boolean){
        setShowText(newValue);
        EventRegister.emit('toggleMedia', makeMediaArray('t',newValue));
    }

    function toggleShowAudio(newValue: boolean){
        setShowAudio(newValue);
        EventRegister.emit('toggleMedia', makeMediaArray('a',newValue));
    }

    function determineSettings(){
        for(let i=0;i<mediums.length;++i){
            switch(mediums[i]){
                case "img": setShowImages(true); break;
                case "text": setShowText(true); break;
                case "audio": setShowAudio(true); break;
            }
        }
        console.log("determineSettings() has been called!");
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
  