import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions, Button, Pressable } from "react-native";
import { AppConfig, Card, Medium, TopicConfig } from "../Layout";
import { useEffect, useState } from "react";
import { sm2 } from "../../sm2/sm2";
import { textToSpeech } from "../textToSpeech";
import { getImg } from "../img";
import React from "react";
import Icon from "react-native-vector-icons/AntDesign";
import styleCommon from "../style";


const styleText = StyleSheet.create({
    mid: {
        fontSize: 40
    }
})
const style = StyleSheet.create({
    container: {
        width: "100%",
        minHeight: 56,
    },
    img: {
        width: "100%",
        minHeight: 56,
    },
    text: {
        margin: 4,
        flex: 0.7,
        width: "100%",
        minHeight: 56,
    },
    audio: {
        margin: 5,
        flex: 3,
        minHeight: 56,
    },
    rating: {
        flex: 1,
        minHeight: 56,
    },
    ratingContainer: {
        flex: 1,
        flexDirection: "row",
        minHeight: 56,
        margin: 10
    },
    againBtn: {
        flex: 1,
        minHeight: 56,

    },
    ratingBtn: {
        flex: 1,
        minHeight: 56,
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
    // let text = front ? card.question : card.answer

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

    const Separator = () => <View style={{
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth
    }} />;

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

            <Text style={styleText.mid}>{front ? cards[cardIdx].question : cards[cardIdx].answer}</Text>
        </View>
    )

    const CardAudio = () => (
        <TouchableOpacity
            style={style.audio}
            onPress={() => textToSpeech(front ? cards[cardIdx].question : cards[cardIdx].answer)}>
            <View
                id="audio"
                style={style.audio}>

                {/* <Text>Play</Text> */}
                <Icon name="sound" size={30}></Icon>
            </View>
        </TouchableOpacity>
    )

    const mediumMap: { [key in Medium]: React.JSX.Element } = {
        img: <CardImg key="img" />,
        audio: <CardAudio key="audio" />,
        text: <CardText key="text" />
    }

    const CardRating = (
        <View key="cardRating"
            id="cardRating"
            style={style.rating}>
            <Separator />
            <Text key="ratingDesc"> Rate Difficulty</Text>
            <View style={style.ratingContainer}>
                <Pressable key="againBtn" style={{ ...styleCommon.topicContainer, ...style.againBtn }} onPress={() => rateCard(0)}><Text>Again</Text></Pressable>
            </View>
            <View style={style.ratingContainer}>
                <Pressable key="hardBtn" style={{ ...styleCommon.topicContainer, ...style.ratingBtn }} onPress={() => rateCard(2)}><Text>Hard</Text></Pressable>
                <Pressable key="goodBtn" style={{ ...styleCommon.topicContainer, ...style.ratingBtn }} onPress={() => rateCard(3)}><Text>Good</Text></Pressable>
                <Pressable key="easyBtn" style={{ ...styleCommon.topicContainer, ...style.ratingBtn }} onPress={() => rateCard(5)}><Text>Easy</Text></Pressable>
            </View>
        </View>

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
                style={style.container}
                onPress={() => { setFront(!front); console.log(cardIdx) }}>
                {getContent(cardIdx)}
            </TouchableOpacity>
        </>
    );
};
