import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

// @ts-ignore
const Home = ({ navigation }) => {
    return (
        <View>

        <View style={styles.startBtn}>
            <TouchableOpacity style={styles.ImageBtn} onPress={() => navigation.navigate("Profile")}>
                <Image style={styles.btnImage} source={require('../assets/textures/deerhorn.png')} />
                <Text style={styles.buttonText}>Antler 1</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ImageBtn} onPress={() => navigation.navigate("Profile")}>
                <Image style={styles.btnImage} source={require('../assets/textures/deerhorn.png')} />
                <Text style={styles.buttonText}>Antler 2</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.startBtn}>

        <TouchableOpacity style={styles.ImageBtn} onPress={() => navigation.navigate("Profile")}>
                <Image style={styles.btnImage} source={require('../assets/textures/deerhorn.png')} />
                <Text style={styles.buttonText}>Antler 3</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ImageBtn} onPress={() => navigation.navigate("Profile")}>
                <Image style={styles.btnImage} source={require('../assets/textures/deerhorn.png')} />
                <Text style={styles.buttonText}>Antler 4</Text>
            </TouchableOpacity>
        </View>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    startBtn:{
        padding:10,
        flexDirection:"row",
        alignSelf:"center",
    },
    ImageBtn: {
        marginLeft: 5,
        borderRadius: 5,
        backgroundColor: "grey",
        width: 100,
        height: 90,
    },
    btnImage: {
        width: "80%",
        height: "20%",
        marginTop: 10,
        paddingTop: 55,
        alignSelf: "center",
        // padding: 10,
    },
    buttonText: {
        fontWeight: 'bold',
        alignSelf: "center",
    },
})