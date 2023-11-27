import { View, StyleSheet, TextInput, ActivityIndicator, Pressable, Text, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { Auth, signInWithEmailAndPassword } from 'firebase/auth';
import { RouterProps } from '../types and interfaces/interfaces';
import { backgroundImage, globalStyles } from '../assets/styles';



const Login = ({navigation}: RouterProps) => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loading, setLoading] = useState(false);
  const auth: Auth = FIREBASE_AUTH;

  async function signIn(setLoading: Function, email: string | undefined, password: string | undefined, auth: Auth): Promise<void> {
    setLoading(true);
    try {
      if (typeof email === "string" && typeof password === "string") {
        await signInWithEmailAndPassword(auth, email, password);
      }
      else if (email === undefined && password === undefined)
        alert("Error: Sign in failed: Please fill all the fields")
      else if (email === undefined)
        alert("Error: Sign in failed: Email raddress is required")
    } 
    catch (error:any) {
      alert(`Error: Sign in failed: ${error.message}`);
    }
    finally {
      setLoading(false);
    } 
  }


  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={[globalStyles.container, {flex: 1}]}>
        <View style={{ backgroundColor: "rgba(255,0,0,0.7)", marginBottom: 20, paddingVertical: 20 }}>
          <Text  style={[globalStyles.logo]}>Gym Gamer</Text>
        </View>
        <TextInput
          value={email}
          style={globalStyles.input}
          placeholder='Email'
          autoCapitalize='none'
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          value={password}
          secureTextEntry={true}
          style={globalStyles.input}
          placeholder='Password'
          autoCapitalize='none'
          onChangeText={(text) => setPassword(text)}
        />
        { loading ?
          <ActivityIndicator size="large" color="#0000ff"/>
        :
          <>
            <Pressable style={globalStyles.button} onPress={() => signIn(setLoading, email, password, auth)}>
              <Text  style={globalStyles.buttonText}>Login</Text>
            </Pressable>
            <Text style={[globalStyles.text, {marginTop: 30, fontSize: 18, textTransform: "uppercase"}]}>Not registered yet</Text>
            <Pressable style={globalStyles.button} onPress={() => navigation.navigate('Register')}>
              <Text style={globalStyles.buttonText}>Create new account here</Text>
            </Pressable>
            <Text style={styles.copyright}>Copyright 2023 Botond Burgmann</Text>
          </>
        }
      </View>
    </ImageBackground>
  );
};

export default Login

const styles = StyleSheet.create({
  text:{
    alignSelf: 'center',
    fontSize: 18,
    color: "#fff",
    textTransform: 'uppercase',
    paddingVertical: 10,
  },
 
  copyright: {
    alignSelf: 'center',
    color: "#fff",
  }
});