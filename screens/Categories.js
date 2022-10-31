import styled from 'styled-components';
import React from 'react';

const MissionList = styled.Text`
  color: white;
  text-align: center;
`;
const GoalList = styled.View`
  width: 100%;
  background-color: #fcfcfc;
  flex-direction: row;
`;
const OverallGoal = styled.TouchableOpacity`
  background-color: #0891b2;
  border-radius: 600px;
  padding: 10px;
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
