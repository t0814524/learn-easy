import { useState } from "react";
import { View, StyleSheet, SafeAreaView, Dimensions, Button, Text } from "react-native";
import { Header } from "./Header";
import { StatisticsView } from "./views/Statistics";
import { LearnView } from "./views/Learn";
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

export type Page = "home" | "learn" | "settings" | "statistics"
export const Layout = () => {

    let [page, setPage] = useState<Page>("home");

    const Separator = () => <View style={{
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth
    }} />;

    const getMainContent = () => {
        switch (page) {
            case "home":
                return <HomeView />
            case "settings":
                return <SettingsView />
            case "learn":
                return <LearnView />
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
                    {getMainContent()}
                </View>
            </SafeAreaView >
        </View>
    );
};