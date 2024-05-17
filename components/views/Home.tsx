import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Page } from "../Layout";


const style = StyleSheet.create({
    topic: {
        // width: "100%",
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})

/**
 * Main Menue / Home view  
 */
export const HomeView: React.FC<{
    page: Page,
    setPage: React.Dispatch<React.SetStateAction<Page>>
}> = ({ page, setPage }) => {


    return (
        <>
            <Text>todo: main menue </Text>
            <TouchableOpacity onPress={() => { setPage("learn") }} style={style.topic}>
                <Text>learn sth</Text>
            </TouchableOpacity >
        </>
    );
};