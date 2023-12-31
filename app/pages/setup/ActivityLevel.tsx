import { View, Pressable, Text, ImageBackground } from 'react-native'
import React, { useContext, useState } from 'react'
import SelectMenu from '../../components/SelectMenu';
import UserContext from '../../contexts/UserContext';
import { ActivityLevelOption, RouterProps } from '../../types and interfaces/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { backgroundImage, globalStyles } from '../../assets/styles';
import { setUpStyles } from './styles';
import { updateDoc } from 'firebase/firestore';
import { getUserDocumentRef } from '../../functions/firebaseFunctions';




const ActivityLevel = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);

  const [selectedActivityLevel, setSelectedActivityLevel] = useState<ActivityLevelOption>({label: 'Beginner', value: 'beginner'});
  const [activityLevels] = useState<ActivityLevelOption[]>([
    {label: 'Beginner', value: 'beginner'},
    {label: 'Intermediate', value: 'intermediate'},
    {label: 'Advanced', value: 'advanced'}
  ]);

  async function setActivityLevelInFirebase(userID: string, selectedActivityLevel: ActivityLevelOption): Promise<void> {
    try {
      const userDocRef = await getUserDocumentRef(userID);
      if (userDocRef === undefined)
        throw new Error("User doesn't exist in database");
      const newData = {
        "activityLevel": selectedActivityLevel.value,
        "set": true
      };
      updateDoc(userDocRef, newData);
      navigation.navigate("Inside");
    } catch (error: any) {
      alert(`Error: Couldn't set your activity level: ${error.message}`)
    }
  }
  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={setUpStyles.container}>
        <Text style={setUpStyles.label}>Please, select your activity level</Text>
        <View style={setUpStyles.icon}>
          <MaterialCommunityIcons name="weight-lifter" size={60} color="#FFF" />
        </View>
        <View style={[setUpStyles.selectMenuContainer, {paddingVertical: 20}]}>
          <SelectMenu data={activityLevels} setSelectedValue={setSelectedActivityLevel} title={selectedActivityLevel.label} />
        </View>
        <View style={setUpStyles.buttonGroup}>
          <Pressable style={setUpStyles.button} onPress={() => navigation.navigate('Height')}>
            <Text style={globalStyles.buttonText}>Go back</Text>
          </Pressable>
          <Pressable style={setUpStyles.button} onPress={() => userID && setActivityLevelInFirebase(userID, selectedActivityLevel)}>
            <Text style={globalStyles.buttonText}>Finish</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  )
}

export default ActivityLevel

