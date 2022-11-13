import React, {useState, useCallback} from 'react';
import {
  Text,
  Modal,
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Button,
  Switch,
} from 'react-native';
import {styles} from '../../utils/styles';
import {useNavigation} from '@react-navigation/native';
import Categories from '../Categories';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StyleSheet} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
export default function CreateMissionModal({
  navigation,
  modalVisible,
  setModalVisible,
}) {
  // 시간, 공간 잠금
  const [lockingType, setLockingType] = useState(false);
  const lockTime = () => {
    if (lockingType === true) setLockingType(!lockingType);
  };
  const lockSpace = () => {
    if (lockingType === false) setLockingType(!lockingType);
  };
  // 공간 이동, 공간 안
  const [moveSpace, setMoveSpace] = useState(false); // 공간 이동 state
  const [spaceIn, setSpaceIn] = useState(false); // 공간 안 state
  const toggleMoveSpace = () => setMoveSpace(!moveSpace);
  const toggleSpaceIn = () => setSpaceIn(!spaceIn);

  // 요일 선택
  // const dayData = [
  //   {id: 0, title: '일'},
  //   {id: 1, title: '월'},
  //   {id: 2, title: '화'},
  //   {id: 3, title: '수'},
  //   {id: 4, title: '목'},
  //   {id: 5, title: '금'},
  //   {id: 6, title: '토'},
  // ];

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
              {/* 내용 시작 */}
              <ScrollView>
                <Categories />
                <TextInput
                  placeholder="미션 이름 입력"
                  style={missionStyle.missionInput}
                />
                <View style={missionStyle.inputRow}>
                  {/* 입력값 받아서 적용하기 */}
                  <Text style={missionStyle.selectCalendar}>11월 13일</Text>
                  <TouchableOpacity>
                    <Ionicons name="calendar-outline" size={30}></Ionicons>
                  </TouchableOpacity>
                </View>

                <View style={missionStyle.week}>
                  <TouchableOpacity>
                    <Text style={missionStyle.weekText} value="일">
                      일
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={missionStyle.weekText} value="월">
                      월
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={missionStyle.weekText} value="화">
                      화
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={missionStyle.weekText} value="수">
                      수
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={missionStyle.weekText} value="목">
                      목
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={missionStyle.weekText} value="금">
                      금
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={missionStyle.weekText} value="토">
                      토
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={missionStyle.btnStyle}>
                  <TouchableOpacity onPress={lockTime}>
                    <Text
                      style={[
                        missionStyle.lockBtn,
                        {backgroundColor: lockingType ? '#5cd4f3' : '#4285f4'},
                      ]}>
                      시간잠금
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={lockSpace}>
                    <Text
                      style={[
                        missionStyle.lockBtn,
                        {backgroundColor: lockingType ? '#4285f4' : '#5cd4f3'},
                      ]}>
                      공간잠금
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* 시간 or 공간 잠금 컴포넌트 보여주는 곳 */}
                {lockingType ? (
                  <View>
                    {/* 알아볼 수 있게 임시로 넣어놓은 것 */}
                    <Text style={{fontSize: 20}}>공간 잠금</Text>
                    <View>
                      <TouchableOpacity style={missionStyle.selectSpace}>
                        <Text style={missionStyle.selectSpaceText}>
                          공간을 선택해주세요
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={missionStyle.toggleBtn}>
                      <Text style={missionStyle.spaceText}>공간 이동</Text>
                      <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        onValueChange={toggleMoveSpace}
                        value={moveSpace}
                      />
                    </View>
                    <View style={missionStyle.toggleBtn}>
                      <Text style={missionStyle.spaceText}>공간 안</Text>
                      <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        onValueChange={toggleSpaceIn}
                        value={spaceIn}
                      />
                    </View>
                  </View>
                ) : (
                  <View>
                    {/* Text 시간 잠금은 알아볼 수 있게 임시로 넣어놓은 것 */}
                    <Text style={{fontSize: 20}}>시간 잠금</Text>

                    {/* n에는 시작, 종료시간 계산하여 변수 대입 */}
                    <Text style={{marginTop: 10}}>
                      n 시간 잠기게 될 예정입니다.
                    </Text>
                  </View>
                )}
              </ScrollView>
              <View style={{flexDirection: 'row'}}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    navigation.navigate('CreateMission');
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={styles.textStyle}>확인</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>취소</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
}
const missionStyle = StyleSheet.create({
  // CreateMissionModal.js에서 input
  missionInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
  },
  inputRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  btnStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  lockBtn: {
    color: 'white',
    borderRadius: 100,
    padding: 10,
    margin: 10,
  },
  week: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
  weekText: {
    color: 'black',
    fontSize: 20,
  },
  center: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
    flexDirection: 'row',
  },
  separator: {
    width: 3,
  },
  toggleBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 20,
  },
  spaceText: {
    color: 'black',
    fontSize: 20,
  },
  selectSpaceText: {
    fontSize: 20,
    textAlign: 'center',
  },
  selectSpace: {
    justifyContent: 'center',
    backgroundColor: '',
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
  },
  selectCalendar: {
    fontSize: 20,
    color: 'black',
  },
});
