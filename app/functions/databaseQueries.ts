import { Auth, createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import { NavigationProp } from "@react-navigation/native";



export const signUp =async (name:string, setLoading:React.Dispatch<React.SetStateAction<boolean>>, auth:Auth, email:string, password:string) => {
    setLoading(true);
    try {
        if (name === '')
            throw new Error('Name must be set'); 
        const response = await createUserWithEmailAndPassword(auth, email,password);
        await addDoc(collection(FIRESTORE_DB, 'users'), {userID: response.user.uid, name: name, gender: "", age: 0, weight: 0, height: 0, activityLevel: "", set: false});
        
        alert('Registered successfully!');
    }   catch (error:any) {
        alert('Registration failed: ' + error.message);
    }   finally{
        setLoading(false);
    }
}

export const setUpProfile =async (field:string, value:any, userID:string, navigation:NavigationProp<any, any>, nextPage:string) => {
    try {
        if(field === 'gender')
            if(!(value === 'male' || value === 'female'))
                throw new Error(`Gender must be set to either male or female`);
            
            // If the field is age then calculate it from date of birth
        if (field === 'age'){
            const today = new Date()      
            const age =  today.getFullYear()-value.getFullYear();      
                
            if(typeof(age) !== 'number')
                throw new Error("Age must be a number");

            if (age < 0)
                throw new Error("Dude, how  the fuck are you negative years old");

            if (age === 0)
                throw new Error("Damn bro, you just got born and you wanna train?");
        }

        if (field === 'weight' || field === 'height') {
            if(Number.isNaN(value))
                throw new Error(`${field} must be set`);
            
            if(typeof(value) !== 'number')
                throw new Error(`${field} must be a number`);
            if(value < 0)
                throw new Error(`${field} can't be a negative number`);

        }

        if (field === 'activityLevel'){
            if(!(value === 'beginner' || value === 'intermediate' || value === 'advanced') )
                throw new Error(`Please select one of the options`);

        }

    const usersCollection = collection(FIRESTORE_DB, 'users');
        const q = query(usersCollection, where("userID", '==',userID));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnapshot) => {
            const userDocRef = doc(FIRESTORE_DB, 'users', docSnapshot.id);

            // After the last step set the set field to true
            if (field === 'activityLevel') {
                const newData = { [field]: value,set: true }; 
                await updateDoc(userDocRef, newData);
            } else {
                const newData = { [field]: value}; 
                await updateDoc(userDocRef, newData);
            }
            // Navigate to the next page        
            navigation.navigate(nextPage);
        });  
    }   catch (error:any) {
        alert('Adding data has failed: ' + error.message);
    }
}

export const getExercises =async (userID) => {
    const exercisesCollection = collection(FIRESTORE_DB, 'Exercises');
    const q = query(exercisesCollection, where("availableTo", '==', userID), where("avilableTo", '==', 'all'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnapshot) => {
        console.log(docSnapshot);
        
    })
}

export const addExercise =async (userID:string, date: Date, exercises:(string | Array<string>), sets: Object) => {
    try {
        const docRef = await addDoc(collection(FIRESTORE_DB, "Workouts"),{
            "date": date,
            "userID": userID
        });
        const setsCollectionRef = collection(docRef, "Sets");
        const setsDocRef = await addDoc(setsCollectionRef, {
            "exercises": exercises,
            "sets": sets,
            "typeofset": "straight"
          });
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
    
}
