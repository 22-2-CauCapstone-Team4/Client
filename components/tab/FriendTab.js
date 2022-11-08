import React, {useState} from 'react';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  Pressable,
  TextInput,
  Modal,
  StyleSheet,
} from 'react-native';
import styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../utils/Colors';
import FriendBox from '../box/FriendBox';
import FriendModal from '../modal/FriendModal';
const Container = styled.View`
  height: 100%;
  background-color: #ffffff;
  padding: 20px;
`;

const FriendState = styled.View`
  border: 1px solid #f1f1f1;
  border-radius: 600px;
  margin: 10px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: #fcfcfc;
  height: 30px;
`;

const StateText = styled.Text`
  color: #373737;
  font-size: 20px;
  font-weight: bold;
  margin: 15px 0;
`;

const AddFriendBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 5%;
  right: 5%;
  border-radius: 600px;
`;

const StyledText = styled.Text`
  font-size: 30px;
`;
export default function FriendTab({navigation}) {
  const [friendState, setFriendState] = useState('whole');
  const [modalVisible, setModalVisible] = useState(false);
  const whole = () => setFriendState('whole');
  const locked = () => setFriendState('lock');
  const giveUp = () => setFriendState('quit');
  const cheat = () => setFriendState('cheat');

  return (
    <Container>
      <Text style={{color: 'black'}}>친구 상태</Text>
      <FriendState>
        <TouchableOpacity onPress={whole}>
          <Text
            style={{
              color: friendState === 'whole' ? Colors.MAIN_COLOR : 'black',
            }}>
            전체
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={locked}>
          <Text
            style={{
              color: friendState === 'lock' ? Colors.MAIN_COLOR : 'black',
            }}>
            잠금 중
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={giveUp}>
          <Text
            style={{
              color: friendState === 'quit' ? Colors.MAIN_COLOR : 'black',
            }}>
            포기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={cheat}>
          <Text
            style={{
              color: friendState === 'cheat' ? Colors.MAIN_COLOR : 'black',
            }}>
            금지 앱
          </Text>
        </TouchableOpacity>
      </FriendState>
      <StateText>전체 | 5</StateText>
      <ScrollView>
        <FriendBox category="✏️수업" missionName="그만듣고싶다"></FriendBox>
        <FriendBox category="✏️수업" missionName="그만듣고싶다"></FriendBox>
        <FriendBox category="✏️수업" missionName="그만듣고싶다"></FriendBox>
        <FriendBox category="✏️수업" missionName="그만듣고싶다"></FriendBox>
        <FriendBox category="✏️수업" missionName="그만듣고싶다"></FriendBox>
      </ScrollView>
      <AddFriendBtn onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle" size={50} color={'#0891b2'} />
      </AddFriendBtn>
      {/* modal */}
      <View style={styles.centeredView}>
        <FriendModal
          navigation={navigation}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}></FriendModal>
      </View>
    </Container>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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
  button: {
    borderRadius: 20,
    padding: 15,
    elevation: 2,
    margin: 5,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
