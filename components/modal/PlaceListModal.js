import React from 'react';
import {
  Text,
  Modal,
  View,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {styles} from '../../utils/styles';
import {useAuth} from '../../providers/AuthProvider';
import {deletePlace} from '../../store/action/index';
import {deletePlaceInRealm} from '../../functions';

export default function PlaceListModal({
  navigation,
  modalVisible,
  setModalVisible,
}) {
  const {user} = useAuth();
  const dispatch = useDispatch();
  const place = useSelector(store => store.placeReducer.data);
  const placesNumber = place.length;
  // console.log(place);
  return (
    <>
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
              <View style={style.scrollView}>
                <Text style={style.placeText}>장소 목록</Text>
                {placesNumber === 0 ? (
                  <Text style={{color: 'red', fontSize: 12}}>
                    장소를 등록하세요!
                  </Text>
                ) : null}
                <View style={{height: 150, marginBottom: 20}}>
                  <ScrollView contentContainerStyle={{alignItems: 'center'}}>
                    {place.map(item => (
                      <TouchableOpacity
                        key={item._id}
                        style={style.place}
                        onLongPress={async () => {
                          await deletePlaceInRealm(user, item);
                          dispatch(
                            deletePlace(
                              place.filter(el => el.name !== item.name),
                            ),
                          );
                          // console.log('place');
                          // console.log(place);
                        }}>
                        <Text style={{color: 'white'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    navigation.navigate('CreateSpace');
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={styles.textStyle}>추가</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>닫기</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
}

const style = StyleSheet.create({
  placeText: {
    color: 'black',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  place: {
    width: 150,
    height: 30,
    backgroundColor: '#0891b2',
    borderRadius: 600,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  scrollView: {
    alignItems: 'center',
    width: 180,
    borderRadius: 20,
    borderColor: 'grey',
    borderWidth: 0.5,
    padding: 10,
    marginBottom: 5,
  },
});
