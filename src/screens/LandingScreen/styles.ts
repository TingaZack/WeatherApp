import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  weatherContainer: {
    flex: 3,
    backgroundColor: '#54717A',
  },
  weatherTemp: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempP: {
    fontSize: 70,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  weatherCond: {
    textTransform: 'uppercase',
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
  },
  weatherListContainer: {
    flex: 3,
  },
  listItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  p: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  }
});

export default styles;
