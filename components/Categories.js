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
import {StackedBarChart} from 'react-native-chart-kit';

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
});

export default function Categories(props) {
  // 카테고리 더미 데이터
  const [category, setCategory] = useState([
    {id: 0, name: '✏️공부'},
    {id: 1, name: '💪운동'},
    {id: 2, name: '🏫수업'},
    {id: 3, name: '💻과제'},
  ]);
  const [categoryText, setCategoryText] = useState('+ 추가');
  const [currentCategory, setCurrentCategory] = useState('⭐전체목표');
  const nextId = useRef(category.length);

  // TextInput 입력 제출 시 카테고리 생성
  const createCategory = () => {
    if (categoryText !== '') {
      setCategory(category.concat({id: nextId.current, name: categoryText}));
      nextId.current++;
      setCategoryText('+ 추가');
    }
  };

  const removeCategory = () => {};
  //console.log(category);

  return (
    <>
      <Text style={{color: 'black'}}>카테고리</Text>
      <View style={{height: 37, marginVertical: 15}}>
        <ScrollView horizontal={true} style={styles.scroll}>
          <OverallGoal>
            <MissionList>⭐전체목표</MissionList>
          </OverallGoal>
          {category.map(item => (
            <OverallGoal
              key={item.id}
              onLongPress={() => {
                setCategory(category.filter(el => el.name !== item.name));
              }}>
              <MissionList>{item.name}</MissionList>
            </OverallGoal>
          ))}
          <OverallGoal>
            <TextInput
              style={{color: 'white', height: 47}}
              onChangeText={text => setCategoryText(text)}
              onPressIn={() => setCategoryText('')}
              // 입력 시 카테고리 UPDATE
              onSubmitEditing={createCategory}>
              {categoryText}
            </TextInput>
          </OverallGoal>
        </ScrollView>
      </View>
    </>
  );
}
