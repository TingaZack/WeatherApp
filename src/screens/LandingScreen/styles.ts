import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  weatherContainer: {
    flex: 3,
    // backgroundColor: '#54717A',
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
    alignItems: 'center',
    padding: 16,
  },
  p: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  favourites: {
    backgroundColor: 'whitesmoke',
    position: 'absolute',
    height: 50,
    borderRadius: 100,
    top: 55,
    right: 16,
    flexDirection: 'row',
    // width: 200,
  },
  favBtns: {
    shadowColor: '#d3d3d3', // IOS
    shadowOffset: {height: 1, width: 1}, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: '#fff',
    elevation: 1, // Android
    width: 50,
    // marginLeft: 16,
    height: 50,
    // backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lastUpdatedText: {
    color: 'white',
    position: 'absolute',
    bottom: 8,
    right: 16,
  },
  weatherIcon: {
    height: 30,
    width: 30,
  },
  favIcon: {
    width: 30,
    height: 30,
  }
});

export default styles;
