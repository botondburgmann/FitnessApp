import { Auth, createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import { NavigationProp } from "@react-navigation/native";
import { validateActivityLevel, validateAge, validateExerciseSet, validateExperience, validateGender, validateHeight, validateWeight } from "./validations";
import { SelectItem, MaxValueAndIndex, BestExercise, Exercise, ExerciseSet, ExerciseRecords, Account } from "../types and interfaces/types";
import { useRef } from "react";


// getters
export const getSetUpValue = async (userID: string): Promise<boolean> => {
    try {
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const q = query(usersCollectionRef, where("userID", "==", userID));
        const snapshot = await getDocs(q);
        const doc = snapshot.docs[0];
        return doc.data().set;
    } 
    catch (error) {
        alert(`Error: Couldn't find set field: ${error.message}`);
    }
};

function getMax(array:number[]): MaxValueAndIndex{
    const max = {
        value : 0,
        index: 0
    };
    for (let i = 0; i < array.length; i++)
        if (array[i] > max.value) {
            max.value = array[i];
            max.index = i;
        }
    return max;
}

export const getBestExercise =  async (userID: string, field:string, secondaryField:string ): Promise<BestExercise> => {
    return new Promise((resolve, reject) => {
        const bestExercise = {
            name: "",
            weights: 0,
            reps: 0
        };
        const workoutCollectionRef = collection(FIRESTORE_DB, "Workouts");
        const workoutQuery = query(workoutCollectionRef, where("userID", "==", userID));
        onSnapshot(workoutQuery, snapshot => {
            const doc = snapshot.docs[0];
            for (const exercise of doc.data().Workout) {
                if (getMax(exercise[field]).value > bestExercise[field]) {
                    bestExercise[field] = getMax(exercise[field]).value;
                    bestExercise.name = exercise.exercise[getMax(exercise.weights).index];
                    bestExercise[secondaryField] = exercise.reps[getMax(exercise[field]).index];
                }
                else if (getMax(exercise[field]).value === bestExercise[field]) {
                    if (getMax(exercise[secondaryField]).value > bestExercise[secondaryField]) {
                        bestExercise[secondaryField] = getMax(exercise[secondaryField]).value;
                        bestExercise.name = exercise.exercise[getMax(exercise[secondaryField]).index];
                        bestExercise[field] = exercise.weights[getMax(exercise[secondaryField]).index];
                    }   
                } 
            };                
            resolve(bestExercise);
        }, error => reject(error) );

    })
    
};
  


export const getUsersExercises = async (userID: string): Promise<Exercise[]> => {
    return new Promise((resolve, reject) => {
        const exercises = [];

        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        onSnapshot(usersQuery, async userSnapshot => {
            const userDoc = userSnapshot.docs[0];
            const exercisesCollectionRef = collection(userDoc.ref, "exercises");
            onSnapshot(exercisesCollectionRef, (exercisesSnapshot)=> {
                exercisesSnapshot.docs.forEach((exercisesDoc) => {
                    exercises.push(exercisesDoc.data());
                })
                resolve(exercises);
            },error =>  reject(error));
        });
    });
  };

export const getExercise = async (userID: string, exerciseName: string): Promise<ExerciseRecords> => {
    return new Promise ((resolve, reject) => {
        const exerciseRecords = {
            weights: [],
            reps: [],
            times: [],
            restTimes: [],
            dates: [],
        }
        const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");    
        const workoutsQuery = query(workoutsCollectionRef, where("userID", "==", userID));

        onSnapshot(workoutsQuery, workoutSnapshot => {
            workoutSnapshot.docs.forEach(workoutDoc => {
                for (let i = 0; i < workoutDoc.data().Workout.length; i++) {
                    let set = workoutDoc.data().Workout[i];
                    for (let j = 0; j < set.exercise.length; j++)
                        if (set.exercise[j] === exerciseName) {
                            exerciseRecords.weights.push(set.weights[i])
                            exerciseRecords.reps.push(set.reps[i])
                            exerciseRecords.times.push(set.times[i])
                            exerciseRecords.restTimes.push(set.restTimes[i])
                            exerciseRecords.dates.push(workoutDoc.data().date)
                        }
                }
            })
            resolve(exerciseRecords);

        }, error => reject(error));
    })
};

export const getExercisesByFocus = async (userID: string, musclesWorked: string[]): Promise<Exercise[]> => {
    return new Promise ((resolve, reject) => {
        const exercises = [];
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        onSnapshot(usersQuery, usersSnapshot => {
            const userDoc = usersSnapshot.docs[0];
            const exercisesCollectionRef = collection(userDoc.ref, "exercises");
            const exercisesQuery = query(exercisesCollectionRef, where("hidden", "==", false), where("musclesWorked", "array-contains-any", musclesWorked));
            onSnapshot(exercisesQuery, exercisesSnapshot => {
                exercisesSnapshot.docs.forEach(exercisesDoc => {
                    exercises.push(exercisesDoc.data());
                })
                resolve(exercises);
            }, error => reject(error));
        })
    })
};

export const getUser = async (userID: string): Promise<Account> => {
    return new Promise ((resolve, reject) => {
        const profile = {
            activityLevel: "",
            age: 0,
            experience: 0,
            gender: "",
            height: 0,
            level: 0,
            name: "",
            weeklyExperience: 0,
            weight: 0
        }
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        onSnapshot(usersQuery, usersSnapshot => {
            const usersDoc = usersSnapshot.docs[0];
            profile.activityLevel = usersDoc.data().activityLevel;
            profile.age = usersDoc.data().age;
            profile.experience = usersDoc.data().experience;
            profile.gender = usersDoc.data().gender;
            profile.height = usersDoc.data().height;
            profile.level = usersDoc.data().level;
            profile.name = usersDoc.data().name;
            profile.weeklyExperience = usersDoc.data().weeklyExperience;
            profile.weight = usersDoc.data().weight;

            resolve(profile);
        }, error => reject(error));
    })
};

export const getExercises = async (userID: string, date: string): Promise<ExerciseSet[]> => {
    return new Promise((resolve, reject) => {
      const exercises = [];
  
      const workoutCollectionRef = collection(FIRESTORE_DB, "Workouts");
      const workoutsQuery = query(workoutCollectionRef, where("userID", "==", userID), where("date", "==", date));
  
      onSnapshot(
        workoutsQuery,
        async (workoutsSnapshot) => {
          workoutsSnapshot.docs.forEach((workoutsDoc) => {
            for (let i = 0; i < workoutsDoc.data().Workout.length; i++) {
              exercises.push({
                exercise: workoutsDoc.data().Workout[i].exercise,
                weights: workoutsDoc.data().Workout[i].weights,
                reps: workoutsDoc.data().Workout[i].reps,
                times: workoutsDoc.data().Workout[i].times,
                restTimes: workoutsDoc.data().Workout[i].restTimes,
                sides: workoutsDoc.data().Workout[i].sides,
              });
            }
          });
  
          resolve(exercises); // Resolve the Promise with the data
        },
        (error) => {
          reject(error); // Reject the Promise if there's an error
        }
      );
    });
  };
  

// setters
export const signUp =async (name:string, setLoading:Function, auth:Auth, email:string, password:string): Promise<void> => {
    setLoading(true);
    try {
        if (name === "")
            throw new Error("name must be set"); 
        const response = await createUserWithEmailAndPassword(auth, email,password);
        const userData = {
            userID: response.user.uid, 
            name: name, 
            gender: "", 
            age: 0, 
            weight: 0, 
            height: 0, 
            activityLevel: "", 
            set: false, 
            level: 1, 
            experience: 0
        };
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const userDocRef = await addDoc(usersCollectionRef, userData);
        
        
        const exercisesCollectionRef = collection(FIRESTORE_DB, "Exercises");
        const exercisesQuerySnapshot = await getDocs(exercisesCollectionRef);
        exercisesQuerySnapshot.forEach(async (exerciseDoc) => {
            const exerciseData = exerciseDoc.data();
            const userSubcollectionRef = collection(userDocRef, "exercises");
            await addDoc(userSubcollectionRef, exerciseData);
        })
        alert("Registered successfully!");
    }   
    catch (error:any) {
        alert(`Error: Registration failed: ${error.message}`);
    }   
    finally{
        setLoading(false);
    }
}

export const setUpProfile =async (field:string, value:number | string | Date | SelectItem, userID:string, navigation:NavigationProp<any, any>, nextPage:string, system?: string): Promise<void> => {
    try {
        if (field === "gender" && typeof(value) === "string")
            validateGender(value);

        else if (field === "age" && value instanceof Date){
            const today = new Date()      
            const age =  today.getFullYear()-value.getFullYear();      
            validateAge(age);
            value = age;
        }
        
        else if (field === "weight" && typeof(value) === "number") {
            validateWeight(value);
            if (system === "lbs")
                value = Math.round((value*0.453592)*100)/100;
        }
        
        else if (field === "height" && typeof(value) === "number") {
            validateHeight(value);
            if (system === "ft")
                value = Math.round((value*30.48)*100)/100;
        }
        else if (field === "activityLevel" && typeof value === "object" && "label" in value && "value" in value)
            validateActivityLevel(value as SelectItem);
          

        const usersCollection = collection(FIRESTORE_DB, "Users");
        const q = query(usersCollection, where("userID", "==", userID));
        const snapshot = await getDocs(q);
        snapshot.forEach(async (docSnapshot) => {
            const userDocRef = doc(FIRESTORE_DB, "Users", docSnapshot.id);

            if (field === "activityLevel" && typeof value === "object" && "label" in value && "value" in value) {
                const newData = { [field]: value.value,set: true }; 
                await updateDoc(userDocRef, newData);
            } else {
                const newData = { [field]: value}; 
                await updateDoc(userDocRef, newData);
            }
            navigation.navigate(nextPage);
        });  
    }   
    catch (error:any) {
        alert(`Error: Adding data has failed: ${error.message}`);
    }
}

export const addSet =async (userID:string, date: string, set: ExerciseSet, xpToAdd: number): Promise<void> => {
    try {
        const workoutsCollection = collection(FIRESTORE_DB, "Workouts");
        const workoutsQuery = query(workoutsCollection, where("date", "==", date), where("userID", "==", userID) );

        const workoutsSnapshot = await getDocs(workoutsQuery);
        if(workoutsSnapshot.empty){
            const data = {
                exercise : set.exercise,
                weights: set.weights,
                reps: set.reps,
                times: set.times,
                restTimes: set.restTimes,
                sides: set.sides
            };
            validateExerciseSet(data);

            await addDoc(workoutsCollection, {
                date: date,
                userID: userID,
                Workout: data
            });
        
        } else {
            const data = {
                exercise : set.exercise,
                weights: set.weights,
                reps: set.reps,
                times: set.times,
                restTimes: set.restTimes,
                sides: set.sides
            };
            validateExerciseSet(data);

            for (const docSnapshot of workoutsSnapshot.docs) {
                const updatedData = [...docSnapshot.data().Workout ];
                updatedData.push(data)
                await updateDoc(doc(FIRESTORE_DB, 'Workouts', docSnapshot.id), {
                    Workout: updatedData
                });     
            }
        } 
        addExperience(userID, xpToAdd);
    } 
    catch (error) {
        alert(`Error: Couldn't add set: ${error.message}`)
    } 
}

export const addExperience = async (userID: string, experience: number): Promise<void> => {
    try {
        const usersCollectionRef = collection(FIRESTORE_DB,"Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        const firstUsersSnapshot = await getDocs(usersQuery);
        const firstUserDoc = firstUsersSnapshot.docs[0];

        validateExperience(experience);

        const firstUpdatedData = {
            experience: firstUserDoc.data().experience+experience,
            weeklyExperience: firstUserDoc.data().weeklyExperience+experience,
        }

        await updateDoc(firstUserDoc.ref, firstUpdatedData);
        
        const secondUsersSnapshot = await getDocs(usersQuery);
        const secondUserDoc = secondUsersSnapshot.docs[0];
        const secondUserData = secondUserDoc.data() as Account;
        const secondUpdateData = {
            level: secondUserData.experience < 225 ? 1 : Math.floor(Math.log(secondUserData.experience / 100) / Math.log(1.5)),
        };
        
        await updateDoc(secondUserDoc.ref, secondUpdateData);
    } 
    catch (error) {
        alert(`Error: Couldn't update experience and level fields: ${error}`)
    }
};

export const toggleExerciseVisibilty =async (userID: string, exerciseName: string): Promise<void> => {
    try {
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        const usersSnapshot = await getDocs(usersQuery);
        const userDoc = usersSnapshot.docs[0];

        const exercisesCollectionRef = collection(userDoc.ref, "exercises");
        const exercisesQuery = query(exercisesCollectionRef, where("name", "==", exerciseName));
        const exercisesSnapshot = await getDocs(exercisesQuery);
        exercisesSnapshot.docs.forEach((exercisesDoc) => {
            const updateData = {
                hidden: !exercisesDoc.data().hidden
            };
            updateDoc(exercisesDoc.ref, updateData);
        })

    } catch (error) {
        alert(`Error: Couldn't change visibility for ${exerciseName}: ${error.message}`)
    }
};

export const deleteSet = async (userID:string, exerciseName: string, exerciseID: number, setID: number, xpToDelete: number ): Promise<void> => {
    try {  
        const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");    
        const workoutQuery = query(workoutsCollectionRef, where("userID", "==", userID));
        const workoutSnapshot = await getDocs(workoutQuery);
              
        for (const docSnapshot of workoutSnapshot.docs) {
            const updatedData = { ...docSnapshot.data() };

            for (let i = 0; i < docSnapshot.data().Workout.length; i++) {   
                if (docSnapshot.data().Workout[i].exercise[setID] === exerciseName && i === exerciseID){
                    if ( updatedData.Workout[i].exercise.length === 1) {
                        updatedData.Workout.splice(i, 1)
                    }
                    else{
                        updatedData.Workout[i].exercise.splice(setID, 1);
                        updatedData.Workout[i].weights.splice(setID, 1);
                        updatedData.Workout[i].reps.splice(setID, 1);
                        updatedData.Workout[i].times.splice(setID, 1);
                        updatedData.Workout[i].sides.splice(setID, 1);
                        updatedData.Workout[i].restTimes.splice(setID, 1);   
                    }
                    await updateDoc(doc(FIRESTORE_DB, "Workouts", docSnapshot.id), {
                        Workout: updatedData.Workout
                    });
                }   
            }
  
        } 
    console.log(xpToDelete);
      
    validateExperience(xpToDelete);
    addExperience(userID, xpToDelete);

    } 
    catch (error) {
        alert(`Error: Couldn't delete fields: ${error.message}`);
   }
};

export const createNewExercise = async (userID: string, name: string, isUnilateral: boolean, isIsometric: boolean): Promise<void> => {
    try {  
        const usersCollectionRef = collection(FIRESTORE_DB, "Users" )
        const usersQuery = query(usersCollectionRef,where("userID", "==", userID))
        const usersSnapshot = await getDocs(usersQuery);
        const usersDoc = usersSnapshot.docs[0];
        const exercisesCollectionRef = collection(usersDoc.ref, "exercises");
        await addDoc(exercisesCollectionRef, {
            hidden: false,
            isometric: isIsometric,
            name: name,
            unilateral: isUnilateral
        });   
    } 
    catch (error) {
        alert(`Error: Couldn't create exercise: ${error.message}`);
    }
};

export const editSet = async (userID:string, exerciseName: string, exerciseID: number, setID: number, changes: object, xpToChange: number): Promise<void> => {
    try {  
        const workoutsCollectionRef = collection(FIRESTORE_DB, "Workouts");    
        const workoutsQuery = query(workoutsCollectionRef, where("userID", "==", userID));
        const workoutSnapshot = await getDocs(workoutsQuery);
              
        for (const workoutDoc of workoutSnapshot.docs) {
            const updatedData = { ...workoutDoc.data() };

            for (let i = 0; i < workoutDoc.data().Workout.length; i++) {   
                if(workoutDoc.data().Workout[i].exercise[setID] === exerciseName && i === exerciseID){
                
                    for (const change in changes) 
                        updatedData.Workout[i][change][setID] = changes[change];
                    
                    await updateDoc(doc(FIRESTORE_DB, "Workouts", workoutDoc.id), {
                        Workout: updatedData.Workout
                    });
                }
            }  
        }
        addExperience(userID, xpToChange);

    } catch (error) {
        alert(`Error: couldn't update set fields: ${error.message}`);
   }
};

export const resetWeeklyExperience = async (userID:string): Promise<void> => {
    try {
        const usersCollection = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollection, where("userID", "==", userID));
        const usersSnapshot = await getDocs(usersQuery);
        const usersDoc = usersSnapshot.docs[0];
        const updateData = {
            weeklyExperience: 0
        };
        updateDoc(usersDoc.ref, updateData);
    }
    catch (error) {
        alert(`Error: couldn't reset weekly experience:  ${error}`);
    }
};

export const editProfile = async (userID:string, changes: Account): Promise<void> => {
    try {  
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");    
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        const usersSnapshot = await getDocs(usersQuery);
        const usersDoc = usersSnapshot.docs[0];
        const updateData = {
            name : changes.name,
            age: changes.age,
            gender: changes.gender,
            weight: changes.weight,
            height: changes.height,
            activityLevel: changes.activityLevel
        };
        updateDoc(usersDoc.ref, updateData);

    } 
    catch (error) {
        alert(`Error: couldn't find fields: ${error.message}`);
    }
};













