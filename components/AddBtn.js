import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components';

const AddMissionBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 5%;
  right: 5%;
`;
const AddBtn = () => {
  return (
    <>
      <AddMissionBtn>
        <Ionicons name="add-circle" size={50} color={'#0891b2'}></Ionicons>
      </AddMissionBtn>
    </>
  );
};

export default AddBtn;
