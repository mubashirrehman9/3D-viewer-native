import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

// @ts-ignore
const Home = ({ navigation }) => {
    return (
        <View >
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Profile")}>
                <Image style={styles.imageUp} source={require('../assets/textures/arrow_up_icon.png')} />
            </TouchableOpacity>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#ddd",
        padding: 10,
        borderRadius: 5,
        width: 100,
        // alignSelf: "center",
        alignContent: "center",
        margin: 10,
    },
    imageUp: {
        padding: 10,
        width: 20,
        height: 20,
        alignSelf: "center",
        alignContent: "center",
    },
})