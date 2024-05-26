import { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Dimensions, Button, Text } from "react-native";
import { EventRegister } from 'react-native-event-listeners';
import { Header } from "./Header";
import { StatisticsView } from "./views/Statistics";
import { LearnView } from "./views/Learn";
import { SettingsView } from "./views/Settings";
import { HomeView } from "./views/Home";
import cardsImport from "../data/en_de_nouns_learning.json";
import { getConfigAsyncStorage, saveConfigAsyncStorage } from "./saveJson";
import { Card as Sm2Card } from "../sm2/sm2";


export const screenWidth = Dimensions.get("window").width || 360 //get screen width or use 360 = avg screen width
export const screenHeight = Dimensions.get("window").height || 800


const style = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: "100%",
        backgroundColor: 'yellow',
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

/**
 * available topics  
 * These are the available topics that can be set as `topic` state var in Layout  
 *
 * @nelin 
 * imo easiest way would be to use this as a list from where the topics on the main page are generated from (if u use setTopic onClick in the list the learn mode starts which already addes the topicconfig and saves it)   
 * or even better would be to have some ui to select which topics u want to learn (select from `topicsAvailable`) and for these topics add a topicConfig entry in the appConfig, then base the list in the main menu on the topics dict of the appConfig  
 * */
const topicsAvailable = ["en_de", "geography", "idktodo"] as const
export type Topic = typeof topicsAvailable[number]
// export type Topic = "en_de" | "geography" | "idktodo"
export type Medium = "img" | "text" | "audio"


/**
 * @emanuel
 * das is eig nur um die types nicer zu designen aber kannst auch direkt topicconfig verwenden.  
 * topicconfig is das plus mehr (cardslastadded zb is internal und nicht wichtig fur die settings)  
 * eig muss alles auf der appConfig basieren dass der state ueberall funktioniert und auch gespeichert wird
 */
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
    cardsLearning: (Card & { index: number })[]
    cardsLastAdded?: number
    /**
     * interval in ms in which new cards are added.  
     * default should be 1 day but 1 min is helpful for testing
     */
    interval: number
}

const TopicConfigDefault: TopicConfig = {
    cardsLearning: [],
    cardsPerDay: 1,
    mediums: ["img", "text", "audio"],
    // interval: 1000 * 60 * 60 * 24 // 1d
    interval: 1000 * 60 * 1 // 1min 
    // cardsLastAdded: null
}

export interface AppConfig {
    username?: string,
    topics: { [key in Topic]?: TopicConfig }
}

const AppConfigDefault = {
    topics: {}
}

export interface SettingsParams {
    username: string,
    mediums: Medium[],
    cardsPerDay: number,
}

export interface AppConfigInterface {
    config: AppConfig,
    setConfig: Function,
}


export interface CardSrc {
    question: string
    answer: string
    img?: string
    sound?: string
}

