import * as Speech from 'expo-speech';

export function textToSpeech(text: string) {
    console.log("should say sth")
    Speech.speak(text, { language: "en" });

}

