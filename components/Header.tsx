import { useState } from "react";
import { TouchableOpacity, StyleSheet, View, TextInput } from "react-native";
import { Page } from "./Layout";
import Icon from 'react-native-vector-icons/Ionicons';


const style = StyleSheet.create({
    homeBtnContainer: {
        // width: "100%",
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    settingsBtnContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    pageInfoContainer: {
        flex: 4,
        backgroundColor: "#d9a9ff",
        alignItems: "center",
        justifyContent: "center",
    }
})


/**
 * Header component  
 * used for navigation and displaying page related info  
 * 
 * Icon explorer: {@link https://oblador.github.io/react-native-vector-icons/}
 */
export const Header: React.FC<{
    page: Page,
    setPage: React.Dispatch<React.SetStateAction<Page>>
}> = ({ page, setPage }) => {


    return (
        <>
            { /* home btn */
                page != "home" ?
                    <TouchableOpacity onPress={() => { setPage("home") }} style={style.homeBtnContainer}>
                        <Icon name='home' size={40}></Icon>
                    </TouchableOpacity >
                    : <></>
            }
            <View
                style={style.pageInfoContainer}
            >

            </View>

            { /* settings btn */
                page != "settings" ?
                    <TouchableOpacity onPress={() => { setPage("settings") }} style={style.settingsBtnContainer}>
                        <Icon name='settings' size={40}></Icon>
                    </TouchableOpacity >
                    : <></>
            }
        </>
    );
};