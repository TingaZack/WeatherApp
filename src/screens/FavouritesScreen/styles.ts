import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: '100%',
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginVertical: 5,
  },
  favButton: {
    height: 50,
    width: 50,
    backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherConditionImg: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  item: {
    backgroundColor: 'lightblue',
    borderRadius: 5,
    padding: 20,
    margin: 10,
  },
});
export default styles;
