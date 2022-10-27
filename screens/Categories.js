import styled from 'styled-components';
import React from 'react';

const MissionList = styled.Text`
  color: white;
  text-align: center;
`;
const GoalList = styled.View`
  width: 100%;
  height: 40px;
  background-color: #fcfcfc;
  flex-direction: row;
`;
const OverallGoal = styled.TouchableOpacity`
  width: 20%;
  background-color: #0891b2;
  border-radius: 5;
  height: 25px;
  margin: 10px;
`;

const Categories = () => {
  return (
    <>
      <GoalList>
        <OverallGoal>
          <MissionList>⭐전체목표</MissionList>
        </OverallGoal>
      </GoalList>
    </>
  );
};

export default Categories;
