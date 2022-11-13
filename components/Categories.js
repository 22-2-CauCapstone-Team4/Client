import styled from 'styled-components';
import React, {useState, useRef} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  addCategory,
  deleteCategory,
  selectCategory,
  deleteMission,
} from '../store/action';
const MissionList = styled.Text`
  color: white;
`;

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
  const dispatch = useDispatch();
  const data = useSelector(store => store.categoryReducer.data); // 카테고리 데이터
  const now = useSelector(store => store.categoryReducer.filter);
  const mission = useSelector(store => store.missionReducer.missionData);
  const [categoryText, setCategoryText] = useState('+ 추가');
  const createCategory = () => {
    if (categoryText !== '') {
      dispatch(addCategory({id: categoryText, name: categoryText}));
      setCategoryText('+ 추가');
    }
  };
  return (
    <>
      <Text style={styles.blackText}>카테고리</Text>
      <View style={styles.scrollViewContainer}>
        <ScrollView horizontal={true} style={styles.scroll}>
          <OverallGoal
            style={{
              backgroundColor: now === '⭐전체목표' ? '#0891b2' : '#777',
            }}
            onPress={() => {
              dispatch(selectCategory('⭐전체목표'));
            }}>
            <MissionList>⭐전체목표</MissionList>
          </OverallGoal>
          {/* 삭제 */}
          {data.map(item => (
            <OverallGoal
              style={{
                backgroundColor: now === item.name ? '#0891b2' : '#777',
              }}
              key={item.id}
              onPress={() => {
                dispatch(selectCategory(item.name));
              }}
              onLongPress={() => {
                dispatch(
                  deleteMission(mission.filter(el => el.category !== item.id)),
                );
                dispatch(
                  deleteCategory(data.filter(el => el.name !== item.id)),
                );
                dispatch(selectCategory('⭐전체목표'));

                // 삭제된 카테고리 관련 미션도 삭제
              }}>
              <MissionList>{item.name}</MissionList>
            </OverallGoal>
          ))}
          {/* 추가 */}
          <OverallGoal>
            <TextInput
              placeholder="+ 추가"
              style={styles.inputStyle}
              onChangeText={text => setCategoryText(text)}
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
