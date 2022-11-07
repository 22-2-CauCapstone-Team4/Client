import React from 'react';
import {Text, Modal, View, Pressable, TextInput} from 'react-native';
import {styles} from '../../utils/styles';
import {useNavigation} from '@react-navigation/native';
export default function CreateMissionModal({
  navigation,
  modalVisible,
  setModalVisible,
}) {
  // console.log(navigation);
  return (
    <>
      {modalVisible ? (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            console.log(navigation);
            navigation.navigate('Login');
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
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
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
      ) : null}
    </>
  );
}
