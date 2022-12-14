import {StyleSheet} from 'react-native';
import Colors from './Colors';
export const styles = StyleSheet.create({
  // 중앙 정렬
  makeCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 탭에 있는 버튼 스타일(로그아웃, 공간 추가)
  tabButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },

  // 탭 전체 화면 스타일
  tabContainer: {
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  modalView: {
    margin: 20,
    width: '90%',
    height: '80%',
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

  // 모달 버튼 모양
  button: {
    borderRadius: 20,
    padding: 15,
    elevation: 2,
    margin: 5,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },

  //모달 버튼 색깔
  buttonClose: {
    backgroundColor: Colors.MAIN_COLOR_INACTIVE,
  },

  // 모달 버튼 텍스트 스타일
  textStyle: {
    color: Colors.MAIN_COLOR,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // 모달 텍스트
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  // 텍스트 검은색
  blackText: {
    color: 'black',
    fontSize: 20,
    paddingTop: 40,
  },

  // 금지 앱 설정 화면에서 앱 목록 컨테이너 스타일
  appListStyle: {},
});