type Card = CardSrc & Sm2Card

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
     * 
     * @emanuel 
     * this should not be used, rather use appConfig itself so it gets updated and also written to persistent storage
     * 
     * todo: remove that and use appconfig!!!
     * 
     * arr in the order the different mediums should be shown on the cards  
     * 
     * ask: 
     * could be done for front and back but idk if we rlly need that, also the order!?  
     * depends on how much work we want to put in the settings page  
    */
    let [mediumSettings, setMediumSettings] = useState<SettingsParams['mediums']>(["img", "text", "audio"]);



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

    const [cards, setCards] = useState<CardSrc[]>(); //default string shown at start, is replaced by username when set

    /**
     * used to dynamically load the cards from json file  
     * 
     */
    const loadCards = async (topic: Topic) => {

        /**
         * this would have been nice but its a metro feature to not be able to dynamically import anything but a string, not even const from this map  
         * might work with some babel presets  
         */
        const pathMap2: { [key in Topic]: `../data/${key}.json` } =
        {
            en_de: "../data/en_de.json",
            geography: "../data/geography.json",
            idktodo: "../data/idktodo.json"
        }

        const importMap: { [key in Topic]: Promise<CardSrc[]> } =
        {
            en_de: import("../data/en_de.json").then(module => module.default),
            geography: import("../data/geography.json").then(module => module.default),
            idktodo: import("../data/idktodo.json").then(module => module.default),
        }
        const fileImport = importMap[topic]

        fileImport.then(res => {
            console.log("loading cards from json file")
            setCards(res)
        }).catch(err => {
            console.error("error loading cards for topic: " + topic)
            console.error(err)
        });
    }

    const getMainContent = () => {
        if (!appConfig) throw new Error("app config is required for main content, its checked in render method, rn cant infer it");

        // this is mb not ideal but works for me @emanuel  
        // default config is used here for topicConfig and merged with actual config, mb better to actually set the appConfig in case of default
        // you have to use the appConfig in settings and set it with the react set state fn, then it should auto update.. hopefully
        let topicConfig = { ...TopicConfigDefault, ...appConfig.topics[topic] }
        console.log('tc')
        console.log(topicConfig)
        switch (page) {
            case "home":
                return <HomeView
                    setPage={setPage}
                    username={username}
                />
            case "settings":
                return <SettingsView config={appConfig} setConfig={setAppConfig} />
            case "learn":
                console.log("learn in getmaincontentr")
                // no topic selected, err
                if (!topic) throw new Error("topic has to be selected before going to learn page"); //todo: make default nullish

                // if (!cards) // could use that to improve performance but requires cards to be nullish after topic change 
                loadCards(topic)

                if (!cards) return <Text>loading cards...</Text>

                const onCardRated = (c: Card & { index: number }) => {
                    setAppConfig(prev => {
                        if (!prev) throw new Error("appConfig has to be set by the time cards are rated.");

                        return {
                            ...prev,
                            topics: {
                                ...prev.topics,
                                [topic]:
                                {
                                    ...prev.topics[topic],
                                    cardsLearning: prev.topics[topic]?.cardsLearning.map((item, i) =>
                                        i === c.index ? c : item
                                    ),

                                }
                            }
                        }
                    })
                }

                let interval = topicConfig.interval
                // add new cards if more than 24h since last added or none added yet
                // ask: do we have/want a progress bar or sth showing how many new cards there are on main page? then this should be done before going to the learn page for all topics
                console.log("add cards")
                let cardsLastAddedTime = topicConfig.cardsLastAdded
                // let cardsLearning = appConfig?.topics[topic]?.cardsLearning || TopicConfigDefault.cardsLearning

                // cards learning should be increased 
                let cardsLearning = topicConfig.cardsLearning

                console.log(cardsLastAddedTime)
                console.log(new Date().getTime())
                console.log(interval)
                if (!cardsLastAddedTime || (new Date().getTime() - cardsLastAddedTime) > interval) {

                    let cardsPerDay = topicConfig.cardsPerDay
                    let newCards = cards.slice(cardsLearning.length, cardsLearning.length + cardsPerDay)


                    setAppConfig(prev => {
                        return {
                            ...prev,
                            topics: {
                                ...prev?.topics,
                                [topic]:
                                {
                                    ...prev?.topics[topic],
                                    cardsLearning: cardsLearning.concat(newCards.map((el, i) => ({
                                        ...el,

                                        // index to map card to position in json definition file
                                        index: cardsLearning.length + i,

                                        // sm2
                                        n: 0,
                                        ef: 2.5,
                                        i: 0,

                                        // exact time when added
                                        due: new Date().getTime()
                                    })
                                    )),

                                    cardsLastAdded: new Date().getTime()
                                }
                            }
                        }
                    })
                }



                return <>
                    {
                        cardsLearning ?
                            <LearnView
                                key="learnView"
                                onCardRated={onCardRated}
                                // topicConfig={appConfig.topics[topic]}
                                // cardsScheduled={appConfig.topics[topic]?.cardsLearning}
                                cardsLearning={appConfig.topics[topic]?.cardsLearning ?? []}
                                // mediumSettings={appConfig.topics[topic]?.mediums ?? TopicConfigDefault.mediums}
                                mediumSettings={topicConfig.mediums}
                            />
                            :
                            <>
                                <Text>no cards scheduled rn</Text>
                                <Text>add {topicConfig.cardsPerDay} cards now todo</Text>
                            </>
                    }
                </>


            case "statistics":
                return <StatisticsView mediums={mediumSettings} cardsPerDay={topicConfig?.cardsPerDay ?? 0} username={username} />

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