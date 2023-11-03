import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { NavigationProp } from '@react-navigation/native';
import { editProfile, editSet } from '../functions/databaseQueries';
import UserContext from '../contexts/UserContext';
import Datepicker from '../components/Datepicker';
import Radiobutton from '../components/Radiobutton';
import SelectMenu from '../components/SelectMenu';

interface RouterProps {
    route: any,
    navigation: NavigationProp<any, any>;
}



const EditProfile = ({ route, navigation }: RouterProps) => {
    const userID = useContext(UserContext);
    const { user } = route?.params;
    const [name, setName] = useState<string>(user.name);
    const [age, setAge] = useState<number>(user.age);
    const [weight, setWeight] = useState<number>(user.weight);
    const [height, setHeight] = useState<number>(user.height);
    const [birthDate, setBirthDate] = useState(new Date());
    const [gender, setGender] = useState<string>(user.gender);
    const options = ["Male", "Female"];
    const [systemValueWeight, setSystemValueWeight] = useState<string>();
    const [systemItemsWeight] = useState<object[]>([
      {label: 'Metric (kg)', value: 'kg'},
      {label: 'Imperial (lbs)', value: 'lbs'}
    ]);
    const [systemValueHeight, setSystemValueHeight] = useState<string>();
    const [systemItemsHeight] = useState<object[]>([
      {label: 'Metric (cm)', value: 'm'},
      {label: 'Imperial (ft)', value: 'ft'}
    ]);
    const [activityValue, setActivityValue] = useState<string>(user.activityLevel);
    const [activityItems] = useState([
      {label: 'Beginner', value: 'beginner'},
      {label: 'Intermediate', value: 'intermediate'},
      {label: 'Advanced', value: 'advanced'}
    ]);


    useEffect(() => {
        const today = new Date();
        

        if (birthDate.toDateString() === today.toDateString()) {
            setAge(user.age)
        }
        else{
            setAge(today.getFullYear()-birthDate.getFullYear())
        }
    }, [birthDate])
    


    function handleModifyButton(): void {
        if (name === "") 
            alert("Name field cannot be empty!");
        else if (Number.isNaN(weight)) 
            alert("Weight field cannot be empty!");
        else if (Number.isNaN(height)) 
            alert("Height field cannot be empty!");
        else if (age < 0)
            alert("Unfortunately this time we cannot sign up time travellers. Sorry for the inconvenience");
        else if (age >= 0 && age < 12)
            alert("You need to be at least 12 years old to sign up");
        else if (age > 120 )
            alert("Aren't you a bit too old (or dead) to work out?");
        else if(typeof(weight) !== 'number')
            alert("Weight must be a number");
        else if(weight < 0)
            alert("Weight can't be a negative number");
            else if(typeof(height) !== 'number')
            alert("Height must be a number");
        else if(height < 0)
            alert("Height can't be a negative number");
        else{
            if (systemValueWeight === "lbs")
                setWeight(weight => Math.round((weight*0.453592)*100)/100);
            if (systemValueWeight === "ft")
                setHeight(height => Math.round((height*30.48)*100)/100);
            
            const changes = {
                name : name,
                age: age,
                gender: gender,
                weight: weight,
                height: height,
                activityLevel: activityValue
            }
            console.log(changes);
            
            editProfile(userID,changes)
            navigation.navigate("Account")
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.gridContainer}>
                <Text style={styles.text}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    placeholder="name"
                    autoCapitalize='none'
                    onChangeText={(text) => setName(text)}
                />
            </View>
            <View style={styles.gridContainer}>
                <Text style={styles.text}>Birthday</Text>
                <Datepicker date={birthDate} setDate={setBirthDate} />
                <Text>{birthDate.toDateString()}</Text>
            </View>
            <View style={styles.gridContainer}>
                <Text style={styles.text}>Gender</Text>
                <Radiobutton selectedValue={gender} setselectedValue={setGender} options={options} />
            </View>
            <View style={styles.gridContainer}>
                <Text style={styles.text}>Weight</Text>
                <TextInput
                    keyboardType='numeric'
                    value={weight.toString()}
                    style={styles.input}
                    placeholder={systemValueWeight === "lbs" ? "Weight (lbs)" : "Weight (kg)" }
                    autoCapitalize='none'
                    onChangeText={(text) => setWeight(parseFloat(text))}
                />
                <View style={styles.systemSelectMenuContainer}>
                    <SelectMenu data={systemItemsWeight} setSelectedValue={setSystemValueWeight} title={"System"} />
                </View>
            </View>
            <View style={styles.gridContainer}>
                <Text style={styles.text}>Height</Text>
                <TextInput
                    keyboardType='numeric'
                    value={height.toString()}
                    style={styles.input}
                    placeholder={systemValueHeight === "ft" ? "height (ft)" : "height (cm)" }
                    autoCapitalize='none'
                    onChangeText={(text) => setHeight(parseFloat(text))}
                />
                <View style={styles.systemSelectMenuContainer}>
                    <SelectMenu data={systemItemsHeight} setSelectedValue={setSystemValueHeight} title={"System"} />
                </View>
            </View>
            <View style={styles.activitySelectMenuContainer}>
                <SelectMenu data={activityItems} setSelectedValue={setActivityValue} title={"Activity level"} />
            </View> 
            <Pressable style={styles.button} onPress={() => handleModifyButton()}>
                <Text style={styles.text}>Modify</Text>                   
            </Pressable>
        </View>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ff0000'
    },
    input: {
        marginHorizontal: 10,
        flex: 1,
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    },
    text:{
        alignSelf: 'center',
        fontSize: 18,
        color: "#fff",
        textTransform: 'uppercase',
        fontWeight: "600",
        paddingVertical: 10,
        marginHorizontal: 10
    },
    gridContainer:{
        flexDirection: 'row',
        marginHorizontal: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 10
    },
    activitySelectMenuContainer: {
        backgroundColor: "#fff",
        padding: 5,
        marginHorizontal: 10
      },
    systemSelectMenuContainer: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 5
      },
    button:{
        marginTop: 20,
        width: 100,
        paddingHorizontal: 5,
        marginHorizontal: 20,
        alignSelf: "center",
        backgroundColor: "#000",
    },
  });