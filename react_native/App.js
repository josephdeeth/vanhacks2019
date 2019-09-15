import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState, Component } from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {Container, Content} from 'native-base';
import Swiper from 'react-native-swiper';
import * as gmaps from "https://maps.googleapis.com/maps/api/js?key=AIzaSyBihH7PrH5pN8qNefSev93BReEPg0uPD7c&libraries=places&callback=initMap";

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

<!-- PARDON ME EXCUSE ME COMING THROUGH -->

var map;
var coordinates = {
      lat: 49.2786042,
      lng: -123.0998905,
    };
var infowindow;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: coordinates,
    zoom: 12,
  });

  var request = {
    query: 'Recycling Depot',
    location: coordinates,
    radius: 7500,  // meters
  };

  infowindow = new google.maps.InfoWindow();


  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, function(results, status, pagination){
    // alert(status);
    // If we got results
    if(status === google.maps.places.PlacesServiceStatus.OK){
      for(var i = 0; i < results.length; i++){
        // Mark them
        createMarker(results[i]);
      }

      // And look at the top result
      map.setCenter(results[0].geometry.location);
    }
  })
}

function createMarker(place){
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
  });

  // alert(place.name + " from the marker!");

  google.maps.event.addListener(marker, "click", function(){
    map.setCenter(marker.getPosition());
    infowindow.setContent(place.name);
    infowindow.open(map, marker);
  });
}

<!-- PARDON ME EXCUSE ME I'M SORRY -->

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


            <View style={{ // height: 100,
              margin: 0, padding: 0,}}>
              <script src="map.js"></script>
              <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCkUOdZ5y7hMm0yrcCQoCvLwzdM6M8s5qk&libraries=places&callback=initMap" async defer></script>

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
