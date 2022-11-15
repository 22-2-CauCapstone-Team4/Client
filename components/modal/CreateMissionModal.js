import React, {useState, useCallback, Component} from 'react';
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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import SelectDropdown from 'react-native-select-dropdown';

export default function CreateMissionModal({
  navigation,
  modalVisible,
  setModalVisible,
}) {
  // 카테고리

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

  // --------------------------- ★ 요일, 시간 선택 작업중 --------------------------
  // ------------------------ 시작 시간 -------------------------
  const [date, onChangeDate] = useState(new Date()); // 선택 날짜
  const [mode, setMode] = useState('date'); // 모달 유형
  const [visible, setVisible] = useState(false); // 모달 노출 여부

  const onPressDate = () => {
    // 날짜 클릭 시
    setMode('date'); // 모달 유형을 date로 변경
    setVisible(true); // 모달 open
  };

  const onPressStartTime = () => {
    // 시간 클릭 시
    setMode('time'); // 모달 유형을 time으로 변경
    setVisible(true); // 모달 open
  };

  const onConfirm = selectedDate => {
    // 날짜 또는 시간 선택 시
    setVisible(false); // 모달 close
    onChangeDate(selectedDate); // 선택한 날짜 변경
    console.log(`start time : ${selectedDate}`);
  };

  const onCancel = () => {
    // 취소 시
    setVisible(false); // 모달 close
  };
  // ------------------------ 종료 시간 ------------------------
  const [date2, onChangeDate2] = useState(new Date()); // 선택 날짜
  const [mode2, setMode2] = useState('date'); // 모달 유형
  const [visible2, setVisible2] = useState(false); // 모달 노출 여부

  const onPressDate2 = () => {
    // 날짜 클릭 시
    setMode2('date'); // 모달 유형을 date로 변경
    setVisible2(true); // 모달 open
  };

  const onPressStartTime2 = () => {
    // 시간 클릭 시
    setMode2('time'); // 모달 유형을 time으로 변경
    setVisible2(true); // 모달 open
  };

  const onConfirm2 = selectedDate => {
    // 날짜 또는 시간 선택 시
    setVisible2(false); // 모달 close
    onChangeDate2(selectedDate); // 선택한 날짜 변경
    console.log(`end time : ${selectedDate}`);
  };

  const onCancel2 = () => {
    // 취소 시
    setVisible2(false); // 모달 close
  };

  // 시간 계산
  const diff = date2 - date;

  const diffDay = Math.floor(diff / (1000 * 60 * 60 * 24));
  const diffHour = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const diffMin = Math.floor((diff / (1000 * 60)) % 60);
  const categories = ['운동', '공부', '도서관']; // ★ 카테고리 내용 추가
  const space = ['중앙대', '집', 'pc방']; // ★ 공간 내용 추가
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
                <View style={{alignItems: 'center'}}>
                  <SelectDropdown
                    buttonStyle={{borderRadius: 100}}
                    defaultButtonText="카테고리"
                    data={categories}
                    onSelect={(selectedItem, index) => {
                      console.log(selectedItem, index);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item;
                    }}
                  />
                </View>
                <View style={missionStyle.inputRow}>
                  <Text style={missionStyle.selectCalendar}>
                    {date.getMonth()}월 {date.getDate()}일
                  </Text>
                  <TouchableOpacity onPress={onPressDate}>
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
                      <View style={{alignItems: 'center'}}>
                        <SelectDropdown
                          buttonStyle={{borderRadius: 100}}
                          defaultButtonText="공간선택"
                          data={space}
                          onSelect={(selectedItem, index) => {
                            console.log(selectedItem, index);
                          }}
                          buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem;
                          }}
                          rowTextForSelection={(item, index) => {
                            return item;
                          }}
                        />
                      </View>
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
                    {/* 시작 시간 */}
                    <View style={{marginTop: 10}}>
                      <View>
                        <TouchableOpacity
                          onPress={onPressStartTime}
                          style={missionStyle.time}>
                          {/* 시간 선택 영역 */}
                          <Text style={missionStyle.timeText}>시작 시간</Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePickerModal
                        isVisible={visible}
                        mode={mode}
                        onConfirm={onConfirm}
                        onCancel={onCancel}
                        date={date}
                      />
                      <Text style={missionStyle.timeData}>
                        {date.getHours()}시 {date.getMinutes()}분
                      </Text>
                    </View>
                    {/* 종료 시간 */}
                    <View>
                      <View>
                        <View />
                        <TouchableOpacity
                          onPress={onPressStartTime2}
                          style={missionStyle.time}>
                          {/* 시간 선택 영역 */}
                          <Text style={missionStyle.timeText}>종료 시간</Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePickerModal
                        isVisible={visible2}
                        mode={mode2}
                        onConfirm={onConfirm2}
                        onCancel={onCancel2}
                        date={date2}
                      />
                      <Text style={missionStyle.timeData}>
                        {date2.getHours()}시 {date2.getMinutes()}분
                      </Text>
                    </View>
                    <View style={{height: 100}}>
                      <Text style={missionStyle.resultData}>
                        {diffDay}일 {diffHour}시간 {diffMin}분 남았습니다!
                      </Text>
                    </View>
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
  // 날짜, 시간 설정 style
  time: {
    alignItems: 'center',
    backgroundColor: '#81b0ff',
    width: '100%',
    height: 30,
    justifyContent: 'center',
    borderRadius: 200,
  },
  timeText: {
    fontWeight: 'bold',
    color: 'white',
  },
  timeData: {
    textAlign: 'center',
    fontSize: 20,
  },
  resultData: {
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
    marginTop: 20,
  },
  selectCategories: {
    marginTop: '7%',
    height: '8%',
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
  },
});
