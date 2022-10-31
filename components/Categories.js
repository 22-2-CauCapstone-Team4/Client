import styled from 'styled-components';
import React from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';

const MissionList = styled.Text`
  color: white;
`;

const OverallGoal = styled.TouchableOpacity`
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
});

const Categories = () => {
  return (
    <>
      <Text style={{color: 'black'}}>카테고리</Text>
      <View style={{height: 35, marginVertical: 15}}>
        <ScrollView horizontal={true} style={styles.scroll}>
          <OverallGoal>
            <MissionList>⭐전체목표</MissionList>
          </OverallGoal>
          <OverallGoal>
            <MissionList>💪운동</MissionList>
          </OverallGoal>
          <OverallGoal>
            <MissionList>🐕산책</MissionList>
          </OverallGoal>
          <OverallGoal>
            <MissionList>🏫과제</MissionList>
          </OverallGoal>
          <OverallGoal>
            <MissionList>✏️수업</MissionList>
          </OverallGoal>
        </ScrollView>
      </View>
    </>
  );
};

export default Categories;
