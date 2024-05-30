import { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Dimensions, Button, Text } from "react-native";
import { Header } from "./Header";
import { StatisticsView } from "./views/Statistics";
import { LearnView } from "./views/Learn";
import { SettingsView } from "./views/Settings";
import { HomeView } from "./views/Home";
import { getConfigAsyncStorage, saveConfigAsyncStorage } from "./saveJson";
import { Card as Sm2Card } from "../sm2/sm2";
import { TopicConfigDefault, topicsAvailable } from "./constants";


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

export type Topic = typeof topicsAvailable[number]

export type Medium = "img" | "text" | "audio"

/**
 * params required for settings  
 * subset of TopicConfig
 */
interface TopicSettings {
    mediums: Medium[],
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
     * The length of this arr can be used as index, up to which the cards are currently being lernt.  
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

export interface AppConfig {
    username?: string,
    topics: { [key in Topic]?: TopicConfig }
}

export const AppConfigDefault = {
    topics: {}
}

export interface CardSrc {
    question: string
    answer: string
    img?: string
    sound?: string
}

export type Card = CardSrc & Sm2Card

export type Page = "home" | "learn" | "settings" | "statistics"
export const Layout = () => {

    let [loading, setLoading] = useState(true);
    let [appConfig, setAppConfig] = useState<AppConfig>(AppConfigDefault);

    /**
     * save app config to file and state  
     * @param config AppConfig to save  
     */
    const saveConfig = (config: AppConfig) => {
        console.log("saveConfig");
        if (appConfig) {
            saveConfigAsyncStorage(config);
        }
    }
    useEffect(() => {
        const getConfigFromStorage = async () => {
            const config = await getConfigAsyncStorage();
            console.log("setAppconfig");
            console.log(config);
            setAppConfig(config ?? AppConfigDefault);
            setLoading(false)
        }
        getConfigFromStorage();
    }, []);

    useEffect(() => {
        if (appConfig) {
            saveConfig(appConfig);
        }
    }, [appConfig]);


    let [page, setPage] = useState<Page>("home");

    let [topic, setTopic] = useState<Topic>();

    /**
     * used to dynamically load the cards from json file  
     * 
     */
    const loadCards = async (topic: Topic) => {
        console.log("load cardsss")
        /**
         * this would have been nice but its a metro feature to not be able to dynamically import anything but a string, not even const from this map  
         * might work with some babel presets  
         */
        /* const pathMap2: { [key in Topic]: `../data/${key}.json` } =
         {
             en_de: "../data/en_de.json",
             geography: "../data/geography.json",
             idktodo: "../data/idktodo.json"
         }
 */

        const importMap: { [key in Topic]: Promise<CardSrc[]> } = {
            german: import("../data/german.json").then(module => module.default),
            geography: import("../data/geography.json").then(module => module.default),
            italian: import("../data/italian.json").then(module => module.default),
            spanish: import("../data/spanish.json").then(module => module.default),
            french: import("../data/french.json").then(module => module.default),
            history: import("../data/history.json").then(module => module.default),
        };
        return importMap[topic]
    };

    const getMainContent = () => {
        if (!appConfig) throw new Error("app config is required for main content, its checked in render method, rn cant infer it");
        console.log("page")
        console.log(page)
        switch (page) {
            case "home":
                return <HomeView
                    setPage={(page, topic) => {
                        setTopic(topic)
                        setPage(page);
                    }}
                    username={appConfig.username}
                />
            case "settings":
                console.log("setttttings")
                return <SettingsView appConfig={appConfig} setAppConfig={setAppConfig} />
            case "learn":
                console.log("learn in getmaincontentr")
                if (!topic) throw new Error("topic has to be selected before going to learn page");

                let topicConfig = { ...TopicConfigDefault, ...appConfig.topics[topic] }
                console.log('tc')
                console.log(topicConfig)


                // if (!cards) return <Text>No cards available</Text>;
                const onCardRated = (c: Card & { index: number }) => {
                    setAppConfig(prev => {
                        if (!prev) throw new Error("appConfig has to be set by the time cards are rated.");

                        return {
                            ...prev,
                            topics: {
                                ...prev.topics,
                                [topic]: {
                                    ...prev.topics[topic],
                                    cardsLearning: prev.topics[topic]?.cardsLearning.map((item, i) =>
                                        i === c.index ? c : item
                                    ),
                                }
                            }
                        }
                    })
                }


                // add new cards if more than 24h since last added or none added yet
                let interval = topicConfig.interval
                let cardsLastAddedTime = topicConfig.cardsLastAdded

                let cardsLearning = topicConfig.cardsLearning

                // new cards should be added: 
                if (!cardsLastAddedTime || (new Date().getTime() - cardsLastAddedTime) > interval) {
                    console.log("add new cards")

                    loadCards(topic).then((cards: CardSrc[]) => {
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
                    });
                }


                return <>
                    {
                        cardsLearning ?
                            <LearnView
                                key="learnView"
                                onCardRated={onCardRated}
                                cardsLearning={appConfig.topics[topic]?.cardsLearning ?? []}
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
                if (!topic) throw new Error("topic has to be selected before going to statistics page");
                return <StatisticsView
                    mediums={appConfig.topics[topic]?.mediums || TopicConfigDefault.mediums}
                    cardsPerDay={appConfig.topics[topic]?.cardsPerDay ?? 0}
                    username={appConfig.username} />

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
                    {loading ?
                        <Text>loading config...</Text>
                        : getMainContent()
                    }
                </View>
            </SafeAreaView >
        </View>
    );
};