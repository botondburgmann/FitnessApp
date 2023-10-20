import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DisplaySuperBiSet = (props) => {
    const exercises = props.exercises;
    const sets = props.sets;

    const exerciseNumber = new Set(exercises).size;
    
    return (
        <View style={styles.container}>
            <Text style={[styles.exercise, {marginTop:20}]}>{exercises.length/exerciseNumber} supersets of</Text>
            <Text style={[styles.exercise, {marginBottom:20}]}>{exercises[0]} and {exercises[1]}</Text>
            <View style={styles.gridContainer}>
            {sets.map((item, index) => (
                <View key={index} style={styles.gridItem}>
                    <Text style={styles.text}>{item.reps} repetitions with {item.weight} kg</Text>
                </View>))}
            </View>
        </View>
    )
}

export default DisplaySuperBiSet

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: 70,
      },
    gridItem: {
        width: '50%', // Make each item take up 50% of the container's width for a 2x2 grid
        marginVertical: 10
    },
    container: {
        alignItems: 'center',
        marginHorizontal: 0
      },
    text: {
        fontSize: 16,
        lineHeight: 25,
        letterSpacing: 0.25,
        color: 'white',
    },
    exercise: {
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 0.25,

        color: 'white',
    }
})