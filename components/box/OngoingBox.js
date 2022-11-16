import React from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity, Text} from 'react-native';
import {StyleSheet} from 'react-native';
const Container = styled.View`
  height: 100%;
  background-color: white;
  padding: 20px;
`;
const Info1 = styled.View`
  align-items: center;
`;
const Info2 = styled.View`
  align-items: center;
  margin-top: 30px;
`;
const Btn = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
`;
const OngoingBox = () => {
  return (
    // 운동, 학교강의, 전체, 친구, 경과시간, 사용시간 등 데이터 받아서 넣으면 될듯
    <Container>
      <Info1>
        <Text style={styles.emoji}>💪</Text>
        <Text>
          <Text style={styles.type1}>운동</Text> {'  '}|{'  '}
          <Text style={styles.type2}>학교 강의</Text>
        </Text>
        <Text style={styles.info1}>
          전체 <Text>123</Text>명 · 친구 <Text>3</Text>명이 함께함
        </Text>
      </Info1>
      <Info2>
        <Text style={styles.info2}>
          🔒 <Text style={{fontWeight: '500'}}>1:30:23</Text>{' '}
          <Text style={{fontSize: 20}}>경과</Text>
        </Text>
        <Text style={styles.info3}>
          📵 <Text style={{fontWeight: '500'}}>0:17:23 </Text>
          <Text style={{fontSize: 20}}>사용</Text>
        </Text>
        <Text style={styles.info4}>
          🕒 <Text style={{fontWeight: 'bold'}}>3시간</Text>{' '}
          <Text style={{fontWeight: 'bold'}}>15분 뒤 · </Text>🦵{' '}
          <Text style={{fontWeight: 'bold'}}>3km 이동 시 </Text>
          <Text style={{fontSize: 17, textAlign: 'center'}}>
            잠금이 해제될 수 있습니다.
          </Text>
        </Text>
      </Info2>
      <Btn>
        <TouchableOpacity style={styles.btn1}>
          <Text style={styles.btnStyle}>10분 휴식</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn2}>
          <Text style={styles.btnStyle}>포기</Text>
        </TouchableOpacity>
      </Btn>
    </Container>
  );
};

const styles = StyleSheet.create({
  type1: {
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
  },
  type2: {
    fontSize: 20,
    color: 'black',
  },
  emoji: {
    fontSize: 30,
    color: 'yellow',
  },
  title: {
    color: 'black',
  },
  info1: {
    color: 'black',
    marginTop: 15,
  },
  info2: {
    color: 'black',
    fontSize: 30,
  },
  info3: {
    color: 'black',
    fontSize: 30,
  },
  info4: {
    color: 'black',
    fontSize: 20,
    padding: 20,
    textAlign: 'center',
  },
  btn1: {
    backgroundColor: '#cce7ee',
    padding: 10,
    borderRadius: 5,
  },
  btn2: {
    backgroundColor: '#cce7ee',
    padding: 10,
    borderRadius: 5,
  },
  btnStyle: {
    color: '#8ccbda',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default OngoingBox;
