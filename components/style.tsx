import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center",
    },
    headerSection: {
        width: "100%",
        alignItems: "center",
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 33,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    instructionText: {
        fontSize: 22,
        marginBottom: 10,
        textAlign: "center",
    },
    separator: {
        width: '80%',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        marginBottom: 20,
    },
    sectionContainer: {
        width: "100%",
        marginBottom: 20,
        alignItems: "center",
    },
    sectionHeader: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
    },
    sectionDescription: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: "center",
    },
    topicBox: {
        width: "90%",
        marginVertical: 10,
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#B8FBFC",
        alignItems: "center",
    },
    topicContainer: {
        width: "100%",
        // flex: 1,
        margin: 10,
        alignItems: "center",
        justifyContent: "center",
        // position: "relative",
        borderRadius: 5,
        backgroundColor: "#58B9FA",
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
    },
    topic: {
        alignItems: "center",
        justifyContent: "center",
    },
    topicText: {
        color: "black",
        fontSize: 22,
        textTransform: "uppercase",
    },
    settingsButton: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 5,
        backgroundColor: "transparent",
        borderRadius: 5,
    },
});

export default styles
