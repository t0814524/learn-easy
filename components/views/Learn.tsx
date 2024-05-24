import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions, Button } from "react-native";
import { AppConfig, Card, Medium, TopicConfig } from "../Layout";
import { useEffect, useState } from "react";
import { sm2 } from "../../sm2/sm2";
import { textToSpeech } from "../textToSpeech";
import { getImg } from "../img";
import React from "react";

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
        flex: 3,
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
    // cardsScheduled: Card[],
    // appConfig: AppConfig
    // setCardsScheduled: React.Dispatch<React.SetStateAction<Card[] | undefined>>
    cardsLearning: Card[],
    // setCardsLearning: Card[],
    mediumSettings: TopicConfig['mediums']
    // topicConfig?: TopicConfig
    onCardRated: (c: Card & { index: number }) => void
}

/**
 * Learn View  
 */
export const LearnView: React.FC<LearnViewProps> = ({ cardsLearning, onCardRated, mediumSettings }) => {
    console.log("cards in LearnView")

    console.log("cardsLearning")
    console.log(cardsLearning)
    // console.log('mediumSettings')
    // console.log(mediumSettings)

    /**
     * refers to cards scheduled for review  
     * i put that in here because of state sync issues but i can move it up now probably if required for statistics / progress  
     */
    let cards = cardsLearning.filter(c => c.due < new Date().getTime()).sort((a: Card, b: Card) => b.due - a.due) // sort by due date

    // console.log(new Date().getTime())
    // console.log("cards scheduled")
    // console.log(cards)
    // console.log(new Date().getTime())


    let [cardIdx, setCardIdx] = useState(0);
    let [front, setFront] = useState(true);


    let card = cards[cardIdx]
    let text = front ? card.question : card.answer

    const rateCard = (rating: number) => {
        console.log("rate card..")

        //deep clone rn to check state bs
        let cardRated = sm2(JSON.parse(JSON.stringify(card)), rating) as Card & { index: number }

        //ask again if < 4 according to sm2 spec
        if (rating >= 4) {
            // cards.pop()
            console.log("call onCardRated")
            // setCardIdx(prev => prev == 0 ? cards.length - 1 : prev - 1)
            if (cardIdx == cards.length - 1) setCardIdx(0) // idk about these conditions, might be easier to use a stack and unshift 
        } else {
            // only increment index if no card was removed
            setCardIdx(prev => cardIdx < cards.length - 1 ? prev + 1 : 0);
        }
        onCardRated(cardRated)
        setFront(true)
    }


    const renderImg = () => {
        const origin: "local" | "remote" = "remote"
        const screenWidth = Dimensions.get("window").width || 360 //get screen width or use 360 = avg screen width

        let [imgUrl, setImgUrl] = useState<string>();
        let [imgHeight, setimgHeight] = useState<number>(100);

        useEffect(() => {
            if (origin == "remote")
                getImg(card.question).then(url => { // card question works nice for en_de (english query results), also front and back should have the same img
                    setImgUrl(url)

                    Image.getSize(url, (width, height) => {
                        setimgHeight(height * ((screenWidth) / width))
                    })
                })
            else {
                if (!card.img) throw new Error("Cant use offline img, no imgUrl found");
                setImgUrl(card.img)
            }
        }, [])



        return imgUrl ? <Image
            style={{ width: screenWidth, height: imgHeight, resizeMode: "stretch" }}
            source={{ uri: imgUrl }}
        />
            : <></>

    }


    const CardImg = React.memo(() => { // todo: prevent rerender here 
        return <View
            id="img"
            style={style.img}>

            {
                renderImg()
            }
        </View>
    });
    // const CardImg = () => (
    //     <View
    //         id="img"
    //         style={style.img}>

    //         {
    //             renderImg()
    //         }
    //     </View>
    // )


    const CardText = () => (
        <View
            id="text"
            style={style.text}>

            <Text>idx:  {cardIdx}</Text>
            <Text>text {front ? cards[cardIdx].question : cards[cardIdx].answer}</Text>
        </View>
    )

    const CardAudio = () => (
        <TouchableOpacity
            style={style.audio}
            onPress={() => textToSpeech(front ? cards[cardIdx].question : cards[cardIdx].answer)}>
            <View
                id="audio"
                style={style.audio}>

                <Text>Play</Text>
            </View>
        </TouchableOpacity>
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
            key="cardRating"
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
        if (cards.length < 1) return <Text>nth to learn</Text>
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
                <Text>todo: learn stuff {cardIdx}</Text>
                {getContent(cardIdx)}
            </TouchableOpacity>
        </>
    );
};
