import { ImageBackground, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { NavigationProp } from '@react-navigation/native';
import { editSet } from '../functions/databaseQueries';
import UserContext from '../contexts/UserContext';
import { addXPForOneSet, removeXP } from '../functions/otherFunctions';
import { backgroundImage, globalStyles } from '../assets/styles';
import { SetChange } from '../types and interfaces/types';
import WeekContext from '../contexts/WeekContext';
import DateContext from '../contexts/DateContext';


interface RouterProps {
  route: any,
  navigation: NavigationProp<any, any>;
};

const EditSet = ({ route, navigation }: RouterProps) => {
    const userID = useContext(UserContext);
    const week = useContext(WeekContext);
    const { set, exerciseID, setID, isIsometric, date} = route?.params; 
    const [weight, setWeight] = useState<string>(set.weight.toString());
    const [time, setTime] = useState<string>(set.time.toString());
    const [reps, setReps] = isIsometric ? useState<string>("") : useState<string>(set.reps.toString());
    const [restTime, setRestTime] = useState<string>((set.restTime/60).toString());
    const [isEnabled, setIsEnabled] = set.side === "left" ? useState(false) : useState(true);
    const [side, setSide] = useState<string>(set.side);

    const changeNormal = {
        side: side,
        weight : parseFloat(weight) ,
        rep :  parseFloat(reps),
        time :  parseFloat(time) ,
        restTime : parseFloat(restTime)*60
    };
    const changeIsometric = {
        side: side,
        weight : parseFloat(weight) ,
        time :  parseFloat(time) ,
        restTime : parseFloat(restTime)*60
    };

    function toggleSwitch(): void {
        if (isEnabled)
            setSide('left');
        else
            setSide('right');
        setIsEnabled((previousState: boolean) => !previousState);
    }



    function handleModifyButton(isIsometric: boolean, changeIsometric: SetChange, changeNormal: SetChange, set: { exercise: string; time: number; weight: number; reps: number; }): void {
        if (isIsometric) {
            if (changeIsometric.times === 0 || Number.isNaN(changeIsometric.times)) 
                alert("Time field cannot be empty");
            else if (date !== null && week !== null){
                editSet(userID,set.exercise,exerciseID,setID,changeIsometric, (addXPForOneSet(isIsometric, changeIsometric)+removeXP(set.time, set.weight)), date, week)
                navigation.navigate("Log")
            }
        } else {
            if (changeNormal.reps === 0 || Number.isNaN(changeNormal.reps))
                alert("Reps field cannot be empty"); 
            else if(date !== null && week !== null){            
                console.log(changeNormal);
                   
                editSet(userID,set.exercise, exerciseID, setID,changeNormal, (addXPForOneSet(isIsometric, changeNormal)+removeXP(set.reps, set.weight)), date, week)
                navigation.navigate("Log")
            }
        }
    }

    return (
        <ImageBackground source={backgroundImage} style={globalStyles.image}>
        <View style={[globalStyles.container, {flex: 1}]}>
                <Text style={globalStyles.label}>Edit {set.exercise}</Text>
                { side !== "both"
                    ?<View style={styles.gridContainer}>
                        <Text style={[globalStyles.text, {textTransform: "uppercase", paddingVertical: 10, fontWeight: "800"}]}>{side} side</Text>
                        <Switch
                            trackColor={{ false: "#808080", true: "#fff" }}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>
                    :<></>
                }
                <Text style={[globalStyles.text, {textTransform: "uppercase", paddingVertical: 10, fontWeight: "800"}]}>weight (kg)</Text>
                <TextInput
                    keyboardType='numeric'
                    style={globalStyles.input}
                    value={weight}
                    placeholder="Weight"
                    autoCapitalize='none'
                    onChangeText={(text: string) => setWeight(text)}
                />
                {!isIsometric
                ? <>
                    <Text style={[globalStyles.text, {textTransform: "uppercase", paddingVertical: 10, fontWeight: "800"}]}>reps</Text>
                    <TextInput
                        keyboardType='numeric'
                        style={globalStyles.input}
                        value={reps}
                        placeholder="Reps"
                        autoCapitalize='none'
                        onChangeText={(text: string) => setReps(text)}
                    />
                </>
                :  <></>
                }
            
                <Text style={[globalStyles.text, {textTransform: "uppercase", paddingVertical: 10, fontWeight: "800"}]}>time (seconds)</Text>
                <TextInput
                    keyboardType='numeric'
                    style={globalStyles.input}
                    value={time}
                    placeholder="Time (in seconds)"
                    autoCapitalize='none'
                    onChangeText={(text: string) => setTime(text)}
                />
                <Text style={[globalStyles.text, {textTransform: "uppercase", paddingVertical: 10, fontWeight: "800"}]}>Rest time (seconds)</Text>
                <TextInput
                    keyboardType='numeric'
                    style={globalStyles.input}
                    value={restTime}
                    placeholder="Rest time (in minutes)"
                    autoCapitalize='none'
                    onChangeText={(text: string) => setRestTime(text)}
                />
                <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => handleModifyButton(isIsometric, changeIsometric, changeNormal, set)}>
                    <Text style={globalStyles.buttonText}>Modify</Text>
                </Pressable>
            </View>
        </ImageBackground>
    )
}

export default EditSet

const styles = StyleSheet.create({
    text:{
        alignSelf: 'center',
        fontSize: 18,
        color: "#fff",
        textTransform: 'uppercase',
        fontWeight: "600",
        paddingVertical: 10,
    },
    gridContainer:{
        flexDirection: 'row',
        marginHorizontal: 10,
        justifyContent: 'center'
    },
    label: {
        fontSize: 20,
        fontWeight: "800",
        color: "#fff",
        textTransform: 'uppercase',
        textAlign: 'center',
        marginVertical: 50
    },
  });