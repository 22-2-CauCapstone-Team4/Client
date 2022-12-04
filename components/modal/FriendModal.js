import React, {useState} from 'react';
import {
  Text,
  Modal,
  View,
  Pressable,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';

export default function FriendModal({
  navigation,
  modalVisible,
  setModalVisible,
}) {
  const dispatch = useDispatch();
  const userList = useSelector(store => store.userReducer.data);
  const friendList = useSelector(store => store.friendReducer.data);
  const [searchText, setSearchText] = useState('');
  const [result, setResult] = useState('');
  // console.log(userList);

  return (
    <>
      {modalVisible ? (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.scrollView}>
                <Text style={[styles.friendText, {marginBottom: 10}]}>
                  친구 추가
                </Text>
                <View style={styles.searchBarView}>
                  <TextInput
                    style={styles.searchBar}
                    placeholder={'닉네임을 검색하세요'}
                    placeholderTextColor={Colors.GREY}
                    onChangeText={text => {
                      setSearchText(text);
                    }}></TextInput>
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => {
                      setResult(searchText);
                    }}>
                    <Icon name={'search'} size={20} color={'black'}></Icon>
                  </TouchableOpacity>
                </View>
                <View style={styles.lineStyle}></View>
                {result !== '' ? (
                  userList.filter(user => user.nickname.indexOf(result) != -1)
                    .length > 0 ? (
                    userList
                      .filter(user => user.nickname.indexOf(result) != -1)
                      .map(data => (
                        <View
                          key={data._id}
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
                            <Text style={{color: 'black'}}>
                              {data.nickname}
                            </Text>
                          </View>
                          {friendList.map(f => f._id).indexOf(data._id) !=
                          -1 ? (
                            <TouchableOpacity
                              style={styles.followButton}
                              onPress={() => {
                                // const temp =
                                //   candidates[
                                //     candidates.map(cd => cd._id).indexOf(item._id)
                                //   ];
                                // dispatch(addFriend(temp));
                                // SnackBar.show({
                                //   text: `\'${item.nickname}\'님을 친구로 추가했습니다.`,
                                //   duration: SnackBar.LENGTH_SHORT,
                                // });
                              }}>
                              <Text style={styles.followButtonText}>
                                팔로우
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      ))
                  ) : (
                    <Text style={{color: Colors.GREY, fontSize: 20}}>
                      목록 없음
                    </Text>
                  )
                ) : null}
              </View>
              <View style={{flexDirection: 'row'}}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setSearchText('');
                    setResult('');
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={styles.textStyle}>취소</Text>
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
  searchBarView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  searchButton: {
    borderColor: Colors.MAIN_COLOR,
    borderWidth: 0.5,
    borderRadius: 5,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.MAIN_COLOR_INACTIVE,
    color: Colors.MAIN_COLOR,
  },
  searchBar: {
    border: 1,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    borderRadius: 10,
    fontSize: 12,
    paddingVertical: 0,
    marginRight: 15,
    width: '80%',
    height: 33,
    color: Colors.MAIN_COLOR,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
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
    height: '60%',
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
