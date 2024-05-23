import * as Speech from 'expo-speech';

//browser feature not supported i think
export function textToSpeech(text: string) {
    console.log("should say sth")
    Speech.speak(text, { language: "de" });

}
export function textToSpeech2(text) {
    // Check if the browser supports speech synthesis
    if ('speechSynthesis' in window) {
        // Create a new SpeechSynthesisUtterance instance
        const utterance = new SpeechSynthesisUtterance(text);

        // Set the voice, language, pitch, and rate if desired
        // You can customize these settings based on your preferences
        utterance.lang = 'de'; // Set the language
        // utterance.lang = 'en-US'; // Set the language
        utterance.pitch = 10; // Set the pitch
        utterance.rate = 1; // Set the rate of speech

        // Speak the text
        window.speechSynthesis.speak(utterance);
    } else {
        // If the browser does not support speech synthesis
        alert('Sorry, your browser does not support speech synthesis.');
    }
}

