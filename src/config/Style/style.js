import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    homeScreen: {
        height: '100%',
        paddingLeft: 15,
        paddingRight: 15,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: '#1e3464'
    },

    homeHeader: {
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
        borderRadius: 10,
        color: "#FFF",
    },
    textFooter:{
        color: '#EEE',
        textAlign: 'center'
    },
    divider: {
        height: 10
    },
    divider20: {
        height: 20
    },
    divider50:{
        height: 50
    }
})

export default style