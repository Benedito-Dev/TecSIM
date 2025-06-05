import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#fff',
    },
    loading: {
        marginVertical: 20,
    },
    containerUser: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        width: "20%",
        height: "50%",
        backgroundColor: "#ececec",
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 25
    },
    title: {
        fontWeight: "bold",
        fontSize: 20
    },
    circle: {
        width: 180,
        height: 180,
        borderRadius: 90, // metade da largura e altura
        backgroundColor: 'gray', // verde claro como destaque
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutButton: {
        backgroundColor: "red",
        paddingHorizontal: 60,
        paddingVertical: 10,
        borderRadius: 20,
        color: "white"
    },
    textButton: {
        fontWeight: "bold",
        color: "#fff"
    },
})