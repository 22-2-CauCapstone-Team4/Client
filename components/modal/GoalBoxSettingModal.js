import React from 'react';
import {
  Text,
  Modal,
  View,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Snackbar from 'react-native-snackbar';
import {useDispatch, useSelector} from 'react-redux';

import {deleteMission} from '../../store/action';
import Colors from '../../utils/Colors';

export default function GoalBoxSettingModal(props) {
  const dispatch = useDispatch();
  const missionData = useSelector(store => store.missionReducer.missionData);
  // console.log('전체 미션', missionData);
  console.log(props.data);
  return (
    <>
      {props.modalVisible ? (
        <Modal
          animationType="fade"
          transparent={true}
          visible={props.modalVisible}
          onRequestClose={() => {
            props.setModalVisible(!props.modalVisible);
          }}>
          <View style={styles.center}>
            <View style={styles.modalView}>
              <View style={{flexDirection: 'row'}}>
                <Pressable
                  onPress={() => {
                    Alert.alert('삭제', '미션을 삭제하시겠습니까?', [
                      {
                        text: '삭제',
                        onPress: () => {
                          dispatch(
                            deleteMission(
                              missionData.filter(
                                item => item.id !== props.data.id,
                              ),
                            ),
                          );
                        },
                      },
                      {text: '취소'},
                    ]);
                  }}>
                  <Ionicons
                    name="trash"
                    size={30}
                    style={styles.icon}></Ionicons>
                </Pressable>
              </View>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: 'black'}}>카테고리</Text>
                  <Text style={{color: 'black'}}>{props.data.category}</Text>
                </View>
                <Text style={{color: 'black'}}>{props.data.name}</Text>
                <Text style={{color: 'black'}}>{props.data.date}</Text>
                <Text style={{color: 'black'}}>{props.data.space.place}</Text>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalView: {
    width: '70%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    color: Colors.GREY,
  },
});
