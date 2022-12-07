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
import {useAuth} from '../../providers/AuthProvider';

import {addFriend, deleteFriend} from '../../store/action';
import Colors from '../../utils/Colors';

export default function FriendCandidateModal({
  navigation,
  followModalVisible,
  setFollowModalVisible,
}) {
  const {user} = useAuth();
  const dispatch = useDispatch();
  const candidates = useSelector(store => store.friendReducer.candidate);
  const friendList = useSelector(store => store.friendReducer.data);
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
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        style={styles.followButton}
                        onPress={async () => {
                          console.log({
                            owner_id: user.id,
                            friendId: item._id,
                            isAccepted: true,
                          });
                          const {friendInfo, myFriendCurState} =
                            await user.callFunction('friend/resToBeFriend', {
                              owner_id: user.id,
                              friendId: item._id,
                              isAccepted: true,
                            });
                          // console.log(friendInfo, myFriendCurState);

                          const state = myFriendCurState.isNowUsingProhibitedApp
                            ? myFriendCurState.isNowGivingUp
                              ? 'unlock_quit'
                              : 'quit'
                            : myFriendCurState.isNowDoingMission
                            ? 'lock'
                            : 'none';

                          const friend = {
                            _id: friendInfo._id,
                            nickname: friendInfo.nickname,
                            state,
                          };
                          // console.log(friend);
                          dispatch(addFriend({data: friend}));
                          dispatch(
                            deleteFriend({
                              candidate: candidates.filter(
                                el => el._id != item._id,
                              ),
                            }),
                          );

                          SnackBar.show({
                            text: `${item.nickname} 친구를 팔로우하였습니다. `,
                            duration: SnackBar.LENGTH_SHORT,
                          });
                        }}>
                        <Text style={styles.followButtonText}>팔로우</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.followButton}
                        onPress={async () => {
                          await user.callFunction('friend/resToBeFriend', {
                            owner_id: user.id,
                            friendId: item._id,
                            isAccepted: false,
                          });

                          dispatch(
                            deleteFriend({
                              candidate: candidates.filter(
                                el => el._id != item._id,
                              ),
                            }),
                          );

                          SnackBar.show({
                            text: `${item.nickname} 친구를 거절하였습니다. `,
                            duration: SnackBar.LENGTH_SHORT,
                          });
                        }}>
                        <Text style={styles.followButtonText}>거절</Text>
                      </TouchableOpacity>
                    </View>
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
    marginRight: 5,
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
