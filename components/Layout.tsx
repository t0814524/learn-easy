import { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Dimensions, Button, Text } from "react-native";
import { EventRegister } from 'react-native-event-listeners';
import { Header } from "./Header";
import { StatisticsView } from "./views/Statistics";
import { LearnView } from "./views/Learn";
import { SettingsView } from "./views/Settings";
import { HomeView } from "./views/Home";
import cards from "../data/en_de_nouns_learning.json";
import { getConfigAsyncStorage, saveConfigAsyncStorage } from "./saveJson";


export const screenWidth = Dimensions.get("window").width || 360 //get screen width or use 360 = avg screen width
export const screenHeight = Dimensions.get("window").height || 800


const style = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: "column",
        minHeight: "100%",
        backgroundColor: 'yellow',
        // alignItems: 'center',
        // justifyContent: 'center',
        // backgroundColor: "#ffe8bf",
        // width: "100%"
    },
    headerSection: {
        flex: 0.7,
        width: "100%",
        minHeight: 56, //  https://m3.material.io/components/search/specs
        backgroundColor: "#59A9FC",
        flexDirection: "row",
    },
    mainSection: {
        flex: 10,
        backgroundColor: "#F8DDFD"
    }

})

export type Topic = "en_de" | "geography" | "idktodo"
export type Medium = "img" | "text" | "audio"



export interface SettingsParams {
    username: string,
    mediums: Medium[],
    cardsPerDay: number,
}
/**
 * @nelin, @emanuel 
 * I d propose sth like that as settings: 
 * idk if this requires changes from u
 */
export interface SettingsParams2 {
    username: string,
    topics: { [key in Topic]?: TopicSettings }
}

interface TopicSettings {
    mediums: Medium[],
    /**
     * todo put that in the settings
     */
    cardsPerDay: number,

}

/**
 * settings plus additional configs  
 * use some sort of persistent storage to save this config / the state of the app  
 */
export interface TopicConfig extends TopicSettings {
    /**
     * number of cards being learnt  
     * 
     * As we do not implement sorting of decks and they have a fixed order, we can store a list of cards per topic.  
     * A number ({@link cardsLearning}) which is the index up to which the cards are currently being lernt.  
     * An array for cardsScheduled can be generated from the currently learnt cards under consideration of the sm2 properties.  
     */
    cardsLearning: number
    cardsLastAdded?: number
}

const TopicConfigDefault: TopicConfig = {
    cardsLearning: 0,
    cardsPerDay: 5,
    mediums: ["img", "text", "audio"],
    // cardsLastAdded: null
}

export interface AppConfig {
    username?: string,
    topics: { [key in Topic]?: TopicConfig }
}

const AppConfigDefault = {
    topics: {}
}


export interface Card {
    question: string
    answer: string
    img?: string
    sound?: string
}

