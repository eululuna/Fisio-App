import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    screen: {
        padding: 50,
        paddingLeft: 30,
        paddingRight: 30,
        display: "flex",
        flexDirection: "column",

    },
    loginHeader: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    title: {
        textAlign: "center",
        marginBottom: 20
    },
    logo: {
        width: 260,
        height: 90,
        resizeMode: "stretch",
        marginBottom: 20
    },
    input: {
        padding: 15,
        borderWidth: 0.5,
        borderRadius: 8,
        borderColor: "#1e3464",
        marginBottom: 15
    },
    btnAction: {
        padding: 15
    }
})

export default style