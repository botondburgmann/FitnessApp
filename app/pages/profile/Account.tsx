import { ImageBackground, Pressable, Text, View } from "react-native"
import React, { useContext, useEffect, useState } from "react"
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig"
import UserContext from "../../contexts/UserContext";
import { User, RouterProps, SingleSet, Sets } from "../../types and interfaces/types";
import { backgroundImage, globalStyles } from "../../assets/styles";
import { Unsubscribe } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getUser } from "../../functions/firebaseFunctions";

type MaxValueAndIndex = {
  value: number;
  index: number;
}

const Account = ({ route, navigation }: RouterProps) => {
  const loggedInUserID   = useContext(UserContext);
  const { userID } = route?.params;

  const [user, setUser] = useState<User>({
    activityLevel: "",
    dateOfBirth: "",
    experience: 0,
    gender: "Male",
    height: 0,
    level: 0,
    name: "",
    userID: "",
    weeklyExperience:0,
    weight: 0
  });
  const [mostWeightExercise, setmostWeightExercise] = useState<SingleSet>({
    exercise: "",
    reps: 0,
    restTime: 0,
    side: "both",
    time: 0,
    weight: 0
})
  const [mostRepsExercise, setmostRepsExercise] = useState<SingleSet>({
    exercise: "",
    reps: 0,
    restTime: 0,
    side: "both",
    time: 0,
    weight: 0
})



function getMostWeightExercise (userID: string, callback: Function ): Unsubscribe | undefined {
  try {
    const bestExercise: SingleSet = {
      exercise: "",
      reps: 0,
      restTime: 0,
      side: "both",
      time: 0,
      weight: 0
    };
    const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");    
    const workoutsQuery = query(workoutsCollectionRef, where("userID", "==", userID));
    const unsubscribeFromWorkouts = onSnapshot(workoutsQuery, (snapshot) => {
      if (snapshot.empty) return;
      
      snapshot.docs.forEach((doc) => {
        const workoutData = doc.data().Workout;
        if (!workoutData) return;
        workoutData.forEach((exercise: Sets) => {
          const maxField = getMaxValueAndIndexOfArray(exercise.weights);

          if (maxField !== undefined && ( (maxField.value > bestExercise.weight) ||
                                          ( maxField.value === bestExercise.weight && exercise.reps[maxField.index] > bestExercise.reps) )) {
            bestExercise.exercise = exercise.exercise[maxField.index];
            bestExercise.reps = exercise.reps[maxField.index];
            bestExercise.restTime = exercise.restTimes[maxField.index];
            bestExercise.side = exercise.sides[maxField.index];
            bestExercise.time = exercise.times[maxField.index];
            bestExercise.weight = exercise.weights[maxField.index];
          }
          
          
          
          
        });
      });
      callback(bestExercise)
    });
    
    return unsubscribeFromWorkouts; 
  } catch (error: any) {
      alert(`Error: Couldn't fetch best exercises for most weight: ${error}`)
  }
}
function getMostRepsExercise (userID: string, callback: Function ): Unsubscribe | undefined {
  try {
    const bestExercise: SingleSet = {
      exercise: "",
      reps: 0,
      restTime: 0,
      side: "both",
      time: 0,
      weight: 0
    };
    const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");    
    const workoutsQuery = query(workoutsCollectionRef, where("userID", "==", userID));
    const unsubscribeFromWorkouts = onSnapshot(workoutsQuery, (snapshot) => {
      if (snapshot.empty) return;
      
      snapshot.docs.forEach((doc) => {
        const workoutData = doc.data().Workout;
        if (!workoutData) return;
        workoutData.forEach((exercise: Sets) => {
          const maxField = getMaxValueAndIndexOfArray(exercise.reps);

          if (maxField !== undefined && ( (maxField.value > bestExercise.reps) ||
                                          ( maxField.value === bestExercise.reps && exercise.weights[maxField.index] > bestExercise.weight) )) {
            bestExercise.exercise = exercise.exercise[maxField.index];
            bestExercise.reps = exercise.reps[maxField.index];
            bestExercise.restTime = exercise.restTimes[maxField.index];
            bestExercise.side = exercise.sides[maxField.index];
            bestExercise.time = exercise.times[maxField.index];
            bestExercise.weight = exercise.weights[maxField.index];
          }
          
          
          
          
        });
      });
      callback(bestExercise)
    });
    
    return unsubscribeFromWorkouts; 
  } catch (error: any) {
      alert(`Error: Couldn't fetch best exercises for most reps: ${error}`)
  }
}

function getMaxValueAndIndexOfArray (array:number[]): MaxValueAndIndex | undefined {
  try {
    const max = {
        value : 0,
        index: 0
    };
    if (array === undefined) return
    
    for (let i = 0; i < array.length; i++)
      if (array[i] > max.value) {
        max.value = array[i];
        max.index = i;
      }
    
    return max;
  } catch (error) {
      alert(`Error: Couldn't find max of ${array}: ${error}`)
  }
}




useEffect(() => {
  const unsubscribeFromUser = getUser(userID, (userData: React.SetStateAction<User>) => {
    setUser(userData);
  });
   const unsubscribeFromMostWeight = getMostWeightExercise(userID, (exerciseData: SingleSet) => {    
    setmostWeightExercise(exerciseData);
  });
   const unsubscribeFromMostReps = getMostRepsExercise(userID, (exerciseData: SingleSet) => {    
    setmostRepsExercise(exerciseData);
  });


  return () => {
    if (unsubscribeFromUser !== undefined && unsubscribeFromMostWeight !== undefined  && unsubscribeFromMostReps !== undefined) {
      unsubscribeFromUser();
      unsubscribeFromMostWeight();
      unsubscribeFromMostReps();
    }
    setUser({
      activityLevel: "",
      dateOfBirth: "",
      experience: 0,
      gender: "Male",
      height: 0,
      level: 0,
      name: "",
      weeklyExperience:0,
      weight: 0,
      userID: ""
    });
    setmostWeightExercise({
      exercise: "",
      reps: 0,
      restTime: 0,
      side: "both",
      time: 0,
      weight: 0
    });
    setmostRepsExercise({
      exercise: "",
      reps: 0,
      restTime: 0,
      side: "both",
      time: 0,
      weight: 0
    })
  }
},[userID])

  
  
  
 
 const [experienceNeeded, setExperienceNeeded] = useState(0);
  useEffect(() => {
    user && setExperienceNeeded(Math.round(100*1.5**(user.level+1)-user.experience))
  
  }, [user])
  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
    <View style={[globalStyles.container, {flex: 1}]}>
        <View>
            <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>{user.name}</Text>
            <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>Level: {user.level}</Text>
            <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>XP until next level: {experienceNeeded}</Text>
            <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>Best records</Text>
            {
            mostWeightExercise.exercise === ""
            ? <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>
                Max weight: No data
              </Text>
            : <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>
                Max weight: { mostWeightExercise.exercise} { mostWeightExercise.weight} kg ({mostWeightExercise.reps} repetitions)
              </Text>
          }
          {
            mostRepsExercise.exercise === ""
            ? <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>
                Most repetitions: No data
              </Text>
            : <Text style={[globalStyles.text, {textTransform: "uppercase", fontWeight: "600", paddingVertical: 10}]}>
                Most repetitions: {mostRepsExercise.exercise} { mostRepsExercise.reps} repetitions ({ mostRepsExercise.weight} kg)
              </Text>
            }
        </View>
      
          <Pressable style={globalStyles.button}>
              <Text style={globalStyles.buttonText} onPress={() => navigation.navigate("Achievements", {userID: userID})}>Achievements</Text>
          </Pressable>
        {userID === loggedInUserID &&
        <View>
          <Pressable style={globalStyles.button}>
            <Text style={globalStyles.buttonText} onPress={() => navigation.navigate("Edit profile", {user: user})}>Edit profile</Text>
          </Pressable>
          <Pressable style={globalStyles.button}>
            <Text style={globalStyles.buttonText} onPress={() => FIREBASE_AUTH.signOut()}>Log out</Text>
          </Pressable>
        </View>
        }
      </View>
    </ImageBackground>
  )
}

export default Account
