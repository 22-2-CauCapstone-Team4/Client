import React, {useState} from 'react';
import styled from 'styled-components';
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
import {StyleSheet} from 'react-native';
import Categories from '../Categories';
import GoalBox from '../box/GoalBox';
import SpaceBox from '../box/SpaceBox';
import CreateMissionModal from '../modal/CreateMissionModal';

const AboutMission = styled.View`
  border: 1px solid #f1f1f1;
  border-radius: 600px;
  margin: 10px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: #fcfcfc;
  height: 30px;
`;
const AddMissionBtn = styled.Pressable`
  position: absolute;
  bottom: 5%;
  right: 5%;
  border-radius: 600px;
`;
const Container = styled.View`
  height: 100%;
  background-color: white;
  padding: 20px;
`;
const MainText = styled.Text`
  color: #373737;
  font-size: 20px;
  font-weight: bold;
  margin: 15px 0;
`;
const GoalList = styled.View`
  background-color: #ffffff;
`;
const GoalTab = ({navigation}) => {
  const [mission, setMission] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const clickMission1 = () => setMission(false);
  const clickMission2 = () => setMission(true);

  return (
    <Container>
      <Categories />
      <AboutMission>
        <TouchableOpacity onPress={clickMission1}>
          <Text style={{color: mission ? 'black' : '#38a6c0'}}>예정 미션</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clickMission2}>
          <Text style={{color: mission ? '#38a6c0' : 'black'}}>미션 공간</Text>
        </TouchableOpacity>
      </AboutMission>
      <MainText>{mission ? '미션 공간 | 0' : '예정 미션 | 0'}</MainText>

      <ScrollView>
        <GoalList>
          <GoalBox category="✏️수업" missionName="그만듣고싶다"></GoalBox>
          <SpaceBox category="✏️수업" missionName="학교 강의실"></SpaceBox>
        </GoalList>
      </ScrollView>

      {/* modal */}
      <View style={styles.centeredView}>
        <CreateMissionModal
          navigation={navigation}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}></CreateMissionModal>
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

export default GoalTab;
