import { StyleSheet } from 'react-native';
import { APP_COLOR } from '../utils/AppSettings';

export const styles = StyleSheet.create({
  title: {
    color: 'red',
  },
  mainView: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    // backgroundColor: 'green'
  },
  rowOfBookView: {
    marginTop: 15,
  },
  listRowOfBookView: {
    // marginRight: 15
  },
  imageBook: {
    width: '97%',
    height: 223,
    alignSelf: 'center',
  },
  textBookTitle: {
    fontSize: 18,
    fontFamily: 'Cabin',
    textAlign: 'center',
  },
  textBookAuthor: {
    color: 'grey',
  },
  ratingView: {
    flexDirection: 'row',
  },
  ratingStarView: {
    flexDirection: 'row',
  },
  textStar: {
    fontSize: 12,
    color: 'orange',
  },
  textNumberRating: {
    color: 'grey',
    fontSize: 12,
    marginLeft: 10,
  },
  textBookDescription: {
    color: '#7f7f7f',
  },
  textSmallGreyColor: {
    color: '#7f7f7f',
  },
  btn_text: {
    color: '#fff',
  },
  textGeneralFont: {
    fontFamily: 'SVN-ProximaNova',
  },
  container: {
    padding: 20,
  },
  titleContainer: {
    marginLeft: -20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    color: APP_COLOR === '#ffffff' || APP_COLOR === '#fff' ? 'black' : 'white',
    fontFamily: 'SVN-ProximaNova',
  },
  formTitle: {
    fontSize: 20,
    paddingVertical: 5,
    fontWeight: '200',
  },
  label: {
    fontSize: 16
  },
  textInput: {
    borderWidth: 1,
    borderColor: APP_COLOR,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
  },
  formControl: {
    flexDirection: 'row',
    marginTop: 10,
  },
  pavicy: {
    marginTop: 20,
    marginVertical: 10,
    marginBottom: 50,
  },
  btnContainer: {
    marginTop: 30,
    marginBottom: 5,
  },
  btn: {
    marginRight: 10,
    borderWidth: 1,
    borderColor: APP_COLOR,
    borderRadius: 2,
    padding: 15,
    minWidth: 100,
  },
  btnBlue: {
    backgroundColor: '#41B8C1',
  },
  contentCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  textWhite: {
    color: '#FFF',
  },
  textBlue: {
    color: '#41B8C1',
  },
});