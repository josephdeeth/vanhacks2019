import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState, Component } from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import {Header, Button} from 'react-native-elements';
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
  state = { term: ''};
  render() {
    const{
      containerStyle,
      searchTextStyle,
      buttonStyle
    } = styles2;
    return(
      <Container>
        <Content>
          <Swiper
          loop={false}
          showsPagination={false}
          index={1}
          >
            <View style={{ flex:1 , backgroundColor: '#ddd'}}>
              <Header
                centerComponent={{ text: 'Test Text', style: {color: 'white'}}}
                outerContainerStyles={{ backgroundColor: '#E62117'}}
              />
              <View style={containerStyle}>
                <TextInput
                    style={searchTextStyle}
                    onChangeText={term => this.setState({term})}
                    value={this.state.term}
                  />
                  <Button
                    title="Search"
                    onPress={() => console.log(this.state.term)}
                  />
              </View>
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
            <WebView
              originWhitelist={['*']}
              source = {{html: '<!DOCTYPE html>\n' +
                    '<html lang="en">\n' +
                    '<head>\n' +
                    '    <meta charset="UTF-8">\n' +
                    '    <title>Title</title>\n' +
                    '    <meta name="viewport" content="initial-scale=1.0">\n' +
                    '    <meta charset="utf-8">\n' +
                    '    <link rel="stylesheet" type="text/css" href="map.css"/>\n' +
                    '    <script>' +
                    'var map;\n' +
                    'var coordinates = {\n' +
                    '      lat: 49.2786042,\n' +
                    '      lng: -123.0998905,\n' +
                    '    };\n' +
                    'var infowindow;\n' +
                    '\n' +
                    'function initMap() {\n' +
                    '  map = new google.maps.Map(document.getElementById(\'map\'), {\n' +
                    '    center: coordinates,\n' +
                    '    zoom: 12,\n' +
                    '  });\n' +
                    '\n' +
                    '  var request = {\n' +
                    '    query: \'Recycling Depot\',\n' +
                    '    location: coordinates,\n' +
                    '    radius: 7500,  // meters\n' +
                    '  };\n' +
                    '\n' +
                    '  infowindow = new google.maps.InfoWindow();\n' +
                    '\n' +
                    '\n' +
                    '  service = new google.maps.places.PlacesService(map);\n' +
                    '  service.textSearch(request, function(results, status, pagination){\n' +
                    '    // alert(status);\n' +
                    '    // If we got results\n' +
                    '    if(status === google.maps.places.PlacesServiceStatus.OK){\n' +
                    '      for(var i = 0; i < results.length; i++){\n' +
                    '        // Mark them\n' +
                    '        createMarker(results[i]);\n' +
                    '      }\n' +
                    '\n' +
                    '      // And look at the top result\n' +
                    '      map.setCenter(results[0].geometry.location);\n' +
                    '    }\n' +
                    '  })\n' +
                    '}\n' +
                    '\n' +
                    'function createMarker(place){\n' +
                    '  var marker = new google.maps.Marker({\n' +
                    '    map: map,\n' +
                    '    position: place.geometry.location,\n' +
                    '  });\n' +
                    '\n' +
                    '  // alert(place.name + " from the marker!");\n' +
                    '\n' +
                    '  google.maps.event.addListener(marker, "click", function(){\n' +
                    '    map.setCenter(marker.getPosition());\n' +
                    '    infowindow.setContent(place.name);\n' +
                    '    infowindow.open(map, marker);\n' +
                    '  });\n' +
                    '}</script>\n' +
                    '</head>\n' +
                    '<body>\n' +
                    '<div id="map"></div>\n' +
                    '<!-- Init map and hook it onto the map element above. -->\n' +
                    '\n' +
                    '<!-- Asynchronously make call to gmaps api -->\n' +
                    '<!--script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCkUOdZ5y7hMm0yrcCQoCvLwzdM6M8s5qk&libraries=places&callback=initMap" async defer></script-->\n' +
                    '<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBihH7PrH5pN8qNefSev93BReEPg0uPD7c&libraries=places&callback=initMap" async defer></script>\n' +
                    '</body>\n' +
                    '</html>'}}>


            </WebView>


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

const styles2 = {
  containerStyle: {
    flexDirection: 'row',
    marginTop: 75,
    marginLeft: 10,
    marginRight: 10
  },
  searchTextStyle: {
    flex: 1
  },
  buttonStyle:{
    height: 30,
    marginBottom: 8
  }
}
