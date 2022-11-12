import React, {useRef, useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  BackHandler,
  StyleSheet,
  Dimensions,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

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

  const [place, setPlace] = useState({
    latitude: 37.503637,
    longitude: 126.956025,
    latitudeDelta: 0.092,
    longitudeDelta: 0.0421,
  });

  return (
    <>
      <SafeAreaView style={{marginTop: 10}}>
        <View style={{height: 100}}>
          <GooglePlacesAutocomplete
            GooglePlacesSearchQuery={{rankby: 'distance'}}
            placeholder="장소를 입력하세요"
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed="auto" // true/false/undefined
            fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => {
              console.log('data', data);
              console.log('details', details);
            }}
            requestUrl={{
              useOnPlatform: 'all',
              url: 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api', // or any proxy server that hits https://maps.googleapis.com/maps/api
              headers: {
                Authorization: `an auth token`, // if required for your proxy
              },
            }}
            styles={{textInput: {backgroundColor: 'orange', height: '100%'}}}
          />
        </View>

        <MapView
          initialRegion={{
            latitude: 37.503637,
            longitude: 126.956025,
            latitudeDelta: 0.092,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          zoomEnabled={true}
          style={styles.map}
          provider="google">
          <Marker
            draggable={true}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
          />
        </MapView>
        <View style={{height: 200}}>
          <Text>123</Text>
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
