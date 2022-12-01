import styled from 'styled-components';
import React, {useState, useRef} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  addCategory,
  deleteCategory,
  selectCategory,
  deleteMission,
  deleteTodayMission,
} from '../store/action';
import Colors from '../utils/Colors';
import {useAuth} from '../providers/AuthProvider';
import {Goal, Mission, Place, TodayMission} from '../schema';
import {createGoalInRealm, deleteGoalInRealm} from '../functions';
import {mkConfig} from '../functions/mkConfig';
import Realm from 'realm';

const OverallGoal = styled.TouchableHighlight`
  background-color: #0891b2;
  border-radius: 600px;
  padding: 0px 10px;
  margin: 0px 10px 0px 0px;
  justify-content: center;
`;

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#fafafa',
  },
  buttonStyle: {
    backgroundColor: '#0891b2',
    borderRadius: 600,
    paddingHorizontal: 10,
    marginRight: 10,
    justifyContent: 'center',
  },

  blackText: {
    color: 'black',
  },
  scrollViewContainer: {
    height: 37,
    marginVertical: 15,
  },

  inputStyle: {
    color: 'white',
    height: 47,
  },
});

export default function Categories() {
  const {user} = useAuth();
  const dispatch = useDispatch();
  const data = useSelector(store => store.categoryReducer.data); // 카테고리 데이터
  const now = useSelector(store => store.categoryReducer.filter);
  const mission = useSelector(store => store.missionReducer.missionData);
  const todayMission = useSelector(
    store => store.todayMissionReducer.todayMissionData,
  );

  const [categoryText, setCategoryText] = useState('');
  const createCategory = () => {
    if (categoryText !== '') {
      const newCategory = new Goal({name: categoryText, owner_id: user.id});
      Realm.open(mkConfig(user, [Goal.schema])).then(async realm => {
        await createGoalInRealm(user, realm, newCategory);
        realm.close();
      });
      dispatch(addCategory(newCategory));
      setCategoryText('');
    }
  };
  return (
    <>
      <View style={styles.scrollViewContainer}>
        <ScrollView horizontal={true} style={styles.scroll}>
          <OverallGoal
            style={{
              backgroundColor:
                now === '⭐ 전체 목표'
                  ? Colors.MAIN_COLOR
                  : Colors.MAIN_COLOR_INACTIVE,
            }}
            onPress={() => {
              dispatch(selectCategory('⭐ 전체 목표'));
            }}>
            <Text
              style={{
                color: now === '⭐ 전체 목표' ? 'white' : Colors.MAIN_COLOR,
              }}>
              ⭐ 전체 목표
            </Text>
          </OverallGoal>
          {/* 삭제 */}
          {data.map(item => (
            <OverallGoal
              style={{
                backgroundColor:
                  now === item.name
                    ? Colors.MAIN_COLOR
                    : Colors.MAIN_COLOR_INACTIVE,
              }}
              key={item._id}
              onPress={() => {
                dispatch(selectCategory(item.name));
              }}
              onLongPress={() => {
                Alert.alert(
                  '목표 삭제',
                  `목표 "${item.name}" 을/를 삭제하시겠습니까?\n연관된 미션 또한 함께 삭제됩니다. `,
                  [
                    {
                      text: '삭제',
                      onPress: () => {
                        Realm.open(
                          mkConfig(user, [
                            Goal.schema,
                            Mission.schema,
                            TodayMission.schema,
                            Place.schema,
                          ]),
                        ).then(async realm => {
                          await deleteGoalInRealm(user, realm, item);
                          realm.close();
                        });

                        dispatch(
                          deleteMission(
                            mission.filter(el => el.category !== item.name),
                          ),
                        );
                        dispatch(
                          deleteTodayMission(
                            todayMission.filter(
                              el => el.category !== item.name,
                            ),
                          ),
                        );
                        dispatch(
                          deleteCategory(
                            data.filter(el => el._id !== item._id),
                          ),
                        );
                        dispatch(selectCategory('⭐ 전체 목표'));
                      },
                    },
                    {text: '취소'},
                  ],
                );
              }}>
              <Text
                style={{
                  color: now === item.name ? 'white' : Colors.MAIN_COLOR,
                }}>
                {item.name}
              </Text>
            </OverallGoal>
          ))}
          {/* 추가 */}
          <OverallGoal>
            <TextInput
              placeholder="+ 추가"
              placeholderTextColor="white"
              style={styles.inputStyle}
              onChangeText={text => setCategoryText(text.trim())}
              onPressIn={() => setCategoryText('')}
              onSubmitEditing={createCategory}>
              {categoryText}
            </TextInput>
          </OverallGoal>
        </ScrollView>
      </View>
    </>
  );
}
