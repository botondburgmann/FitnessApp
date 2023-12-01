import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Exercise } from '../../../types and interfaces/types';
import { globalStyles } from '../../../assets/styles';
import { ExerciseLog } from '../types';

const Set = (props: { exercise: Exercise; focus: string; setGoToNextPage: Function; currentExercise: ExerciseLog; }) => {
    const exercise = props.exercise;
    const focus = props.focus;
    const setGoToNextPage = props.setGoToNextPage
    const currentExercise = props.currentExercise
    const [weight, setWeight] = useState("");
    const [time, setTime] = useState("");
    const [reps, setReps] = useState("");

    function completeSet (exercise:ExerciseLog, weight: number, time: number, reps: number): void {
        try {
            if (exercise.isometric && (time === 0 || Number.isNaN(time)))
              alert("Error: Time field cannot be empty for isometric exercises");
            else if (!exercise.isometric && (reps === 0 || Number.isNaN(reps))) 
              alert("Error: Reps field cannot be empty for non-isometric exercises");
            else if (time < 0) 
                alert("Error: Time must be a positive number");
            else if (reps < 0) 
                alert("Error: Rep number must be a positive number");
            else {
                if (Number.isNaN(weight))
                    weight = 0;
                if (Number.isNaN(time))
                    time = 0;            
                if (Number.isNaN(reps))
                    reps = 0;         
                if (exercise.unilateral) {
                    currentExercise.exercise.push(...[exercise.name, exercise.name])
                    currentExercise.reps.push(...[reps, reps])
                    currentExercise.sides.push(...["left", "right"]);
                    currentExercise.times.push(...[time, time]);
                    currentExercise.weights.push(...[weight, weight]);
                }
                else {
                    currentExercise.exercise.push(exercise.name)
                    currentExercise.reps.push(reps)
                    currentExercise.sides.push("both");
                    currentExercise.times.push(time);
                    currentExercise.weights.push(weight);                
                }
                setGoToNextPage(true)
            }
        } catch (error: any) {
            alert(`Error: Couldn't complete set: ${error}`)
        }
    }
  return (
    <View>
        <Text style={[globalStyles.label, {marginVertical: 50}]}>{exercise.name}</Text>
        {exercise.isometric
            ? exercise.musclesWorked.length === 1 && focus === "strength"
                ? exercise.unilateral 
                    ? <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>Do 20-30 seconds each side</Text>
                    :  <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>Do 20-30 seconds</Text>
                : exercise.unilateral 
                    ? <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>Do 30-60 seconds each side</Text>
                    :  <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>Do 30-60 seconds</Text>
            :
            exercise.musclesWorked.length === 1 && focus === "strength" 
                ? exercise.unilateral 
                    ? <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>Do 2-3 repetitons each side</Text>
                    :  <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>Do 2-3 repetitons</Text>
                : exercise.unilateral 
                    ? <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>Do 6-8 repetitons each side</Text>
                    :  <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>Do 6-8 repetitons</Text>

        }
        
        <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>weight (kg)</Text>
        <TextInput
            keyboardType='numeric'
            style={styles.input}
            value={weight}
            placeholder="optional"
            autoCapitalize='none'
            onChangeText={(text) => setWeight(text)}
        />
        {
        exercise.isometric
        ? <>
            <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>time (seconds)</Text>
            <TextInput
                keyboardType='numeric'
                style={styles.input}
                value={time}
                placeholder="required"
                autoCapitalize='none'
                onChangeText={(text) => setTime(text)}
            />
        </>
        : <>
            <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>repetitons</Text>
            <TextInput
                keyboardType='numeric'
                style={styles.input}
                value={reps}
                placeholder="required"
                autoCapitalize='none'
                onChangeText={(text) => setReps(text)}
            />
        </>
        }
        <Text style={[globalStyles.text, { fontWeight: "600", marginHorizontal: 10}]}>For maximum efficency choose a weight that makes you fail in these repetiton ranges</Text>
        <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => completeSet(currentExercise, parseFloat(weight), 
                                                                                parseFloat(time),
                                                                                parseFloat(reps))}>
            <Text style={globalStyles.buttonText}>Next</Text>                   
        </Pressable>
  </View>
  )
}

export default Set

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ff0000'
    },
    input: {
        marginHorizontal: 10,
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    },
    gridContainer:{
        flexDirection: 'row',
        marginHorizontal: 10,
        justifyContent: 'center'
    }
  });