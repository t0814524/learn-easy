import { Text, View, StyleSheet } from "react-native";
import { Medium, SettingsParams } from "../Layout";

const style = StyleSheet.create({
    img: {
        flex: 0.7,
        width: "100%",
        minHeight: 56, //  https://m3.material.io/components/search/specs
        backgroundColor: "blue",
        flexDirection: "row",
    },
    text: {
        flex: 0.7,
        width: "100%",
        minHeight: 56, //  https://m3.material.io/components/search/specs
        backgroundColor: "blue",
        flexDirection: "row",
    },
    audio: {
        flex: 1,
        minHeight: "100%",
        backgroundColor: 'yellow',

    }
})

/**
 * Learn View  
 */
export const CardFront: React.FC<{ mediumSettings: SettingsParams['mediums'] }> = ({ mediumSettings }) => {

    const img = (
        <View
            id="img"
            style={style.img}>

            <Text>Imaggge</Text>
        </View>
    )

    const text = (
        <View
            id="img"
            style={style.text}>

            <Text>text</Text>
        </View>
    )

    const audio = (
        <View
            id="audio"
            style={style.audio}>

            <Text>Play</Text>
        </View>
    )

    let mediumMap: { [key in Medium]: React.JSX.Element } = {
        img: img,
        audio: audio,
        text: text
    }

    let getContent = () => {
        let jsx = []

        for (let m of mediumSettings) {
            jsx.push(mediumMap[m])
        }
        return jsx
    }

    return (
        <>
            <Text>todo: learn stuff </Text>
            {getContent()}
        </>
    );
};