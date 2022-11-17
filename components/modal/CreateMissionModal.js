import React, {useState, useCallback} from 'react';
import {
  Text,
  Modal,
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {styles} from '../../utils/styles';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import SelectDropdown from 'react-native-select-dropdown';
import {StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../../utils/Colors';
import {addMission} from '../../store/action';
export default function CreateMissionModal({
  navigation,
  modalVisible,
  setModalVisible,
}) {
  const dispatch = useDispatch();
  const missionData = useSelector(store => store.missionReducer.missionData);
  //console.log('미션 정보');
  //console.log(missionData);
  // ★ 시간 잠금 저장
  const [saveTime, setSaveTime] = useState();
  // ★ 시간 잠금 데이터 저장 함수
  const saveTimeLock = (
    missionName,
    selectCategory,
    startTime,
    endTime,
    lockingType,
  ) => {
    setSaveTime({
      id: missionName, // 미션 이름
      category: selectCategory, // 카테고리 이름
      name: missionName, // 미션 이름
      date: `${new Date(startTime).getFullYear()}-${
        new Date(startTime).getMonth() + 1
      }-${new Date(startTime).getDate()}`, // 년, 월, 일
      type: {lockingType} ? 'time' : 'space', // false: 시간 잠금, true: 공간 잠금
      time: {
        // 시작시간, 종료시간
        startTime: `${new Date(startTime).getHours()}:${new Date(
          startTime,
        ).getMinutes()}`,
        endTime: `${new Date(endTime).getHours()}:${new Date(
          endTime,
        ).getMinutes()}`,
      },
      dayOfWeek: {}, // ＠ 요일 데이터
      space: {},
    });
    return {
      id: missionName, // 미션 이름
      category: selectCategory, // 카테고리 이름
      name: missionName, // 미션 이름
      date: `${new Date(startTime).getFullYear()}-${
        new Date(startTime).getMonth() + 1
      }-${new Date(startTime).getDate()}`, // 년, 월, 일
      type: {lockingType} ? 'time' : 'space', // false: 시간 잠금, true: 공간 잠금
      time: {
        // 시작시간, 종료시간
        startTime: `${new Date(startTime).getHours()}:${new Date(
          startTime,
        ).getMinutes()}`,
        endTime: `${new Date(endTime).getHours()}:${new Date(
          endTime,
        ).getMinutes()}`,
      },
      dayOfWeek: {}, // ＠ 요일 데이터
      space: {},
    };
  };
  //console.log('시간 데이터');
  //console.log(saveTime);
  // ★ 공간 잠금 저장
  // const [saveSpace, setSaveSpace] = useState([
  //   //  더미 데이터
  //   {
  //     test2: '공간 잠금',
  //     id: '조깅',
  //     category: '운동',
  //     name: '조깅',
  //     date: '오늘날짜',
  //     type: 'space',
  //     time: {},
  //     space: {type: 'outside', place: '집'},
  //   },
  // ]);
  // ☆ 공간 잠금 저장
  // const saveSpaceLock = ({
  //   missionName,
  //   selectCategory,
  //   selectSpace,
  //   startTime,
  //   lockingType,
  //   spaceIn,
  //   moveSpace,
  // }) => {
  //   setSaveSpace([
  //     ...saveSpace,
  //     {
  //       id: missionName, // 미션 이름
  //       category: selectCategory, // 카테고리 이름
  //       name: missionName, // 미션 이름
  //       date: `${startTime.getFullYear()}-${
  //         startTime.getMonth() + 1
  //       }-${startTime.getDate()}`, // 년, 월, 일
  //       type: {lockingType} ? 'space' : 'time', // false: 시간 잠금, true: 공간 잠금
  //       time: {},
  //       space: {
  //         type:
  //           {spaceIn} == false
  //             ? {moveSpace} == false
  //               ? 'global'
  //               : 'inside'
  //             : 'outside',
  //         place: selectSpace,
  //       },
  //       state: 'none',
  //     },
  //   ]);
  //   console.log(saveSpace);
  // };
  // 카테고리

  const category = useSelector(store => store.categoryReducer.data); // ★ 카테고리 데이터
  const space = useSelector(store => store.placeReducer.data); // ★ 공간 데이터
  const [selectCategory, setSelectCategory] = useState(''); // 카테고리 선택 state
  const [selectSpace, setSelectSpace] = useState(''); // 공간선택 state
  // 미션 이름 저장
  const [missionName, setMissionName] = useState('');
  const saveMission = text => {
    setMissionName(text);
  };
  // 시간, 공간 잠금
  const [lockingType, setLockingType] = useState(false); // 시간잠금 or 공간잠금 state
  const lockTime = () => {
    if (lockingType === true) setLockingType(!lockingType);
  };
  const lockSpace = () => {
    if (lockingType === false) setLockingType(!lockingType);
  };
  // 공간 이동, 공간 안 토글
  const [moveSpace, setMoveSpace] = useState(false); // 공간 이동 state
  const [spaceIn, setSpaceIn] = useState(false); // 공간 안 state
  // ------------------------ 시작 시간 및 날짜 선택 -------------------------
  const [startTime, onChangeDate] = useState(new Date()); // 선택 날짜
  const [mode, setMode] = useState('date'); // 모달 유형
  const [visible, setVisible] = useState(false); // 모달 노출 여부

  const onPressDate = () => {
    // 날짜 클릭 시
    setMode('date'); // 모달 유형을 date로 변경
    setVisible(true); // 모달 open
    console.log(`mode: ${mode}`);
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
  const [endTime, onChangeDate2] = useState(new Date()); // 선택 날짜
  const [mode2, setMode2] = useState('date'); // 모달 유형
  const [visible2, setVisible2] = useState(false); // 모달 노출 여부

  const onPressEndTime = () => {
    // 시간 클릭 시
    setMode2('time'); // 모달 유형을 time으로 변경
    setVisible2(true); // 모달 open
  };
  const onConfirm2 = selectedDate => {
    // 날짜 또는 시간 선택 시
    setVisible2(false); // 모달 close
    onChangeDate2(selectedDate); // 선택한 날짜 변경
    console.log(`end time : ${endTime.time()}`);
  };
  const onCancel2 = () => {
    // 취소 시
    setVisible2(false); // 모달 close
  };
  // ＠ 요일 선택
  const [selected, setSelected] = React.useState(new Map());
  const [selectedDay, setSelectedDay] = useState('');

  const dayOfWeekSave = selected => {
    setSelectedDay([...selected.keys()]);
    console.log(selectedDay);
  };
  const Data = [
    //＠ 요일 데이터
    {
      id: 0,
      title: '일',
    },
    {
      id: 1,
      title: '월',
    },
    {
      id: 2,
      title: '화',
    },
    {
      id: 3,
      title: '수',
    },
    {
      id: 4,
      title: '목',
    },
    {
      id: 5,
      title: '금',
    },
    {
      id: 6,
      title: '토',
    },
  ];
  // ＠ 이후 쭉 요일 관련 함수
  const onSelect = useCallback(
    id => {
      const newSelected = new Map(selected);
      newSelected.set(id, !selected.get(id));
      setSelected(newSelected);
    },
    [selected],
  );
  const Item = ({id, title, selected, onSelect}) => {
    return (
      <TouchableOpacity
        onPress={() => onSelect(id, title)}
        style={{
          backgroundColor: selected ? 'grey' : 'white',
          margin: 1,
          marginTop: 10,
          borderWidth: 1,
          borderRadius: 25,
          width: 35,
          height: 35,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: 'black'}}>{title}</Text>
      </TouchableOpacity>
    );
  };

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
              <Text style={{color: 'black', fontSize: 20, marginBottom: 10}}>
                미션 추가
              </Text>
              <ScrollView>
                <View style={{alignItems: 'center'}}>
                  <SelectDropdown
                    defaultButtonText="카테고리"
                    data={category.map(el => el.name)}
                    onSelect={selectedItem => {
                      setSelectCategory(selectedItem);
                      console.log(selectedItem);
                    }}
                  />
                </View>
                <View style={missionStyle.missionText}>
                  <TextInput
                    style={missionStyle.textInputStyle}
                    onChangeText={saveMission}
                    placeholder="미션 입력"
                    placeholderTextColor="grey"
                  />
                </View>
                <View style={missionStyle.inputRow}>
                  <Text style={missionStyle.selectCalendar}>
                    {startTime.getMonth() + 1}월 {startTime.getDate()}일
                  </Text>
                  <TouchableOpacity onPress={onPressDate}>
                    <Ionicons
                      name="calendar-outline"
                      size={30}
                      style={{color: Colors.MAIN_COLOR}}></Ionicons>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={visible}
                    mode={mode}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    date={startTime}
                  />
                </View>
                {/* ＠ 요일 아직 구현 x */}
                <View>
                  <FlatList
                    horizontal
                    data={Data}
                    renderItem={({item}) => (
                      <Item
                        id={item.id}
                        title={item.title}
                        selected={!!selected.get(item.id)}
                        onSelect={onSelect}
                      />
                    )}
                    keyExtractor={item => item.id}
                    extraData={selected}
                  />
                </View>
                {/* 시간 잠금 or 공간 잠금 */}
                <View style={missionStyle.btnStyle}>
                  <TouchableOpacity onPress={lockTime}>
                    <Text
                      style={[
                        missionStyle.lockBtn,
                        {
                          backgroundColor: lockingType
                            ? Colors.GREY
                            : Colors.MAIN_COLOR,
                        },
                      ]}>
                      시간잠금
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={lockSpace}>
                    <Text
                      style={[
                        missionStyle.lockBtn,
                        {
                          backgroundColor: lockingType
                            ? Colors.MAIN_COLOR
                            : Colors.GREY,
                        },
                      ]}>
                      공간잠금
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* state에 따라 시간 or 공간 잠금 컴포넌트 보여주는 곳 */}
                {lockingType ? (
                  <View>
                    <View>
                      <View style={{alignItems: 'center', marginTop: 20}}>
                        <SelectDropdown
                          defaultButtonText="공간선택"
                          data={space.map(el => el.name)}
                          onSelect={selectedItem => {
                            setSelectSpace(selectedItem);
                          }}
                        />
                      </View>
                    </View>
                    <View style={missionStyle.toggleBtn}>
                      <Text style={missionStyle.spaceText}>공간 이동</Text>
                      <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        onValueChange={() => {
                          setMoveSpace(!moveSpace);
                          console.log(`moveSpace: ${moveSpace}`);
                        }}
                        value={moveSpace}
                      />
                    </View>
                    <View style={missionStyle.toggleBtn}>
                      <Text style={missionStyle.spaceText}>공간 안</Text>
                      <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        onValueChange={() => {
                          setSpaceIn(!spaceIn);
                          console.log(`spaceIn: ${spaceIn}`);
                        }}
                        value={spaceIn}
                      />
                    </View>
                  </View>
                ) : (
                  <View>
                    {/* 시작 시간 */}
                    <View style={{marginTop: 10}}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {/* 시간 선택 영역 */}
                        <TouchableOpacity
                          onPress={onPressStartTime}
                          style={missionStyle.time}>
                          <Text style={missionStyle.timeText}>시작 시간</Text>
                        </TouchableOpacity>
                        <Text style={{color: 'black'}}>
                          {startTime.getHours() + ':' + startTime.getMinutes()}
                        </Text>
                      </View>
                      <DateTimePickerModal
                        isVisible={visible}
                        mode={mode}
                        onConfirm={onConfirm}
                        onCancel={onCancel}
                        date={startTime}
                      />
                      <Text style={missionStyle.timeData}>
                        {startTime.getHours()}시 {startTime.getMinutes()}분
                      </Text>
                    </View>
                    {/* 종료 시간 */}
                    <View>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {/* 시간 선택 영역 */}
                        <TouchableOpacity
                          onPress={onPressEndTime}
                          style={missionStyle.time}>
                          <Text style={missionStyle.timeText}>종료 시간</Text>
                        </TouchableOpacity>
                        <Text style={{color: 'black'}}>
                          {endTime.getHours() + ':' + endTime.getMinutes()}
                        </Text>
                      </View>
                      <DateTimePickerModal
                        isVisible={visible2}
                        mode={mode2}
                        onConfirm={onConfirm2}
                        onCancel={onCancel2}
                        date={endTime}
                      />
                      <Text style={missionStyle.timeData}>
                        {endTime.getHours()}시 {endTime.getMinutes()}분
                      </Text>
                    </View>
                  </View>
                )}
              </ScrollView>
              <View style={{flexDirection: 'row'}}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    saveTimeLock(
                      missionName,
                      selectCategory,
                      startTime,
                      endTime,
                      lockingType,
                    );
                    dispatch(
                      addMission(
                        saveTimeLock(
                          missionName,
                          selectCategory,
                          startTime,
                          endTime,
                          lockingType,
                        ),
                      ),
                    );
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
  textInputStyle: {
    borderColor: 'grey',
    height: 40,
    color: 'black',
  },
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
    justifyContent: 'space-between',
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
    // borderRadius: 10,
    width: '100%',
  },
  missionText: {
    borderWidth: 1,
    marginTop: 10,
  },
  // 요일 style
  dayOfWeekStyle: {
    flexDirection: 'row',
  },
});
