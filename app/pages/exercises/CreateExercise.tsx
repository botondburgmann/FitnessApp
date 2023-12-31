import { StyleSheet, Text, TextInput, View, Switch, Pressable, ImageBackground } from 'react-native'
import React, { useContext, useState } from 'react'
import UserContext from '../../contexts/UserContext';
import Info from '../../components/Info';
import { backgroundImage, globalStyles } from '../../assets/styles';
import { collection, addDoc } from 'firebase/firestore';
import { getUserDocument } from '../../functions/firebaseFunctions';
import { RouterProps } from '../../types and interfaces/types';

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

    async function createNewExercise (userID: string, name: string, isUnilateral: boolean, isIsometric: boolean): Promise<void> {
        try {  
            const userDoc = await getUserDocument(userID)
            
            if (userDoc === undefined) 
                throw new Error("User doesn't exist");
            
            const exercisesCollectionRef = collection(userDoc.ref, "exercises");
            addDoc(exercisesCollectionRef, {
                hidden: false,
                isometric: isIsometric,
                name: name,
                unilateral: isUnilateral
            });   
        }   catch (error: any) {
            alert(`Error: Couldn't create exercise: ${error.message}`);
        }
    }

    function showCustomAlert (title: string, information: string): void {
        setCustomAlertVisible(true);
        setTitle(title);
        setInformation(information);
    }
    
    function hideCustomAlert (): void {
        setCustomAlertVisible(false);
    }

    function toggleUnilateralitySwitch(): void {
        if (isUnilateral) 
            setUnilaterality('bilateral');
        else 
            setUnilaterality('unilateral')

        setIsUnilateral(previousState => !previousState);
    }

    function toggleIsometricitySwitch(): void {
        if (isIsometric) 
            setIsometricity('not isometric');
        else 
            setIsometricity('isometric')

        setIsIsometric(previousState => !previousState);
    }

    function handleButtonClick(): void {
        try {
            if (userID === null) 
                throw new Error("User is not authorized");
            if (name === undefined) 
                throw new Error("Please choose a name for your exercise!");
            
            createNewExercise(userID, name, isUnilateral, isIsometric)
            navigation.navigate("Exercise List");
        }   catch (error: any) {
            alert(`Error: Couldn't save exercise: ${error.message}`)
        }
    }

  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
        <View style={[globalStyles.container, {flex: 1}]}>
            <TextInput
                value={name}
                style={globalStyles.input}
                placeholder='Exercise name'
                autoCapitalize='none'
                onChangeText={(text) => setName(text)}
            />
            <View style={styles.gridContainer}>
                <Text style={[globalStyles.text, {fontWeight: "600"}]}>This exercise is {unilaterality}</Text>
                <Pressable style={styles.infoButton} onPress={() => showCustomAlert("What is unilaterality?","A unilateral exercise is a weight bearing movement mainly or completely involving one limb (e.g. single leg squat, Bulgarian split squat and single leg jump), whereas, a bilateral exercise is a weight bearing movement executed evenly and simultaneously by both limbs (e.g. back squat, deadlift and countermovement jump)." )}>
                    <Text style={styles.infoButtonText}>i</Text>
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
                    trackColor={{ false: "#000", true: "#fff" }}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleUnilateralitySwitch}
                    value={isUnilateral}
                />
            </View>
        
            <View style={styles.gridContainer}>
                <Text style={[globalStyles.text, {fontWeight: "600"}]}>This exercise is {isometricity}</Text>
                <Pressable style={styles.infoButton} onPress={() => showCustomAlert("What is isometricity?","Isometric exercises are tightening (contractions) of a specific muscle or group of muscles. During isometric exercises, the muscle doesn't noticeably change length. The affected joint also doesn't move. Isometric exercises help maintain strength. They can also build strength, but not effectively. And they can be performed anywhere. Examples include wall sit or plank." )} >
                    <Text style={styles.infoButtonText}>i</Text>
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
                    trackColor={{ false: "#000", true: "#fff" }}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleIsometricitySwitch}
                    value={isIsometric}

                />
            </View>
        
            <Pressable style={[globalStyles.button, {marginTop: 125}]} onPress={handleButtonClick} >
                <Text style={globalStyles.buttonText}>Create new exercise</Text>
            </Pressable>
        </View>
    </ImageBackground>
  )
}

export default CreateExercise

const styles = StyleSheet.create({
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
  label: {
      alignSelf: 'center',
      fontSize: 20,
      fontWeight: "800",
      color: "#fff",
      textTransform: 'uppercase',
      marginTop: 50,
      marginBottom: 20
    },
    infoButton:{
      marginVertical: 20,
      alignSelf: 'flex-end',
      marginRight: 20,
      width: 20,
      height: 20,
      borderRadius: 50,
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
    },
    infoButtonText:{
      fontSize: 15,
      color: "#fff",
      fontWeight: "600",
      alignSelf: 'center'
    }
  });