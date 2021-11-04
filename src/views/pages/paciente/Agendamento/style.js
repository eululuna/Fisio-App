import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        padding: 15,
        borderWidth: 0.5,
        borderRadius: 8,
        borderColor: "#1e3464",
        marginBottom: 15
    },
    btnAction: {
        padding: 20,
        borderRadius: 5,
        backgroundColor: "#1e3464",
        color: "#FFF",
    },
    divider: {
        height: 10
    }

})

export default style