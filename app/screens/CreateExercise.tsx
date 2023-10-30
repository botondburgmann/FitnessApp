import { StyleSheet, Text, TextInput, View, Switch, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import UserContext from '../contexts/UserContext';
import { NavigationProp } from '@react-navigation/native';
import Info from '../components/Info';
import { createNewExercise } from '../functions/databaseQueries';

interface RouterProps {
    navigation: NavigationProp<any, any>;
  }

const CreateExercise = ({navigation}: RouterProps) => {
    const userID = useContext(UserContext);
    const [name, setName] = useState<string>()
    const [isUnilateral, setIsUnilateral] = useState(false)
    const [isIsometric, setIsIsometric] = useState(false)
    const [unilaterality, setUnilaterality] = useState("bilateral")
    const [isometricity, setIsometricity] = useState("not isometric")
    const [isCustomAlertVisible, setCustomAlertVisible] = useState(false);
    const [title, setTitle] = useState<string>();
    const [information, setInformation] = useState<string>();

    const showCustomAlert = (title, information) => {
        setCustomAlertVisible(true);
        setTitle(title);
        setInformation(information);
    };
    
    const hideCustomAlert = () => {
        setCustomAlertVisible(false);
    };

    function toggleUnilateralitySwitch() {
        if (isUnilateral) {
            setUnilaterality('bilateral');
        }
        else {
            setUnilaterality('unilateral')
        }
        setIsUnilateral(previousState => !previousState);
    }

    function toggleIsometricitySwitch() {
        if (isIsometric) {
            setIsometricity('not isometric');
        }
        else {
            setIsometricity('isometric')
        }
        setIsIsometric(previousState => !previousState);
    }

    function handleButtonClick() {
        createNewExercise(userID, name, isUnilateral, isIsometric)
        setName("");
        setIsIsometric(false);
        setIsUnilateral(false);
        setUnilaterality("");
        setIsometricity("");
    }

  return (
    <View style={styles.container}>
        <TextInput 
            value={name}
            style={styles.input} 
            placeholder='Exercise name' 
            autoCapitalize='none' 
            onChangeText={(text) => setName(text)}
        />

        <View style={styles.gridContainer}>
            <Text style={[styles.text,styles.gridItem]}>This exercise is {unilaterality}</Text>
            <Pressable style={styles.createExerciseButton} onPress={() => showCustomAlert("What is unilaterality?","A unilateral exercise is a weight bearing movement mainly or completely involving one limb (e.g. single leg squat, Bulgarian split squat and single leg jump), whereas, a bilateral exercise is a weight bearing movement executed evenly and simultaneously by both limbs (e.g. back squat, deadlift and countermovement jump)." )}>
                <Text style={styles.createExerciseButtonText}>i</Text>
            </Pressable>
            <Info
                isVisible={isCustomAlertVisible}
                onClose={hideCustomAlert}
                title={title}
                information={information}
            />
        </View>
            <View style={styles.switch}>
                <Switch
                    trackColor={{ false: "#808080", true: "#fff" }}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleUnilateralitySwitch}
                    value={isUnilateral}
                />
            </View>
            
        <View style={styles.gridContainer}>
            <Text style={styles.text}>This exercise is {isometricity}</Text>
            <Pressable style={styles.createExerciseButton} onPress={() => showCustomAlert("What is isometricity?","Isometric exercises are tightening (contractions) of a specific muscle or group of muscles. During isometric exercises, the muscle doesn't noticeably change length. The affected joint also doesn't move. Isometric exercises help maintain strength. They can also build strength, but not effectively. And they can be performed anywhere. Examples include wall sit or plank." )} >
                <Text style={styles.createExerciseButtonText}>i</Text>
            </Pressable>
            <Info
                isVisible={isCustomAlertVisible}
                onClose={hideCustomAlert}
                title={title}
                information={information}
            />
        </View>
            <View style={styles.switch}>
                <Switch
                    trackColor={{ false: "#808080", true: "#fff" }}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleIsometricitySwitch}
                    value={isIsometric}
                />
            </View>
        
        <Pressable style={styles.button} onPress={handleButtonClick} >
            <Text style={styles.text}>Create new exercise</Text>
        </Pressable>
    </View>
  )
}

export default CreateExercise

const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#ff0000'
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    marginLeft: 10,
    marginRight: 50

  },
gridItem: {
    marginVertical: 10
},
switch:{
    marginRight: 150 
},
  text:{
    textAlign: 'left',
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    paddingVertical: 10,
  },
  input: {
    marginHorizontal: 10,
    marginTop: 100,
    marginBottom: 30,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff'
},
  
  button:{
    
    marginTop: 125,
    paddingHorizontal: 5,
    alignSelf: "center",
    backgroundColor: "#000",
},
  label: {
      alignSelf: 'center',
      fontSize: 20,
      fontWeight: "800",
      color: "#fff",
      textTransform: 'uppercase',
      marginTop: 50,
      marginBottom: 20
    },
    createExerciseButton:{
      marginVertical: 20,
      alignSelf: 'flex-end',
      marginRight: 20,
      width: 20, // Set the desired width
      height: 20, // Set the desired height
      borderRadius: 50, // Make the borderRadius half of the width and height for a perfect circle
      backgroundColor: '#808080', // Set your desired background color
      justifyContent: 'center',
      alignItems: 'center',
    },
    createExerciseButtonText:{
      fontSize: 15,
      color: "#fff",
      fontWeight: "600",
      alignSelf: 'center'
    }
  });