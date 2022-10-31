import React, {useState} from 'react';
import {Text, ScrollView} from 'react-native';
import styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';

import FriendBox from './box/FriendBox';

const Container = styled.View`
  height: 100%;
  background-color: #ffffff;
`;

const AddMissionBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 5%;
  right: 5%;
  border-radius: 600px;
`;

const StyledText = styled.Text`
  font-size: 30px;
`;
export default function () {
  const [friendState, setFriendState] = useState('전체');
  const whole = () => setFriendState('전체');
  const locked = () => setFriendState('잠금 중');
  const giveUp = () => setFriendState('포기');
  const cheat = () => setFriendState('금지 앱');

  return (
    <Container>
      <ScrollView>
        <FriendBox category="✏️수업" missionName="그만듣고싶다"></FriendBox>
      </ScrollView>
      <AddMissionBtn>
        <Ionicons name="add-circle" size={50} color={'#0891b2'} />
      </AddMissionBtn>
    </Container>
  );
}
