import * as Speech from 'expo-speech';

export function textToSpeech(text: string) {
    Speech.speak(text, { language: "en" });
}

