import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { Card, Medium, SettingsParams, TopicConfig } from "../Layout";
import { createEmptyCard, formatDate, fsrs, generatorParameters, Rating, Grades } from 'ts-fsrs';
import { useState } from "react";

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

/**
 * todo: probably sm2 is the best we can 2  
 */
function testFsrs() {
    const params = generatorParameters({ enable_fuzz: true });
    const f = fsrs(params);
    const card = createEmptyCard(new Date('2022-2-1 10:00:00'));// createEmptyCard();
    const now = new Date('2022-2-2 10:00:00');// new Date();
    const scheduling_cards = f.repeat(card, now);

    // console.log(scheduling_cards);
    Grades.forEach(grade => { // [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy]
        const { log, card } = scheduling_cards[grade];
        console.group(`${Rating[grade]}`);
        console.table({
            [`card_${Rating[grade]}`]: {
                ...card,
                due: formatDate(card.due),
                last_review: formatDate(card.last_review as Date),
            },
        });
        console.table({
            [`log_${Rating[grade]}`]: {
                ...log,
                review: formatDate(log.review),
            },
        });
        console.groupEnd();
        console.log('----------------------------------------------------------------');
    });
}

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
    // export const CardView: React.FC<{ card: Card, mediumSettings: SettingsParams['mediums'] }> = ({ card, mediumSettings }) => {

    // testFsrs()
    console.log("cards")
    console.log(cards)
    console.log(new Date)



    let [cardIdx, setCardIdx] = useState(0);
    let [front, setFront] = useState(true);


    let card = cards[cardIdx]


    let renderImg = () => {
        console.log("card.img")
        console.log(card)
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

            <Text>text {front ? card.question : card.answer}</Text>
        </View>
    )

    const CardAudio = () => (
        <View
            id="audio"
            style={style.audio}>

            <Text>Play</Text>
        </View>
    )

    let mediumMap: { [key in Medium]: React.JSX.Element } = {
        img: <CardImg key="img" />,
        audio: <CardAudio key="audio" />,
        text: <CardText key="text" />
    }

    const CardRating = (
        <TouchableOpacity
            key="cardRating"
            onPress={() => { setCardIdx(cardIdx++); }}>

            <View
                id="cardRating"
                style={style.rating}>

                <Text>Rate Difficulty</Text>
            </View>
        </TouchableOpacity>
    )

    let getContent = (cardIdx: number) => {
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
