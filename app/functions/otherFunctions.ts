import { Alert } from "react-native";
import { deleteSet } from "./databaseQueries";
import { ExerciseSelectOption, ExerciseSet } from "../types and interfaces/types";

export const addXP = (isIsometric: boolean, set): number => {
    let currentExperience = 0;
    if (!isIsometric) {
        if (set.weights === 0 && Number.isNaN(set.weights))
            currentExperience += set.reps;
        else
            currentExperience += set.reps * set.weights;
    }
    else {
        if (set.weights === 0 && Number.isNaN(set.weights))
            currentExperience += set.times;
        else
            currentExperience += set.times * set.weights;
    }            
    return currentExperience;
}

export const  removeXP = (repOrTime: number, weight: number): number => {
    let currentExperience = 0;
    if (weight === 0)
        currentExperience -= repOrTime;
    else 
        currentExperience -= repOrTime * weight;
        return currentExperience;
};

export const showDeleteConfirmation = (userID: string, exerciseName: string, exerciseID: number, setID: number, xpDelete: number): void => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [{
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => { deleteSet(userID, exerciseName, exerciseID,  setID, xpDelete)},
      }],
      { cancelable: false }
    );
  };

export const isSuperSet = (restTimes: number[], uniqueExerciseLength: number): boolean => {
    for (let i = 0; i < restTimes.length-1; i++) 
        if (restTimes[i] > 0) 
            return false;
    if (uniqueExerciseLength === 1)
        return false;
    return true;
};

export const calculateNumberOfSets = (sides: string[], uniqueExerciseLength: number, restTimes: number[]): number => {
    let numberOfSet = 0;
    for (const side of sides) {
        if (side === "both")
            numberOfSet++;
        else 
            numberOfSet +=0.5;
    }
    return isSuperSet(restTimes, uniqueExerciseLength) ? numberOfSet/uniqueExerciseLength : numberOfSet;
};

export const isDropsSet =(restTimes: number[], reps: number[], weights: number[], uniqueExerciseLength: number): boolean => {
    for (let i = 0; i < restTimes.length-1; i++) 
        if (restTimes[i] > 0) 
            return false;
    if (!(uniqueExerciseLength === 1 && reps.length > 1 && isDecreasing(weights)))
        return false;
    return true;
};

export const isDecreasing = (array: number[]): boolean => {
    for (let i = 1; i <= array.length; i++)
        if (array[i-1] < array[i] )
            return false;
    return true;
};
export const handleAddButton = (time: number, setTime: Function, reps: number, setReps: Function,
                                 restTime: number, setRestTime: Function, side: string, setSide: Function, 
                                 weight: number, setWeight: Function, currentExercise: ExerciseSelectOption,
                                setCurrentExercise: Function, sets: ExerciseSet, setIsEnabled: Function,
                                selectedExercises:ExerciseSelectOption[]): void => {
    if (currentExercise.isometric && (time === 0 || Number.isNaN(time)))
      throw new Error("time field cannot be empty for isometric exercises");
    if (!currentExercise.isometric && (reps === 0 || Number.isNaN(reps)))
      throw new Error("reps field cannot be empty for non-isometric exercises");
    else {
      sets.exercise.push(currentExercise.value);
      Number.isNaN(reps) ? sets.reps.push(0) : sets.reps.push(reps) ;
      Number.isNaN(restTime) ? sets.restTimes.push(0) : sets.restTimes.push(restTime) ;
      sets.sides.push(side);
      Number.isNaN(time) ? sets.times.push(0) : sets.times.push(time) ;
      Number.isNaN(weight) ? sets.weights.push(0) : sets.weights.push(weight) ;
      selectedExercises.push(currentExercise);
      setReps("");
      setRestTime("");
      setTime("");
      setWeight("");
      setCurrentExercise({
        label: "",
        value: "",
        unilateral: undefined,
        isometric: undefined
      });
      setIsEnabled(false);
      setSide("both");

    }
  }