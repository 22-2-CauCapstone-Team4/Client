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
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import MapView, {Marker} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import SnackBar from 'react-native-snackbar';

import Colors from '../../utils/Colors';
import {addSpace} from '../../store/action';

export default function CreateSpaceScreen({navigation}) {
  Geocoder.init('AIzaSyDLuSEtxXzOHHRsmHCKCk_EyJHGncgfa-k', {language: 'ko'});
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

  const dispatch = useDispatch();
  const data = useSelector(store => store.spaceReducer.data);
  const [coord, setCoord] = useState({
    latitude: 37.503637,
    longitude: 126.956025,
    latitudeDelta: 0.092,
    longitudeDelta: 0.0421,
  });
  const [place, setPlace] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [valid, setVaild] = useState(true);
  const ref = useRef();
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
        <View style={styles.buttonView}>
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
              returnKeyType: 'search',
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
              }}
            />
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
                </View>
                <View style={{alignItems: 'center'}}>
                  <View style={{flexDirection: 'row', marginBottom: 5}}>
                    <Pressable
                      style={[styles.modalButton, styles.buttonClose]}
                      onPress={() => {
                        if (place !== '') {
                          dispatch(
                            addSpace({
                              id: place,
                              name: place,
                              lat: coord.latitude,
                              lng: coord.longitude,
                            }),
                          );
                          SnackBar.show({
                            text: `'${place}' 장소가 새로 추가 됐습니다.`,
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
  buttonClose: {
    backgroundColor: '#2196F3',
  },

  // 모달 버튼 텍스트 스타일
  textStyle: {
    color: 'white',
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
