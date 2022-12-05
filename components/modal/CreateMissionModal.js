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
import SnackBar from 'react-native-snackbar';
import {styles} from '../../utils/styles';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import SelectDropdown from 'react-native-select-dropdown';
import {StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../../utils/Colors';
import {addMission, addTodayMission} from '../../store/action';
import {
  createMissionInRealm,
  mkMissionObjToRealmObj,
  isTodayMission,
  mkMissionRealmObjToObj,
  mkTodayMissionRealmObjToObj,
  getTodayMissionInRealm,
} from '../../functions';
import {TodayMission, Mission, Goal, Place} from '../../schema';
import {mkConfig} from '../../functions/mkConfig';
import {useAuth} from '../../providers/AuthProvider';
import Realm from 'realm';
import {withTheme} from 'styled-components';
import {MissionSetterModule} from '../../wrap_module';

export default function CreateMissionModal({
  navigation,
  modalVisible,
  setModalVisible,
}) {
  const dispatch = useDispatch();

  const {user} = useAuth();

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
  // false가 시간 잠금
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

  // --- 출발 시간 ---
  const [departureTime, onChangeDate3] = useState(new Date()); // 선택 날짜
  const [mode3, setMode3] = useState('date'); // 모달 유형
  const [visible3, setVisible3] = useState(false); // 모달 노출 여부

  const onPressDepartureTime = () => {
    setMode3('time');
    setVisible3(true);
  };

  const onConfirmDepartureTime = selectedDate => {
    // 날짜 또는 시간 선택 시
    setVisible3(false); // 모달 close
    onChangeDate3(selectedDate); // 선택한 날짜 변경
    console.log(`departure time : ${selectedDate}`);
  };
  const onCancel3 = () => {
    // 취소 시
    setVisible3(false); // 모달 close
  };

  // ＠ 요일 선택
  const [selected, setSelected] = React.useState([]);
  const dayOfWeekData = [
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
  // 수정 -> 배열에서 id값만 가지고 있도록
  const onSelect = useCallback(
    id => {
      if (selected.includes(id)) setSelected(selected.filter(ele => ele != id));
      else setSelected([...selected, id]);
    },
    [selected],
  );
  const Item = ({id, title, selected, onSelect}) => {
    return (
      <TouchableOpacity
        onPress={() => onSelect(id)}
        style={{
          backgroundColor: selected ? Colors.MAIN_COLOR : 'white',
          margin: 2,
          marginTop: 10,
          borderWidth: 0.7,
          borderRadius: 25,
          borderColor: selected ? 'white' : Colors.GREY,
          width: 34,
          height: 34,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: selected
              ? 'white'
              : id == 0
              ? 'red'
              : id == 6
              ? 'blue'
              : 'black',
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };
  const closeModalResetInfo = () => {
    setSelectCategory('');
    setMissionName('');
    setModalVisible(!modalVisible);
  };
  // VALIDATION MESSAGE
  const [categoryValid, setCategoryValid] =
    useState('카테고리를 선택해주세요!');
  const [missionNameValid, setMissionNameValid] =
    useState('미션 이름을 입력해주세요!');
  const [placeValid, setPlaceValid] = useState('장소를 선택해주세요!');
  const [validMessage, setValidMessage] = useState(' ');
  const [placeToggleValid, setPlaceToggleValid] = useState(
    '하나 이상의 장소 미션 유형을 선택해주세요!',
  );
  // console.log('카테고리', selectCategory);
  // console.log('미션 이름', missionName);
  // console.log(selectCategory === '');
  return (
    <>
      {modalVisible ? (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setLockingType(false);
            setSelectCategory('');
            setCategoryValid('카테고리를 선택해주세요!');
            setMissionName('');
            setMissionNameValid('미션 이름을 입력해주세요!');
            setSelectSpace('');
            setPlaceValid('장소를 선택해주세요!');
            setValidMessage(' ');
            setPlaceToggleValid('하나 이상의 장소 미션 유형을 선택해주세요!');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={[missionStyle.modalView]}>
              <Text style={{color: 'black', fontSize: 20, marginBottom: 10}}>
                미션 추가
              </Text>
              <View>
                <View style={missionStyle.contentView}>
                  <ScrollView>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        marginTop: 5,
                        paddingHorizontal: 10,
                      }}>
                      <Text style={{color: 'black'}}>카테고리 선택</Text>
                      <SelectDropdown
                        defaultButtonText="카테고리 선택"
                        buttonStyle={{
                          borderRadius: 25,
                          height: 33,
                          width: '50%',
                          backgroundColor: Colors.MAIN_COLOR,
                        }}
                        buttonTextStyle={{color: 'white', fontSize: 16}}
                        data={category.map(el => el.name)}
                        onSelect={selectedItem => {
                          setCategoryValid(' ');
                          setSelectCategory(
                            category.find(ele => ele.name === selectedItem),
                          );
                          console.log(selectCategory);
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        color: 'red',
                        paddingHorizontal: 10,
                        fontSize: 10,
                      }}>
                      {categoryValid}
                    </Text>

                    <View
                      style={[
                        {
                          flexDirection: 'row',
                          alignItems: 'center',
                          height: 40,
                        },
                      ]}>
                      <View
                        style={{
                          width: '50%',
                          paddingHorizontal: 10,
                        }}>
                        <Text
                          style={{
                            color: 'black',
                            textAlign: 'left',
                          }}>
                          미션 이름
                        </Text>
                      </View>
                      <View style={{width: '50%'}}>
                        <TextInput
                          style={missionStyle.textInputStyle}
                          onChangeText={text => {
                            saveMission(text);
                            if (text === '') {
                              setMissionNameValid('미션 이름을 입력해주세요!');
                            } else {
                              setMissionNameValid(' ');
                            }
                          }}
                          placeholder="이름"
                          placeholderTextColor={Colors.GREY}
                        />
                      </View>
                    </View>
                    <Text
                      style={{
                        color: 'red',
                        paddingHorizontal: 10,
                        fontSize: 10,
                      }}>
                      {missionNameValid}
                    </Text>
                    <Text
                      style={{color: 'black', marginTop: 5, paddingLeft: 10}}>
                      날짜 선택
                    </Text>
                    <View style={missionStyle.inputRow}>
                      <Text style={missionStyle.selectCalendar}>
                        {selected.length === 0
                          ? `${
                              startTime.getMonth() + 1
                            }월 ${startTime.getDate()}일`
                          : selected.length === 7
                          ? '매일 반복'
                          : selected.length === 5 &&
                            !selected.includes(0) &&
                            !selected.includes(6)
                          ? '주중 반복'
                          : selected.length === 2 &&
                            selected.includes(0) &&
                            selected.includes(6)
                          ? '주말 반복'
                          : `매주 ${['일', '월', '화', '수', '목', '금', '토']
                              .filter((ele, ind) => selected.includes(ind))
                              .join(', ')} 반복`}
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
                    <View style={{alignItems: 'center', margin: 4}}>
                      <FlatList
                        horizontal
                        data={dayOfWeekData}
                        renderItem={({item}) => (
                          <Item
                            id={item.id}
                            title={item.title}
                            selected={selected.includes(item.id)}
                            onSelect={onSelect}
                          />
                        )}
                        keyExtractor={item => item.id}
                        extraData={selected}
                      />
                    </View>
                    {/* 시간 잠금 or 공간 잠금 */}
                    <View style={missionStyle.btnStyle}>
                      <TouchableOpacity
                        onPress={lockTime}
                        style={[
                          missionStyle.lockBtn,
                          {
                            backgroundColor: lockingType
                              ? Colors.GREY
                              : Colors.MAIN_COLOR,
                          },
                        ]}>
                        <Text style={missionStyle.lockBtnText}>시간 잠금</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={lockSpace}
                        style={[
                          missionStyle.lockBtn,
                          {
                            backgroundColor: lockingType
                              ? Colors.MAIN_COLOR
                              : Colors.GREY,
                          },
                        ]}>
                        <Text style={missionStyle.lockBtnText}>공간 잠금</Text>
                      </TouchableOpacity>
                    </View>

                    {/* state에 따라 시간 or 공간 잠금 컴포넌트 보여주는 곳 */}
                    {lockingType ? (
                      <View>
                        <View>
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexDirection: 'row',
                              marginTop: 15,
                              paddingHorizontal: 10,
                            }}>
                            <Text style={{color: 'black'}}>장소 선택</Text>
                            <SelectDropdown
                              defaultButtonText="장소 선택"
                              buttonStyle={{
                                borderRadius: 25,
                                height: 33,
                                width: '50%',

                                backgroundColor: Colors.MAIN_COLOR,
                              }}
                              buttonTextStyle={{color: 'white'}}
                              data={space.map(el => el.name)}
                              onSelect={selectedItem => {
                                setPlaceValid(' ');
                                setSelectSpace(selectedItem);
                              }}
                            />
                          </View>
                          <Text
                            style={{
                              color: 'red',
                              paddingHorizontal: 10,
                              fontSize: 10,
                            }}>
                            {placeValid}
                          </Text>
                        </View>
                        <View style={missionStyle.toggleBtn}>
                          <Text style={missionStyle.spaceText}>공간 이동</Text>
                          <Switch
                            trackColor={{false: '#767577', true: '#81b0ff'}}
                            onValueChange={() => {
                              if (moveSpace && !spaceIn)
                                setPlaceToggleValid(
                                  '하나 이상의 장소 미션 유형을 선택해주세요!',
                                );
                              else setPlaceToggleValid(' ');
                              setMoveSpace(!moveSpace);
                              // console.log(`moveSpace: ${moveSpace}`);
                            }}
                            value={moveSpace}
                          />
                        </View>
                        <View>
                          {
                            // 레이아웃 수정 필요
                            /* 출발 시간 */ moveSpace && (
                              <View>
                                <View
                                  style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingHorizontal: 10,
                                  }}>
                                  {/* 시간 선택 영역 */}
                                  <TouchableOpacity
                                    onPress={onPressDepartureTime}
                                    style={missionStyle.time}>
                                    <Text style={missionStyle.timeText}>
                                      출발 시간
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                                <DateTimePickerModal
                                  isVisible={visible3}
                                  mode={mode3}
                                  onConfirm={onConfirmDepartureTime}
                                  onCancel={onCancel3}
                                  date={departureTime}
                                />
                                <Text style={missionStyle.timeData}>
                                  {`${departureTime.getHours()}시 ${departureTime.getMinutes()}분`}
                                </Text>
                              </View>
                            )
                          }
                        </View>
                        <View style={missionStyle.toggleBtn}>
                          <Text style={missionStyle.spaceText}>공간 안</Text>
                          <Switch
                            trackColor={{false: '#767577', true: '#81b0ff'}}
                            onValueChange={() => {
                              if (!moveSpace && spaceIn)
                                setPlaceToggleValid(
                                  '하나 이상의 장소 미션 유형을 선택해주세요!',
                                );
                              else setPlaceToggleValid(' ');
                              setSpaceIn(!spaceIn);
                              // console.log(`spaceIn: ${spaceIn}`);
                            }}
                            value={spaceIn}
                          />
                        </View>
                        <Text
                          style={{
                            color: 'red',
                            paddingHorizontal: 10,
                            fontSize: 10,
                          }}>
                          {placeToggleValid}
                        </Text>
                      </View>
                    ) : (
                      <View>
                        {/* 시작 시간 */}
                        <View style={{marginVertical: 15}}>
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingHorizontal: 10,
                            }}>
                            {/* 시간 선택 영역 */}
                            <TouchableOpacity
                              onPress={onPressStartTime}
                              style={missionStyle.time}>
                              <Text style={missionStyle.timeText}>
                                시작 시간
                              </Text>
                            </TouchableOpacity>
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
                              paddingHorizontal: 10,
                            }}>
                            {/* 시간 선택 영역 */}
                            <TouchableOpacity
                              onPress={onPressEndTime}
                              style={missionStyle.time}>
                              <Text style={missionStyle.timeText}>
                                종료 시간
                              </Text>
                            </TouchableOpacity>
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
                    <View style={{alignItems: 'center', marginTop: 10}}>
                      <Text style={{color: 'red'}}>{validMessage}</Text>
                    </View>
                  </ScrollView>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={async () => {
                      if (
                        (lockingType == false ||
                          (lockingType == true && placeValid === ' ')) &&
                        categoryValid === ' ' &&
                        missionNameValid === ' ' &&
                        placeToggleValid === ' '
                      ) {
                        setSelectCategory('');
                        setCategoryValid('카테고리를 선택해주세요!');
                        setMissionName('');
                        setMissionNameValid('미션 이름을 입력해주세요!');
                        setSelectSpace('');
                        setPlaceValid('장소를 선택해주세요!');
                        setValidMessage(' ');
                        setPlaceToggleValid(
                          '하나 이상의 장소 미션 유형을 선택해주세요!',
                        );
                        const mission = mkMissionObjToRealmObj({
                          user,
                          missionName,
                          selectCategory,
                          startTime: lockingType ? departureTime : startTime,
                          endTime,
                          lockingType,
                          dayOfWeek: selected,
                          space: space.find(ele => ele.name === selectSpace),
                          spaceIn,
                          moveSpace,
                        });

                        dispatch(addMission(mkMissionRealmObjToObj(mission)));

                        setLockingType(false);
                        setModalVisible(!modalVisible);

                        Realm.open(
                          mkConfig(user, [
                            TodayMission.schema,
                            Mission.schema,
                            Goal.schema,
                            Place.schema,
                          ]),
                        ).then(async realm => {
                          await createMissionInRealm(user, realm, mission);
                          if (isTodayMission(mission)) {
                            dispatch(
                              addTodayMission(
                                mkTodayMissionRealmObjToObj(
                                  await getTodayMissionInRealm(
                                    user,
                                    realm,
                                    mission._id,
                                  ),
                                ),
                              ),
                            );

                            if (mission.type !== Mission.TYPE.IN_PLACE) {
                              // 예약 설정
                              await MissionSetterModule.setTimeMission(
                                parseInt(mission.startTime / 60),
                                mission.startTime % 60,
                                mission._id.toString(),
                                parseInt(Math.random() * 10000000),
                              );
                            } else {
                              await MissionSetterModule.setPlaceMission(
                                mission.place.lat,
                                mission.place.lng,
                                parseInt(mission.place.range * 1000),
                                true, // isEnter
                                mission._id.toString(),
                                parseInt(Math.random() * 10000000),
                              );
                            }
                          }

                          realm.close();
                        });

                        SnackBar.show({
                          text: '미션 생성이 완료되었습니다. ',
                          duration: SnackBar.LENGTH_SHORT,
                        });
                      } else {
                        setValidMessage('입력 정보를 확인해주세요!');
                      }
                    }}>
                    <Text style={styles.textStyle}>확인</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {
                      setLockingType(false);
                      setValidMessage(' ');
                      setSelectCategory('');
                      setCategoryValid('카테고리를 선택해주세요!');
                      setMissionName('');
                      setMissionNameValid('미션 이름을 입력해주세요!');
                      setSelectSpace('');
                      setPlaceValid('장소를 선택해주세요!');
                      setPlaceToggleValid(
                        '하나 이상의 장소 미션 유형을 선택해주세요!',
                      );
                      setModalVisible(!modalVisible);
                    }}>
                    <Text style={styles.textStyle}>취소</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
}
const missionStyle = StyleSheet.create({
  modalView: {
    margin: 5,
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
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
  contentView: {
    width: 300,
    height: 500,
    padding: 7,
    borderColor: 'grey',
    borderWidth: 0.5,
    borderRadius: 25,
  },
  textInputStyle: {
    height: 40,
    fontSize: 13,
    color: 'black',
    borderWidth: 1,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  // CreateMissionModal.js에서 input
  missionInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
  },
  inputRow: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  lockBtn: {
    height: 33,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  lockBtnText: {
    color: 'white',
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
    paddingHorizontal: 10,
    marginTop: 5,
  },
  spaceText: {
    color: 'black',
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
    color: 'black',
  },
  // 날짜, 시간 설정 style
  time: {
    alignItems: 'center',
    backgroundColor: Colors.MAIN_COLOR,
    width: '100%',
    height: 33,
    justifyContent: 'center',
    borderRadius: 25,
  },
  timeText: {
    color: 'white',
  },
  timeData: {
    textAlign: 'center',
    color: 'black',
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
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    marginTop: 10,
  },
  // 요일 style
  dayOfWeekStyle: {
    flexDirection: 'row',
  },
});
