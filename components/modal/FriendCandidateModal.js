// 친구 추가 모달

import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Alert,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import SnackBar from 'react-native-snackbar';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import {addFriend} from '../../store/action';
import Colors from '../../utils/Colors';

export default function FriendCandidateModal({
  navigation,
  followModalVisible,
  setFollowModalVisible,
}) {
  const dispatch = useDispatch();
  const candidates = useSelector(store => store.friendReducer.candidate);
  return (
    <>
      {followModalVisible ? (
        <Modal
          animationType="fade"
          transparent={true}
          visible={followModalVisible}
          onRequestClose={() => {
            setFollowModalVisible(!followModalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.scrollView}>
                <Text style={styles.friendText}>팔로우</Text>
                <View style={styles.lineStyle}></View>
                {candidates.map(item => (
                  <View
                    key={item._id}
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'space-between',
                      marginVertical: 6,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Icon
                        name={'person'}
                        color="green"
                        size={20}
                        style={{marginRight: 5}}></Icon>
                      <Text style={{color: 'black'}}>{item.nickname}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.followButton}
                      onPress={() => {
                        const temp =
                          candidates[
                            candidates.map(cd => cd._id).indexOf(item._id)
                          ];
                        dispatch(addFriend(temp));
                        SnackBar.show({
                          text: `\'${item.nickname}\'님을 친구로 추가했습니다.`,
                          duration: SnackBar.LENGTH_SHORT,
                        });
                      }}>
                      <Text style={styles.followButtonText}>팔로우</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <View style={{flexDirection: 'row'}}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setFollowModalVisible(!followModalVisible);
                  }}>
                  <Text style={styles.textStyle}>닫기</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  followButton: {
    backgroundColor: Colors.MAIN_COLOR_INACTIVE,
    width: 55,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  followButtonText: {
    color: Colors.MAIN_COLOR,
    fontSize: 12,
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
    backgroundColor: Colors.MAIN_COLOR_INACTIVE,
  },
  textStyle: {
    color: Colors.MAIN_COLOR,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lineStyle: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: Colors.MAIN_COLOR,
    margin: 10,
  },
  friendText: {
    color: 'black',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
  },
  place: {
    width: 250,
    height: 40,
    backgroundColor: '#0891b2',
    borderRadius: 600,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  scrollView: {
    alignItems: 'center',
    width: '100%',
    height: '80%',
    borderRadius: 20,
    borderColor: 'grey',
    borderWidth: 0.5,
    padding: 10,
    marginBottom: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: '90%',
    height: '50%',
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
});
