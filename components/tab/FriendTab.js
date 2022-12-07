import React, {useEffect, useState} from 'react';
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
import FriendCandidateModal from '../modal/FriendCandidateModal';
import {useDispatch, useSelector} from 'react-redux';
import {useAuth} from '../../providers/AuthProvider';

export default function FriendTab({navigation}) {
  const {user} = useAuth();
  const [friendState, setFriendState] = useState('whole');
  const [modalVisible, setModalVisible] = useState(false);
  const [followModalVisible, setFollowModalVisible] = useState(false);
  const whole = () => setFriendState('whole');
  const locked = () => setFriendState('lock');
  const giveUp = () => setFriendState('quit');
  const cheat = () => setFriendState('unlock');
  const friends = useSelector(store => store.friendReducer.data);
  const friendCandidates = useSelector(store => store.friendReducer.candidate);
  console.log(friends, friendCandidates);

  // const test = async () => {
  //   const {friendInfo, friendCurStates} = await user.callFunction(
  //     'friend/readFriends',
  //     {
  //       owner_id: user.id,
  //     },
  //   );
  //   // console.log(friendInfo, friends);
  //   let tempArr = [];
  //   for (let i = 0; i < friendInfo.length; i++) {
  //     tempArr.push({...friendInfo, friendCurStates});

  //   }
  // };
  // test();

  useEffect(() => {}, [friendCandidates]);

  return (
    <Container>
      <View style={styles.headerInfo}>
        <Text style={{color: 'black'}}>친구 상태</Text>
        <TouchableOpacity
          style={styles.followButton}
          onPress={() => {
            setFollowModalVisible(true);
          }}>
          <Text style={{color: Colors.MAIN_COLOR, fontSize: 12}}>
            {friendCandidates.length} 신청
          </Text>
        </TouchableOpacity>
      </View>

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
              color: friendState === 'unlock' ? Colors.MAIN_COLOR : 'black',
            }}>
            금지 앱
          </Text>
        </TouchableOpacity>
      </FriendState>
      <StateText>
        {friendState == 'whole'
          ? '전체 | ' + friends.length
          : friendState == 'lock'
          ? '잠금 중 | ' + friends.filter(el => el.state === 'lock').length
          : friendState == 'quit'
          ? '포기 | ' +
            friends.filter(
              el => el.state === 'quit' || el.state === 'unlock_quit',
            ).length
          : '금지 앱 | ' +
            friends.filter(
              el => el.state === 'unlock' || el.state === 'unlock_quit',
            ).length}
      </StateText>
      <ScrollView>
        {friendState === 'whole'
          ? friends.map(item => (
              <FriendBox
                key={item.nickname}
                name={item.nickname}
                state={item.state}></FriendBox>
            ))
          : friends
              .filter(el => el.state === friendState)
              .map(item => {
                console.log(item);
                return (
                  <FriendBox
                    key={item.nickname}
                    name={item.nickname}
                    state={item.state}></FriendBox>
                );
              })}
      </ScrollView>
      <AddFriendBtn onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle" size={45} color={'#0891b2'} />
        <Text
          style={{
            color: Colors.MAIN_COLOR,
            fontSize: 10,
          }}>
          친구 추가
        </Text>
      </AddFriendBtn>
      {/* modal */}
      <View style={styles.centeredView}>
        <FriendModal
          navigation={navigation}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}></FriendModal>
        <FriendCandidateModal
          navigation={navigation}
          followModalVisible={followModalVisible}
          setFollowModalVisible={setFollowModalVisible}></FriendCandidateModal>
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
  followButton: {
    backgroundColor: Colors.MAIN_COLOR_INACTIVE,
    width: 55,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

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
