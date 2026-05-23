import React, {useState} from 'react';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import {launchCamera} from 'react-native-image-picker';

function CameraPOC() {
  const [photoUri, setPhotoUri] = useState(null);

  async function openCamera() {
    const result = await launchCamera({
      mediaType: 'photo',
      saveToPhotos: true,
    });

    if (result.assets && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
      console.log('Photo captured:', result.assets[0].uri);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WaWa Camera POC</Text>
      <Button title="Open Camera" onPress={openCamera} />

      {photoUri && (
        <>
          <Text style={styles.text}>Photo captured!</Text>
          <Image source={{uri: photoUri}} style={styles.image} />
        </>
      )}
    </View>
  );
}

export default CameraPOC;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
  },
  image: {
    marginTop: 20,
    width: 200,
    height: 250,
  },
});