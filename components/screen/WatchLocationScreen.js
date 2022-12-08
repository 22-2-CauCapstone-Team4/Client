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
  Modal,
  Pressable,
  TextInput,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import MapView, {Marker, Circle} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../utils/Colors';
import {getDistance} from '../../functions/space';

async function requestPermissions() {
  if (Platform.OS === 'ios') {
    Geolocation.requestAuthorization();
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
    });
  }

  if (Platform.OS === 'android') {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  }
}

export default function WatchLocationScreen({route, navigation}) {
  // 해당 장소의 정보
  const locationData = route.params.location;
  // 위치 권한 승인
  requestPermissions();
  Geocoder.init('AIzaSyDLuSEtxXzOHHRsmHCKCk_EyJHGncgfa-k', {language: 'ko'});

  const data = useSelector(store => store.placeReducer.data);
  const [coord, setCoord] = useState({
    latitude: locationData.lat,
    longitude: locationData.lng,
    latitudeDelta: 0.092,
    longitudeDelta: 0.0421,
  });
  const [currentLocation, setCurrentLocation] = useState({});

  useEffect(() => {
    const timeOutId = setInterval(() => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          // 현재위치 좌표뽑기
          //console.log(position.coords);
          setCurrentLocation({latitude, longitude});
        },
        error => {
          console.log(error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }, 1000);
    return () => clearInterval(timeOutId);
  }, []);

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
  }, [navigation]);

  function distanceMessage() {
    const distance =
      getDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        locationData.lat,
        locationData.lng,
      ) * 1000;
    if (!currentLocation.latitude) {
      return '현재 위치로부터의 거리를 측정 중입니다.';
    } else {
      return distance > 1000
        ? `현재 위치에서 ${distance / 1000}km 떨어져 있습니다.`
        : `현재 위치에서 ${distance}m 떨어져 있습니다.`;
    }
  }

  return (
    <>
      <SafeAreaView style={{height: '100%', backgroundColor: 'white'}}>
        <View style={styles.distanceInfo}>
          <Text style={styles.distanceText}>{distanceMessage()}</Text>
        </View>
        <View style={styles.map}>
          <MapView
            initialRegion={{
              latitude: coord.latitude,
              longitude: coord.longitude,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            }}
            showsUserLocation={true}
            zoomEnabled={true}
            style={styles.map}
            provider="google">
            {data.map(place => {
              return (
                <View key={place._id}>
                  <Marker
                    draggable={true}
                    title={place.name}
                    description={'범위: ' + `${parseInt(place.range * 1000)}m`}
                    style={{color: 'black'}}
                    coordinate={{
                      latitude: place.lat,
                      longitude: place.lng,
                    }}>
                    <Ionicons
                      name={'location'}
                      size={45}
                      color={Colors.MAIN_COLOR}></Ionicons>
                  </Marker>
                  <Circle
                    center={{latitude: place.lat, longitude: place.lng}}
                    radius={place.range * 1000}
                    fillColor={Colors.MAP_CIRCLE_COLOR}
                    strokeColor={Colors.MAIN_COLOR}></Circle>
                </View>
              );
            })}
          </MapView>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  distanceText: {color: Colors.MAIN_COLOR, fontSize: 18},
  distanceInfo: {height: 150, alignItems: 'center', justifyContent: 'center'},
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    top: 75,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.65,
    position: 'absolute',
  },
  buttonView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 30,
  },
  button: {
    width: 275,
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
  buttonClose: {
    backgroundColor: Colors.MAIN_COLOR_INACTIVE,
  },

  // 모달 버튼 텍스트 스타일
  textStyle: {
    color: Colors.MAIN_COLOR,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButton: {
    borderRadius: 20,
    padding: 15,
    elevation: 2,
    margin: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textInputStyle: {
    borderColor: 'grey',
    borderWidth: 1,
    height: 40,
    marginBottom: 20,
    color: 'black',
  },
});
