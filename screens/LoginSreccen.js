import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { auth } from '../firebase';

//LoginScreen
function LoginSreccen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      console.log(authUser);
      if (authUser) {
        //if you logout this will replace the homescreen
        navigation.replace('Home');
      }
    });

    //clen up fution from Fb
    return () => unsubscribe;
  }, [navigation]);
  //This method sings you in with auth Firesbase
  const signIn = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error));
  };
  <Input placeholder="Email" autoFocus type="Email" />;
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={{
          uri:
            'http://4.bp.blogspot.com/-4MXlsqEI8gA/T3sm7FHj5PI/AAAAAAAAAqg/LIGEGmIRX_4/s1600/thumbbig-32154.jpg',
        }}
        style={{ width: 200, height: 200 }}
      />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          autoFocus
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          autoFocus
          value={password}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={signIn}
        />
      </View>
      <Button containerStyle={styles.button} onPress={signIn} title="Login" />

      {/* This funtion navigates to next screen */}
      <Button
        onPress={() => navigation.navigate('Register')}
        containerStyle={styles.button}
        type="outline"
        title="Register"
      />
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
}

export default LoginSreccen;

const styles = StyleSheet.create({
  inputContainer: { width: 300 },
  button: { width: 200, marginTop: 10 },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'blue',
  },
});
