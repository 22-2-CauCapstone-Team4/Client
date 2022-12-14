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
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import Colors from '../../utils/Colors';
import {styles} from '../../utils/styles';
import {useAuth} from '../../providers/AuthProvider';
import {
  deletePlace,
  deleteMission,
  deleteTodayMission,
} from '../../store/action/index';
import {deletePlaceInRealm} from '../../functions';
import {mkConfig} from '../../functions/mkConfig';
import {Place, Mission, Goal, TodayMission} from '../../schema';
import Realm from 'realm';

export default function PlaceListModal({
  navigation,
  modalVisible,
  setModalVisible,
}) {
  const {user} = useAuth();
  const dispatch = useDispatch();
  const place = useSelector(store => store.placeReducer.data);
  const mission = useSelector(store => store.missionReducer.missionData);
  const todayMission = useSelector(
    store => store.todayMissionReducer.todayMissionData,
  );
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
            <View style={style.modalView}>
              <View style={style.scrollView}>
                <Text style={style.placeText}>장소 목록</Text>
                <View style={style.lineStyle}></View>
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
                        onPress={() => {
                          navigation.navigate('WatchLocation', {
                            location: item,
                          });
                          setModalVisible(!modalVisible);
                        }}
                        onLongPress={async () => {
                          Alert.alert(
                            '장소 삭제',
                            `장소 "${item.name}" 을/를 삭제하시겠습니까?\n연관된 미션 또한 함께 삭제됩니다. `,
                            [
                              {
                                text: '삭제',
                                onPress: () => {
                                  Realm.open(
                                    mkConfig(user, [
                                      Place.schema,
                                      Mission.schema,
                                      TodayMission.schema,
                                      Goal.schema,
                                    ]),
                                  ).then(async realm => {
                                    await deletePlaceInRealm(user, realm, item);
                                    realm.close();
                                  });

                                  dispatch(
                                    deletePlace(
                                      place.filter(el => el.name !== item.name),
                                    ),
                                  );
                                  //미션 삭제
                                  dispatch(
                                    deleteMission(
                                      mission.filter(
                                        el => el.space !== item.name,
                                      ),
                                    ),
                                  );
                                  // 오늘의 미션 삭제
                                  dispatch(
                                    deleteTodayMission(
                                      todayMission.filter(
                                        el => el.space !== item.name,
                                      ),
                                    ),
                                  );
                                },
                              },
                              {text: '취소'},
                            ],
                          );
                        }}>
                        <Text style={{color: 'white'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <View style={{flexDirection: 'row', marginTop: 15}}>
                <Pressable
                  style={[style.button, styles.buttonClose]}
                  onPress={() => {
                    navigation.navigate('CreateSpace');
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={styles.textStyle}>추가</Text>
                </Pressable>
                <Pressable
                  style={[style.button, styles.buttonClose]}
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
  button: {
    borderRadius: 20,
    padding: 15,
    elevation: 2,
    margin: 5,
  },
  lineStyle: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: Colors.MAIN_COLOR,
    margin: 10,
  },
  placeText: {
    color: 'black',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
  },
  place: {
    width: 250,
    height: 40,
    backgroundColor: '#0891b2',
    borderRadius: 600,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  scrollView: {
    alignItems: 'center',
    width: '100%',
    borderRadius: 20,
    borderColor: 'grey',
    borderWidth: 0.5,
    padding: 10,
    marginBottom: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: '90%',
    height: '50%',
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
});
