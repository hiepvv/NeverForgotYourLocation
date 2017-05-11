import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ViewPagerAndroid,
  Image,
  Text,
  TouchableNativeFeedback
} from 'react-native'
import { NavigationActions } from 'react-navigation'
import Spinner from 'react-native-spinkit'
import Helpers from './src/helpers/handleData'

import SwitchButton from './SwitchButton'
import ViewFriends from './ViewFriends'
import ViewLocations from './ViewLocations'

const goToHome = NavigationActions.navigate({
  routeName: 'Home'
})

const styles = StyleSheet.create({
  backButton: {
    flex: 1,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mainContainer: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewPagerContainer: {
    flex: 1
  },
  switchButtonContainer: {
    position: 'absolute',
    top: 0,
    bottom: 15,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
})

export default class VisitedLocations extends Component {
  constructor(props) {
    super(props)
    this.leftPageState = 0
    this.rightPageState = 1
    this.state = {
      leftButtonBackgroundColor: '#FD482E',
      rightButtonBackgroundColor: '#D7D8DA',
      leftButtonTextColor: '#ffffff',
      rightButtonTextColor: '#FD482E',
      listFriendData: null,
      listAnnotationData: null,
      coordinate: null
    }
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'VISITED LOCATIONS',
      headerLeft: <TouchableNativeFeedback
        onPress={() => navigation.dispatch(goToHome)}
        background={TouchableNativeFeedback.Ripple('#adadad', true)}>
        <View style={styles.backButton}>
          <Image source={require('./src/assets/imgs/home.png')} />
        </View>
      </TouchableNativeFeedback>,
      headerRight: <TouchableNativeFeedback
        onPress={() => navigation.dispatch(goToHome)}
        background={TouchableNativeFeedback.Ripple('#adadad', true)}>
        <View style={styles.backButton}>
          <Image source={require('./src/assets/imgs/search.png')} />
        </View>
      </TouchableNativeFeedback>
    }
  }
  changeLeftButtonState() {
    this.setState({
      leftButtonBackgroundColor: '#FD482E',
      rightButtonBackgroundColor: '#D7D8DA',
      leftButtonTextColor: '#ffffff',
      rightButtonTextColor: '#FD482E'
    })
  }
  changeRightButtonState() {
    this.setState({
      leftButtonBackgroundColor: '#D7D8DA',
      rightButtonBackgroundColor: '#FD482E',
      leftButtonTextColor: '#FD482E',
      rightButtonTextColor: '#ffffff'
    })
  }
  onPageSelected = (e) => {
    if (e.nativeEvent.position === this.leftPageState) {
      this.changeLeftButtonState()
    } else {
      this.changeRightButtonState()
    }
  }
  onListViewElementSelected(coordinate) {
    this.setState({ coordinate })
    this.changeButtonStateWhenClick(false)
  }
  changeButtonStateWhenClick(buttonLeftState) {
    if (buttonLeftState) {
      this.viewPager.setPage(this.leftPageState)
      this.changeLeftButtonState()
    } else {
      this.viewPager.setPage(this.rightPageState)
      this.changeRightButtonState()
    }
  }
  getFriendData = async () => {
    let friends = await Helpers.getAllFriends()
    return friends
  }
  getAnnotationData = async () => {
    let annotations = await Helpers.getAllAnnotations()
    return annotations
  }
  componentDidMount() {
    this.getFriendData().then((listFriendData) =>
      this.setState({
        listFriendData: listFriendData,
        coordinate: listFriendData[0].coordinate
      }))
      .then(() => this.getAnnotationData())
      .then((listAnnotationData) => this.setState({ listAnnotationData }))
      // TODO
      .catch((err) => { })
  }
  render() {
    if ((!this.state.listFriendData) || (!this.state.listAnnotationData) || (!this.state.coordinate)) {
      return (
        <View style={styles.loadingContainer}>
          <Spinner size={100} color={'#358ff4'} type={'Bounce'} />
        </View>
      )
    } else {
      return (
        <View style={styles.mainContainer}>
          <ViewPagerAndroid style={styles.viewPagerContainer}
            ref={(viewPager) => { this.viewPager = viewPager }}
            initialPage={this.leftPageState}
            onPageSelected={this.onPageSelected}>
            <View>
              <ViewFriends listFriendData={this.state.listFriendData}
                onListViewElementSelected={this.onListViewElementSelected.bind(this)}
              />
            </View>
            <View>
              <ViewLocations coordinate={this.state.coordinate}
                annotations={this.state.listAnnotationData}
              />
            </View>
          </ViewPagerAndroid>
          <View style={styles.switchButtonContainer}>
            <SwitchButton
              leftButtonBackgroundColor={this.state.leftButtonBackgroundColor}
              rightButtonBackgroundColor={this.state.rightButtonBackgroundColor}
              leftButtonTextColor={this.state.leftButtonTextColor}
              rightButtonTextColor={this.state.rightButtonTextColor}
              onSwitchButtonPress={this.changeButtonStateWhenClick.bind(this)}
            />
          </View>
        </View>
      )
    }
  }
}