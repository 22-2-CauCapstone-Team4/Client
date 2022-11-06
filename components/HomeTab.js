import React, {useState} from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
  View,
  Pressable,
  TextInput,
} from 'react-native';
import AddBtn from './AddBtn';
import MissionBox from './box/MissionBox';
import Categories from './Categories';
import {StyleSheet} from 'react-native';
import OngoingBox from './box/OngoingBox';
const Container = styled.View`
  height: 100%;
  background-color: white;
  padding: 20px;
`;
const AddMissionBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 5%;
  right: 5%;
  border-radius: 600px;
`;
const AboutMission = styled.View`
  border: 1px solid #f1f1f1;
  border-radius: 600px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: #fcfcfc;
  height: 30px;
`;
const MainText = styled.Text`
  color: #373737;
  font-size: 20px;
  font-weight: bold;
  margin: 15px 0;
`;
const MissionList = styled.View`
  background-color: #ffffff;
`;
const ScrollViews = styled.ScrollView``;
const HomeTab = () => {
  const [mission, setMission] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const clickMission1 = () => setMission(false);
  const clickMission2 = () => setMission(true);
  return (
    // 미션 중 화면 채택시 Container 자체를 바꿔야 할 듯
    <Container>
      <Categories />
      <AboutMission>
        <TouchableOpacity onPress={clickMission1}>
          <Text style={{color: mission ? 'black' : '#38a6c0'}}>예정 미션</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clickMission2}>
          <Text style={{color: mission ? '#38a6c0' : 'black'}}>진행중</Text>
        </TouchableOpacity>
      </AboutMission>
      <MainText>{mission ? '진행중 | 0' : '예정 미션 | 0'}</MainText>
      {/* 미션 | 뒤에 0은 나중에 데이터를 받아서 count 값을 넣어주면 될듯 */}

      {/* 디비 데이터 받아와서 카테고리, 미션 이름을 뿌려주면 될 것 같다? */}
      {mission ? (
        <OngoingBox />
      ) : (
        <ScrollViews>
          <MissionList>
            <MissionBox
              category="✏️수업"
              missionName="그만듣고싶다"></MissionBox>
            <MissionBox category="🏫과제" missionName="캡스톤"></MissionBox>
            <MissionBox
              category="💪운동"
              missionName="하체하는 날"></MissionBox>
            <MissionBox category="🐕산책" missionName="휴식휴식"></MissionBox>
          </MissionList>
        </ScrollViews>
      )}
      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {/* <Text style={styles.modalText}>asd</Text */}
              <View>
                <TextInput />
                <TextInput />
              </View>
              <View style={{flexDirection: 'row'}}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>확인</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>취소</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <AddMissionBtn onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle" size={50} color={'#0891b2'} />
      </AddMissionBtn>
    </Container>
  );
};
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
export default HomeTab;
