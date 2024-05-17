import { useState } from "react";
import { View, StyleSheet, SafeAreaView, Dimensions, Button, Text } from "react-native";
import { Header } from "./Header";
import { StatisticsView } from "./views/Statistics";
import { CardFront } from "./views/Learn";
import { SettingsView } from "./views/Settings";
import { HomeView } from "./views/Home";


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
        backgroundColor: "blue",
        flexDirection: "row",
    },
    mainSection: {
        flex: 10,
        backgroundColor: "green"
    }

})

export type Medium = "img" | "text" | "audio"
export interface SettingsParams {
    mediums: Medium[]
}

interface Card {
    q: string
    a: string
    img?: string
    sound?: string
}

export type Page = "home" | "learn" | "settings" | "statistics"
export const Layout = () => {

    let [page, setPage] = useState<Page>("home");


    /**
     * arr in the order the different mediums should be shown on the cards  
     * 
     * ask: 
     * could be done for front and back but idk if we rlly need that, also the order!?  
     * depends on how much work we want to put in the settings page  
     */
    let [mediumSettings, setMediumSettings] = useState<SettingsParams['mediums']>(["img", "text", "audio"]);


    const Separator = () => <View style={{
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth
    }} />;

    const getMainContent = () => {
        switch (page) {
            case "home":
                return <HomeView
                    page={page}
                    setPage={setPage}
                />
            case "settings":
                return <SettingsView />
            case "learn":
                return <CardFront
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
                    {
                        getMainContent()}

                </View>
            </SafeAreaView >
        </View>
    );
};