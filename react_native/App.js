import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState, Component } from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {Container, Content} from 'native-base';
import Swiper from 'react-native-swiper';

import * as WebBrowser from 'expo-web-browser';

import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';

const ted_url = "http://192.168.43.200:5000/post_image"

cameraRef = React.createRef();

handlePhoto = async () => {
  if(cameraRef){
    let photo = await cameraRef.current.takePictureAsync();
//    handle the photo
    console.log(photo)

    const manipResult = await ImageManipulator.manipulateAsync(
      photo.localUri || photo.uri,
      [],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG, base64: true}
    );

    data = manipResult['base64']
//    console.log("data:")
//    console.log(data)

    console.log("fetching...")
    let response = await fetch(ted_url,
      {
          method:"POST",
          body:data,
      }
    );
    console.log("done")
    console.log(response)
  }
}


export default class App extends React.Component {
  render() {
    return(
      <Container>
        <Content>
          <Swiper
          loop={false}
          showsPagination={false}
          index={1}
          >
            <View style={styles.slideDefault}>
              <Text>Search</Text>
            </View>


            <View style={{ flex: 1 }}>
              <Camera ref={cameraRef} style={{ flex: 1 }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                  }}>
                </View>
                <View style={{ alignItems: 'center', padding:'5%' }}>
                    <TouchableOpacity
                      style={{width:60, height:60, borderRadius:30, backgroundColor:"#fff"}}
                      onPress={handlePhoto}
                      />
                </View>
              </Camera>
            </View>


            <View style={styles.slideDefault}>
              <Text>Map</Text>
            </View>
          </Swiper>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  slideDefault:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#9DD6EB'
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold'
  }
})
