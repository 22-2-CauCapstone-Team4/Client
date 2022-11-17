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
import GoalCategoryBox from '../box/GoalCategoryBox';
import GoalBox from '../box/GoalBox';
import SpaceBox from '../box/SpaceBox';
import CreateMissionModal from '../modal/CreateMissionModal';
import {useDispatch, useSelector} from 'react-redux';
import {addMission, deleteMission, selectMission} from '../../store/action';
const GoalTab = ({navigation}) => {
  const dispatch = useDispatch();
  const missionData = useSelector(store => store.missionReducer.missionData);
  const categoryList = useSelector(store => store.categoryReducer.data);
  // console.log(categoryList);
  const categoryFilter = useSelector(store => store.categoryReducer.filter);
  const missionNumber = useSelector(
    store => store.missionReducer.missionData,
  ).length;
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <Container>
      <Categories />
      <ScrollView>
        <GoalList>
          {categoryFilter === '⭐ 전체 목표' ? (
            <View>
              <GoalCategoryBox
                category="⭐ 전체 목표"
                number={missionNumber}></GoalCategoryBox>
              {categoryList.map(c => {
                return (
                  <GoalCategoryBox
                    key={c._id}
                    category={c.name}
                    number={
                      missionData.filter(el => el.category === c.name).length
                    }></GoalCategoryBox>
                );
              })}
            </View>
          ) : (
            missionData
              .filter(el => el.category === categoryFilter)
              .map(mission => (
                <GoalBox key={mission.id} mission={mission}></GoalBox>
              ))
          )}
        </GoalList>
      </ScrollView>
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
const GoalList = styled.View`
  background-color: #ffffff;
`;

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
