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
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import SnackBar from 'react-native-snackbar';
import SelectDropdown from 'react-native-select-dropdown';
import Geolocation from 'react-native-geolocation-service';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../utils/Colors';
import {addPlace} from '../../store/action';
import {Place} from '../../schema';
import {createPlaceInRealm} from '../../functions';
import {useAuth} from '../../providers/AuthProvider';
import {mkConfig} from '../../functions/mkConfig';
import Realm from 'realm';
import {getDistance} from '../../functions/space';
import {curr} from '../../functions/time';

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

export default function CreateSpaceScreen({navigation}) {
  // 위치 권한 승인
  requestPermissions();
  Geocoder.init('AIzaSyDLuSEtxXzOHHRsmHCKCk_EyJHGncgfa-k', {language: 'ko'});

  const {user} = useAuth();
  const dispatch = useDispatch();
  const data = useSelector(store => store.placeReducer.data);
  const [coord, setCoord] = useState({
    latitude: 37.503637,
    longitude: 126.956025,
    latitudeDelta: 0.092,
    longitudeDelta: 0.0421,
  });
  const [range, setRange] = useState(0.05); // 범위 50m로 디폴트
  const [place, setPlace] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [valid, setVaild] = useState(true);
  const ref = useRef();
  const [currentLocation, setCurrentLocation] = useState({});

  useEffect(() => {
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

  useEffect(() => {
    ref.current?.setAddressText('Some Text');
  }, []);

  function openModalResetRange() {
    setRange(0.05);
    setModalVisible(!modalVisible);
  }

  return (
    <>
      <SafeAreaView style={{height: '100%', backgroundColor: 'white'}}>
        <View style={styles.buttonView}>
          <Ionicons
            name={'location'}
            color="red"
            size={22}
            style={{marginBottom: 20}}>
            <Text style={{color: 'black'}}>를 이용해 장소를 선택하세요</Text>
          </Ionicons>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.buttonText}>여기로 선택!</Text>
          </TouchableOpacity>
        </View>
        <View style={{height: 150}}>
          <GooglePlacesAutocomplete
            textInputProps={{
              placeholderTextColor: Colors.MAIN_COLOR,
              backgroundColor: Colors.MAIN_COLOR_INACTIVE,
              color: Colors.MAIN_COLOR,
              returnKeyType: 'search',
              borderBottomColor: Colors.MAIN_COLOR_INACTIVE,
            }}
            GooglePlacesSearchQuery={{rankby: 'distance'}}
            placeholder="장소를 검색하세요"
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
                color: 'black',
              },
              description: {
                color: 'black',
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
              }}>
              <Ionicons name={'location'} size={45} color="#ff5555"></Ionicons>
            </Marker>
            <Circle
              center={{latitude: coord.latitude, longitude: coord.longitude}}
              radius={range * 1000}
              fillColor="#ff555544"
              strokeColor="#ff5555"></Circle>
            {data.map(place => {
              return (
                <View key={place._id}>
                  <Marker
                    draggable={true}
                    title={place.name}
                    description={'범위: ' + '50m'}
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
                    radius={50}
                    fillColor={Colors.MAP_CIRCLE_COLOR}
                    strokeColor={Colors.MAIN_COLOR}></Circle>
                </View>
              );
            })}
          </MapView>
        </View>
        {modalVisible ? (
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View>
                  <Text
                    style={{
                      marginBottom: 15,
                      color: 'black',
                      fontWeight: '900',
                    }}>
                    장소 이름을 입력해주세요
                  </Text>
                  <TextInput
                    style={styles.textInputStyle}
                    onChangeText={text => setPlace(text)}
                    onPressIn={() => setPlace('')}>
                    {place}
                  </TextInput>
                  <SelectDropdown
                    defaultButtonText="범위 선택"
                    buttonStyle={{
                      borderRadius: 25,
                      height: 40,
                      width: '100%',
                      backgroundColor: Colors.MAIN_COLOR,
                    }}
                    buttonTextStyle={{color: 'white'}}
                    data={['25m', '50m', '100m', '250m']}
                    onSelect={value => {
                      //km 단위로 범위 저장
                      setRange(parseInt(value.split('m')[0]) / 1000);
                    }}
                  />
                </View>
                <View style={{alignItems: 'center'}}>
                  <View style={{flexDirection: 'row', marginBottom: 5}}>
                    <Pressable
                      style={[styles.modalButton, styles.buttonClose]}
                      onPress={async () => {
                        if (place !== '') {
                          console.log(coord);
                          const newPlace = new Place({
                            name: place,
                            owner_id: user.id,
                            lat: coord.latitude,
                            lng: coord.longitude,
                            // 범위 추가
                            range: range,
                          });
                          Realm.open(mkConfig(user, [Place.schema])).then(
                            async realm => {
                              await createPlaceInRealm(user, realm, newPlace);
                              realm.close();
                            },
                          );
                          dispatch(addPlace(newPlace));

                          SnackBar.show({
                            text: `'${place}' 장소가 추가되었습니다.`,
                            duration: SnackBar.LENGTH_SHORT,
                          });
                          setPlace('');
                          setVaild(true);

                          // console.log(data);
                        } else setVaild(false);
                      }}
                      onSubmitEditing={() => setPlace('')}>
                      <Text style={styles.textStyle}>저장</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.modalButton, styles.buttonClose]}
                      onPress={() => {
                        setModalVisible(!modalVisible);
                        setPlace('');
                      }}>
                      <Text style={styles.textStyle}>취소</Text>
                    </Pressable>
                  </View>
                  {valid ? null : (
                    <Text style={{color: 'red', fontSize: 12}}>
                      이름을 입력해주세요!
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </Modal>
        ) : null}
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
