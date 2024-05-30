import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from 'react';
import CheckBox from 'expo-checkbox';
import { Picker } from '@react-native-picker/picker';
import { AppConfig, Medium, Topic, TopicConfig, TopicConfigDefault, topicsAvailable } from "../Layout";


export interface SettingsViewProps {
    appConfig: AppConfig,
    setAppConfig: React.Dispatch<React.SetStateAction<AppConfig>>,
}

/**
 * Settings view    
 */
export const SettingsView: React.FC<SettingsViewProps> = ({ appConfig, setAppConfig }) => {
    console.log("SettingsView")
    const [topic, setTopic] = useState<Topic>("en_de");
    const [nickname, setNickname] = useState("");
    const [notifications, setNotifications] = useState(true); // not used rn

    const TopicSettings = () => {
        let tc = { ...TopicConfigDefault, ...appConfig.topics[topic] }
        /**
         * always the same order  
         * from {@link TopicConfigDefault}:   
         * mediums: ["img", "text", "audio"],  
         * 
         */
        let mediaConfig = tc?.mediums || TopicConfigDefault.mediums

        let img = mediaConfig.includes("img")
        let text = mediaConfig.includes("text")
        let audio = mediaConfig.includes("audio")

        let mediaArr = () => {
            let arr = []
            if (img) arr.push("img")
            if (text) arr.push("text")
            if (audio) arr.push("audio")
            return arr
        }

        const setMediaType = (type: Medium) => {
            switch (type) {
                case ("img"):
                    img = !img
                    break;
                case ("audio"):
                    audio = !audio
                    break;
                case ("audio"):
                    text = !text
                    break;
            }
            setAppConfig(prev => {
                return {
                    ...prev,
                    // topics[topic].mediums: mediaArr(),
                    topics: {
                        ...prev.topics,
                        [topic]: {
                            ...prev.topics[topic],
                            mediums: mediaArr()
                        }
                    }
                }
            })
        }

        return (
            <>
                <View style={styles.checkboxContainer}>
                    <Text style={styles.inputText}>Show Images:</Text>
                    <CheckBox
                        value={img}
                        onValueChange={() => setMediaType("img")}
                    />
                </View>
                <View style={styles.checkboxContainer}>
                    <Text style={styles.inputText}>Show Text:</Text>
                    <CheckBox
                        value={text}
                        onValueChange={() => setMediaType("text")}
                    />
                </View>
                <View style={styles.checkboxContainer}>
                    <Text style={styles.inputText}>Show Audio:</Text>
                    <CheckBox
                        value={audio}
                        onValueChange={() => setMediaType("audio")}
                    />
                </View>
                {/* <View style={styles.checkboxContainerAutoplay}>
                    <Text style={styles.inputTextAutoplay}>Autoplay Audio:</Text>
                    <CheckBox
                    disabled={false}
                    value={autoplay}
                    onValueChange={(newValue) => setAutoplay(newValue)}
                    />
                </View> */}
                <View style={styles.rowContainer}>
                    <Text style={styles.inputText}>Cards per Day:</Text>
                    <TextInput
                        style={styles.input}
                        // onChangeText={(value) => setCardsPerDay(Number(value))}
                        onSubmitEditing={() => { }}
                        placeholder="xxx"
                        value={String(tc?.cardsPerDay)}
                    />
                </View>
            </>
        )
    }
    return (
        <ScrollView style={styles.mainContainer}>
            <Text style={styles.title}>General</Text>
            <View style={styles.subContainer}>
                <View style={styles.rowContainer}>
                    <Text style={styles.inputText}>username:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(value) => setNickname(value)}
                        onSubmitEditing={() => {
                            setAppConfig(prev => ({
                                ...prev,
                                username: nickname
                            }));


                        }}
                        placeholder="enter username here"
                        value={appConfig.username}
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
                    selectedValue={topic}
                    onValueChange={(itemValue, itemIndex) => {
                        setTopic(itemValue);
                    }}
                >
                    {
                        topicsAvailable.map(topic => (
                            <Picker.Item key={topic} label={topic} value={topic} />
                        ))
                    }
                </Picker>
                <TopicSettings></TopicSettings>
            </View>
        </ScrollView>
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
