import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

// @ts-ignore
const AntlerSelect = ({route, navigation }) => {
    
    return (
        <View>

        <View style={styles.startBtn}>
            <TouchableOpacity style={styles.ImageBtn} onPress={() => navigation.navigate("Profile",{antlerPath:route.params.antlerPath})}>
                <Image style={styles.btnImage} source={require('../assets/textures/deerhorn.png')} />
                <Text style={styles.buttonText}>Antler Orignal</Text>
            </TouchableOpacity>
        </View>
        </View>
    )
}

export default AntlerSelect

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
    },
    buttonText: {
        fontWeight: 'bold',
        alignSelf: "center",
    },
})