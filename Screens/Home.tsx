import { Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

// @ts-ignore
const Home = ({ navigation }) => {
    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>

            <ScrollView style={{ flex: 1 }}>
                <View style={styles.startBtn}>
                    {Array.from({
                        length: 5
                    }, (item, index) => {
                        return (<TouchableOpacity style={styles.ImageBtn} onPress={() => navigation.navigate("AntlerSelect",{antlerPath:(index+1)})}>
                            <Image style={styles.btnImage} source={require('../assets/textures/deerhorn.png')} />
                            <Text style={styles.buttonText}>{"Antler" +(index+1)}</Text>
                        </TouchableOpacity>)
                    })}
                </View>
            </ScrollView>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    startBtn: {
        padding: 10,
        // flexDirection: "row",
        // alignSelf: "center",

    },
    ImageBtn: {
        marginLeft: 5,
        borderRadius: 5,
        backgroundColor: "grey",
        width: 100,
        height: 90,
        marginBottom: 10
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