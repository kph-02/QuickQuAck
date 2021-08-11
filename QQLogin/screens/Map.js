import React, { Component } from 'react';
import { StyleSheet, View, Platform, Text, Image, Button, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Heatmap, PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { MapContainer, TopMapContainer } from './../components/styles';
import * as Location from 'expo-location';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

class Maps extends Component {
  //State
  state = {
    location: {
      latitude: 32.880213553722704,
      longitude: -117.23399204377725,
    },
    geocode: null,
    errorMessage: '',
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

  //Requesting permissions to access location.Then if the permission status is granted it will continue to get the location data, else it will state the Permission to access location was denied error message.

  // Next, the function will use expo-location getCurrentPositionAsync function to get the location data.

  getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
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
  componentDidMount() {
    this.getLocationAsync();
    console.log(this.state.location);
    // console.log(this.state.geocode);
  }

  render() {
    const {navigation} = this.props;
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
          <Marker coordinate={{ latitude: 32.88232190507297, longitude: -117.23403495912069 }}>
            <Callout>
              <Text>bro what </Text>
            </Callout>
          </Marker>
          <Marker draggable coordinate={{ latitude: 32.88122376973488, longitude: -117.23757610041588 }}>
            <Callout>
              <Text>Woweee</Text>
            </Callout>
          </Marker>
        </MapView>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.pop()}
          style={styles.touchableStyle}
        >
          <Image source={require('./../assets/backb.png')} style={styles.floatingButtonStyle} />
        </TouchableOpacity>
      </View>
    );
  }
}

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
