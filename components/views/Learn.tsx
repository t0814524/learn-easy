import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions, Button } from "react-native";
import { Card, Medium, SettingsParams, TopicConfig } from "../Layout";
import { createEmptyCard, formatDate, fsrs, generatorParameters, Rating, Grades } from 'ts-fsrs';
import { useState } from "react";
import { sm2 } from "../../sm2/sm2";

const style = StyleSheet.create({
    img: {
        // flex: 0.7,
        width: "100%",
        minHeight: 56, //  https://m3.material.io/components/search/specs
        backgroundColor: "blue",
        // flexDirection: "row",
    },
    text: {
        flex: 0.7,
        width: "100%",
        minHeight: 56, //  https://m3.material.io/components/search/specs
        backgroundColor: "blue",
        // flexDirection: "row",
    },
    audio: {
        flex: 1,
        minHeight: 56,
        // minHeight: "100%",
        backgroundColor: 'yellow',

    },
    rating: {
        flex: 1,
        minHeight: 56,
        backgroundColor: 'green',

    }
})


interface LearnViewProps {
    /**
     * cards scheduled for review  
     */
    cards: Card[],
    mediumSettings: SettingsParams['mediums']
    topicConfig?: TopicConfig
}

/**
 * Learn View  
 */
export const LearnView: React.FC<LearnViewProps> = ({ cards, mediumSettings, topicConfig }) => {

    console.log("cards")
    console.log(cards)



    let [cardIdx, setCardIdx] = useState(0);
    let [front, setFront] = useState(true);


    let card = cards[cardIdx]

    const rateCard = (rating: number) => {
        console.log("rate card..")
        console.log(cardIdx)
        let card = cards[cardIdx]
        console.log("card before rating")
        console.log(card)
        console.log("card after rating")
        let cardRated = sm2(card, rating)

        //ask again if < 4 according to sm2 spec
        if (rating > 4) {
            // cards.p
        }

        console.log(cardRated)
        setCardIdx(prev => cardIdx < cards.length - 1 ? prev + 1 : 0);
        // setCardIdx(prev => prev + 1);
        setFront(true)
    }


    const renderImg = () => {

        if (!card.img) return
        // throw new Error("no img url");

        let [imgHeight, setimgHeight] = useState<number>(100);

        const screenWidth = Dimensions.get("window").width || 360 //get screen width or use 360 = avg screen width

        Image.getSize(card.img, (width, height) => {
            setimgHeight(height * ((screenWidth) / width))
        })

        return <Image
            style={{ width: screenWidth, height: imgHeight, resizeMode: "stretch" }}
            source={{ uri: card.img }}
        />

    }


    const CardImg = () => (
        <View
            id="img"
            style={style.img}>

            {
                renderImg()
            }
        </View>
    )

    const CardText = () => (
        <View
            id="text"
            style={style.text}>

            <Text>idx:  {cardIdx}</Text>
            <Text>text {front ? cards[cardIdx].question : cards[cardIdx].answer}</Text>
        </View>
    )

    const CardAudio = () => (
        <View
            id="audio"
            style={style.audio}>

            <Text>Play</Text>
        </View>
    )

    const mediumMap: { [key in Medium]: React.JSX.Element } = {
        img: <CardImg key="img" />,
        audio: <CardAudio key="audio" />,
        text: <CardText key="text" />
    }

    const CardRating = (
        // <TouchableOpacity
        //     key="cardRating"
        //     onPress={rateCard}>

        <View
            id="cardRating"
            style={style.rating}>

            <Text>Rate Difficulty</Text>
            <Button onPress={() => rateCard(0)} title="Again" />
            <Button onPress={() => rateCard(2)} title="Hard" />
            <Button onPress={() => rateCard(3)} title="Good" />
            <Button onPress={() => rateCard(5)} title="Easy" />
        </View>
        // </TouchableOpacity>
    )

    const getContent = (cardIdx: number) => {
        console.log("getContent")
        let jsx = []

        for (let m of mediumSettings) {
            jsx.push(mediumMap[m])
        }

        // add rating box if not front
        if (!front) {
            jsx.push(CardRating)
        }
        return jsx
    }

    return (
        <>
            <TouchableOpacity
                onPress={() => { setFront(!front); console.log(cardIdx) }}>
                <Text>todo: learn stuff </Text>
                {getContent(cardIdx)}
            </TouchableOpacity>
        </>
    );
};
