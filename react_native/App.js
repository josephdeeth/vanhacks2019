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




cameraRef = React.createRef();

handlePhoto = async () => {
  if(cameraRef){
    let photo = await cameraRef.current.takePictureAsync();
    console.log(photo);
  }
}


export default class App extends React.Component {
  render() {
    return(
      <Container>
        <Content>
          <Swiper
          loop={false}
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
                  <TouchableOpacity
                    style={{
                      flex: 0.1,
                      alignSelf: 'flex-end',
                      alignItems: 'center',
                      bottom: 5,
                    }}
                    onPress={() => {
                      this.setState({
                        type:
                          this.state.type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back,
                      });
                    }}>
                  </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                      style={{width:60, height:60, borderRadius:30, backgroundColor:"#fff"}}
                      onPress={this.handlePhoto} />
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
