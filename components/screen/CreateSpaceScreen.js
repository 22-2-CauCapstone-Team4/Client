import React, {useRef, useEffect, useState} from 'react';
import Geocoder from 'react-native-geocoding';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  StyleSheet,
  Dimensions,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import Colors from '../../utils/Colors';

export default function CreateSpaceScreen({navigation}) {
  //뒤로가기 -> 페이지 뒤로
  useEffect(() => {
    const backAction = () => {
      if (navigation?.canGoBack()) {
        navigation.goBack();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const ref = useRef();

  useEffect(() => {
    ref.current?.setAddressText('Some Text');
  }, []);

  const [coord, setCoord] = useState({
    latitude: 37.503637,
    longitude: 126.956025,
    latitudeDelta: 0.092,
    longitudeDelta: 0.0421,
  });
  const [place, setPlace] = useState('');
  const [visibleButton, setVisibleButton] = useState(true);
  // Geocoder.init('AIzaSyDLuSEtxXzOHHRsmHCKCk_EyJHGncgfa-k', {language: 'ko'});
  // function getCoordinate() {
  //   return Geocoder.from('New York, 뉴욕 미국')
  //     .then(json => {
  //       var location = json.results[0].geometry.location;
  //       console.log('location is///');
  //       console.log([location.lat, location.lng]);
  //       return [location.lat, location.lng];
  //     })
  //     .catch(error => console.warn(error));
  // }

  // fetch(
  //   'https://maps.googleapis.com/maps/api/geocode/json?address=' +
  //     coord.latitude +
  //     ',' +
  //     coord.longitude +
  //     '&key=' +
  //     'AIzaSyDLuSEtxXzOHHRsmHCKCk_EyJHGncgfa-k' +
  //     '&language=ko',
  // )
  //   .then(response => response.json())
  //   .then(responseJson => {
  //     console.log('주소 정보');
  //     console.log('udonPeople ' + responseJson.results[0].formatted_address);
  //   })
  //   .catch(err => console.log('udonPeople error : ' + err));
  return (
    <>
      <SafeAreaView style={{height: '100%', backgroundColor: 'white'}}>
        <View style={{height: 150}}>
          <GooglePlacesAutocomplete
            GooglePlacesSearchQuery={{rankby: 'distance'}}
            placeholder="장소를 입력하세요"
            autoFocus={false}
            listViewDisplayed="auto"
            fetchDetails={true}
            // renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => {
              this.map.animateToRegion({
                ...coord,
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.003,
                longitudeDelta: 0.003,
              });
              console.log(data.description);
              console.log(details.geometry.location);
              setCoord({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              });
            }}
            query={{
              key: 'AIzaSyDLuSEtxXzOHHRsmHCKCk_EyJHGncgfa-k',
              language: 'ko',
            }}
            styles={{
              textInput: {
                borderBottomColor: 'grey',
                borderBottomWidth: 1,
                top: 0,
              },
            }}
          />
        </View>
        <View style={styles.map}>
          <MapView
            initialRegion={{
              latitude: coord.latitude,
              longitude: coord.longitude,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            }}
            ref={ref => (this.map = ref)}
            onRegionChangeComplete={region => {
              console.log(coord);
              setCoord(region);
            }}
            showsUserLocation={true}
            zoomEnabled={true}
            style={styles.map}
            provider="google">
            <Marker
              draggable={true}
              coordinate={{
                latitude: coord.latitude,
                longitude: coord.longitude,
              }}
            />
          </MapView>
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>여기로 선택!</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    top: 75,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.6,
    position: 'absolute',
  },
  buttonView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 40,
  },
  button: {
    width: 250,
    height: 40,
    backgroundColor: Colors.MAIN_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'bold',
  },
});