export type Page = "home" | "learn" | "settings" | "statistics"
export const Layout = () => {
    let [appConfig, setAppConfig] = useState<AppConfig>();

    /**
     * save app config to file and state  
     * @param config AppConfig to save  
     */
    const saveConfig = (config: AppConfig) => {
        if (appConfig) {
            console.log("saving config")
            // setAppConfig(config)
            saveConfigAsyncStorage(config)
        }
    }
    useEffect(() => {
        console.log("empty eff")
        const getConfigFromStorage = async () => {
            const config = await getConfigAsyncStorage()
            console.log("setAppconfig")
            console.log(config)
            setAppConfig(config ?? AppConfigDefault)

            // if (!config) {
            //     config = AppConfigDefault
            //     console.log("got config from default")
            // }
            // console.log("got config:")
            // console.log(config)
        }
        getConfigFromStorage()
    }, []);

    useEffect(() => {
        console.log("appconfig effect")
        if (appConfig) saveConfig(appConfig)
    }, [appConfig]);




    let [page, setPage] = useState<Page>("home");

    //todo: @nelin pls impl setting the topic in home page
    let [topic, setTopic] = useState<Topic>("en_de");

    const [username, setUsername] = useState(""); //default string shown at start, is replaced by username when set



    /**
     * arr in the order the different mediums should be shown on the cards  
     * 
     * ask: 
     * could be done for front and back but idk if we rlly need that, also the order!?  
     * depends on how much work we want to put in the settings page  
     */
    let [mediumSettings, setMediumSettings] = useState<SettingsParams['mediums']>(["img", "text", "audio"]);

    /**
     * cards that need to be reviewed  
     * todo: probably need componentDidMount or some bs here and write to file
     */
    let [cardsScheduled, setCardsScheduled] = useState<Card[]>();
    let [cardsAddedLast, setCardsAddedLast] = useState();


    //todo: get config from file, temp config
    // let config: AppConfig = {
    //     username: "tobias",
    //     topics: {
    //         en_de: { ...TopicConfigDefault }
    //     }
    // }

    let [topicConfig, setTopicConfig] = useState<TopicConfig>();

    // useEffect(() => {
    //     let asdf: AppConfig = {
    //         ...appConfig,
    //         topics: {
    //             [topic]: topicConfig
    //         }
    //     }
    //     setAppConfig(asdf)
    // }, [topicConfig]);

    //todo: test if i need that
    // useEffect(() => {
    //     setTopicConfig(config.topics[topic])
    // }, [topic]);

    useEffect(() => {
        EventRegister.addEventListener('toggleMedia', (media) => {
            console.log(media);
            setMediumSettings(media);
        });
        return () => {
            EventRegister.removeEventListener('toggleMedia');
        }
    }, []);

    useEffect(() => {
        EventRegister.addEventListener('submitUsername', (username) => {
            console.log("new username == " + username);
            setUsername(username);
        });
        return () => {
            EventRegister.removeEventListener('submitUsername');
        }
    }, []);


    const Separator = () => <View style={{
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth
    }} />;

    const getMainContent = () => {
        if (!appConfig) throw new Error("app config is required for main content, its checked in render method, rn cant infer it");

        switch (page) {
            case "home":
                return <HomeView
                    setPage={setPage}
                    username={username}
                />
            case "settings":
                return <SettingsView mediums={mediumSettings} cardsPerDay={topicConfig?.cardsPerDay ?? 0} username={username} />
            case "learn":
                console.log("learn in getmaincontentr")
                // no topic selected, err
                if (!topic) throw new Error("topic has to be selected before going to learn page"); //todo: make default nullish



                // there is no config for this topic yet  
                // if (!config.topics[topic])
                // setTopicConfig({
                //     ...TopicConfigDefault,
                //     cardsLearning: TopicConfigDefault.cardsPerDay,
                //     cardsLastAdded: new Date,
                // })
                // else {

                // use config if already assigned (just need to save at some point), else use from config file, else use default
                console.log("appConfig")
                console.log(appConfig)

                if (!appConfig.topics[topic]) setAppConfig({ ...appConfig, topics: { [topic]: TopicConfigDefault } }) // set default config if no config defined for topic  

                // console.log(appConfig)
                // let cardsLearningNew = appConfig.topics[topic]?.cardsLearning! + appConfig.topics[topic]?.cardsPerDay!

                // let interval = 1000 * 60 * 60 * 24 // 1d
                let interval = 1000 * 60 * 2 // 1d
                // add new cards if more than 24h since last added or none added yet
                console.log("add cards")
                let cardsLastAddedTime = appConfig?.topics[topic]?.cardsLastAdded
                if (!cardsLastAddedTime || (new Date().getTime() - cardsLastAddedTime) > interval) { //todotodo: need to put that into one thing i think because otherwise it would need useeff to be available which creates a loop or cancel the setstate with return prev which also creates a lopp!!!! fk react
                    // increse cards learning
                    setAppConfig(prev => {
                        // let cardsLastAddedTime = prev?.topics[topic]?.cardsLastAdded
                        // console.log("cardsLastAddedTime")
                        // console.log(cardsLastAddedTime)
                        // if (!cardsLastAddedTime || (new Date().getTime() - cardsLastAddedTime) > interval) {
                        //     console.log("in iffff")

                        return {
                            ...appConfig, topics: {
                                [topic]: {
                                    cardsLearnign: prev?.topics[topic]?.cardsLearning! + prev?.topics[topic]?.cardsPerDay!,
                                    cardsLastAdded: new Date().getTime()
                                }
                            }
                        }
                        // }

                        console.log("ret prev")

                        return prev
                    })
                }


                // let tc = appConfig!.topics[topic] || TopicConfigDefault // assert existence because getMainContent is only rendered if appConfig is truthy
                // tc.cardsLearning += TopicConfigDefault.cardsPerDay
                // tc.cardsLastAdded = new Date()


                // scuffed state mutation but should be alright as long as u cant edit the config from learn page,...  cant set here bc of fkn loop
                // setTopicConfig(TopicConfigDefault)

                return <LearnView
                    topicConfig={appConfig.topics[topic]}
                    cards={cards}
                    mediumSettings={mediumSettings}
                />
            case "statistics":
                return <StatisticsView />

            default:
                throw new Error("Illegal page value");

        }
    }

    return (
        <View>

            {/* prevent nodge etc. from blocking header */}
            <SafeAreaView id="container" style={style.container}>
                <View
                    id="headerSection"
                    style={style.headerSection}
                >
                    <Header
                        page={page}
                        setPage={setPage}
                    ></Header>
                </View>
                <View
                    id="mainSection"
                    style={style.mainSection}
                >
                    {appConfig ? // main content is dependent on config
                        getMainContent()
                        : <Text>loading config...</Text>
                    }
                </View>
            </SafeAreaView >
        </View>
    );
};