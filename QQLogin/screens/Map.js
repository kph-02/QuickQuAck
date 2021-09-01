import React, { Component } from 'react';
import { StyleSheet, View, Platform, Text, Image, Button, StatusBar, Dimensions, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import MapView, { Heatmap, PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { MapContainer, TopMapContainer } from './../components/styles';
import * as Location from 'expo-location';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { serverIp } from './Login.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomMarker from '../assets/CustomMarker';
var JWTtoken = '';

class Maps extends Component {
  getJWT = async () => {
    try {
      await AsyncStorage.getItem('token').then((token) => {
        //console.log('Retrieved Token: ' + token);
        JWTtoken = token;
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  //State
  state = {
    location: {
      latitude: 32.880213553722704,
      longitude: -117.23399204377725,
    },
    geocode: null,
    errorMessage: '',
    markerData: [],
    post: '',
  };

  //Custom style for the map. Derived from google maps style.
  mapStyle = [
    {
      featureType: 'poi.business',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
  ];

  //Get Marker Information From Database
  getFromDB = async () => {
    try {
      let markers;
      const response = await fetch('http://' + serverIp + '/feed/marker-info', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: JWTtoken },
      });

      const parseRes = await response.json();
      console.log('markerData');

      console.log(parseRes);
      // markers = parseRes.data.markers;
      // console.log(markers);

      // const { markerData } = this.state;
      this.setState({...this.state, post: parseRes})
      this.setState({ ...this.state, markerData: parseRes.data.markers });

      // console.log(this.state.markerData);
      // console.log(this.state.post);
      // console.log(parseRes.data.markers);
    } catch (err) {
      console.log(err.message);
    }
    // const { markerData } = this.state;

    // this.setState({ ...this.state, markerData: this.state.parseRes });
    // console.log('markerData');

    // console.log(markerData);
  };

  getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
      return;
    }

    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    const { latitude, longitude } = location.coords;
    this.getGeocodeAsync({ latitude, longitude });
    this.setState({ location: { latitude, longitude } });
  };

  //Extracts the geocode geolocation data from latitude and longitude coordinates.
  getGeocodeAsync = async (location) => {
    let geocode = await Location.reverseGeocodeAsync(location);
    this.setState({ geocode });
  };

  //Requesting permissions to access location as soon as map is opened
  async componentDidMount() {
    this.getJWT();
    await this.getLocationAsync();
    await this.getFromDB();
  }

  
  render() {
    const { navigation } = this.props;
    const markerKhosla = require('./../assets/coleslaw.jpg');
    const boop = (marker) => {
      Alert.alert('', "Would you like to go to this post?", [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => navigation.navigate('Post View', { post: marker }) },
      ]);
      
    }
    return (
      <View>
        <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />
        <MapView
        
          mapType="standard"
          customMapStyle={this.mapStyle}
          loadingEnabled={true}
          scrollEnabled={true}
          showsUserLocation={true}
          provider={null}
          ref={(map) => (this._map = map)}
          style={styles.map}
          region={{
            latitude: this.state.location.latitude,
            longitude: this.state.location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {this.state.markerData.map((marker) => (
            <Marker
              onPress={() => boop(marker)}
              pinColor="#FFCC15"
              key={marker.post_id}
              coordinate={{
                latitude: parseFloat(marker.latitude),
                longitude: parseFloat(marker.longitude),
              }}
            >
              {/* <Image source={require('./../assets/Marker.png')} /> */}
              <CustomMarker text={marker.post_text.length <= 20 ? `${marker.post_text}` : `${marker.post_text.substring(0, 20)}...`} />

              {/* <Callout
              tooltip>
                <Text>
                  {marker.post_text.length <= 20 ? `${marker.post_text}` : `${marker.post_text.substring(0, 20)}...`}
                </Text>
              </Callout> */}
            </Marker>
          ))}
          {/* <Marker pinColor="#FFCC15" coordinate={{ latitude: 32.88232190507297, longitude: -117.23403495912069 }}>
            <Callout>
              <Text>Why can't I step on the seal?</Text>
            </Callout>
          </Marker>
          <Marker
            pinColor="#FFCC15"
            draggable
            coordinate={{ latitude: 32.88122376973488, longitude: -117.23757610041588 }}
          >
            <Callout>
              <Text>what if we... studied together... on geisel 8th floor.. aha ha.. just kidding.. unless..?</Text>
            </Callout>
          </Marker>
          <Marker
            pinColor="#FFCC15"
            draggable
            coordinate={{ latitude: 32.87971535134385, longitude: -117.23555259895977 }}
          >
            <Callout>
              <Text>Not gonna lie, Tapex has the best food on campus.</Text>
            </Callout>
          </Marker> */}
        </MapView>
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.pop()} style={styles.touchableStyle}>
          <Image source={require('./../assets/backbo.png')} style={styles.floatingButtonStyle} />
        </TouchableOpacity>
      </View>
    );
  }
}
// navigation.navigate('Post View', { post: this.state.post })

export default function Map(props) {
  const navigation = useNavigation();
  return <Maps {...props} navigation={navigation} />;
}

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    height: '100%',
    zIndex: -1,
    elevation: -1,
  },

  duck: {
    width: 100,
    top: 10,
  },

  touchableStyle: {
    position: 'absolute',
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    left: 20,
    top: 50,
    zIndex: 1,
    elevation: 1,
  },
  floatingButtonStyle: {
    resizeMode: 'cover',
    width: width * 0.18,
    height: width * 0.18,
    zIndex: 1,
  },
});
