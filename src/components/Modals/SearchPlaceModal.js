import React, { Component } from 'react'
import { FlatList, Text, StyleSheet, Keyboard } from 'react-native'
import Geocoder from 'react-native-geocoder'
import { SearchBar, ListItem, Icon } from 'react-native-elements'
import CustomIcon from '../CustomIcon'
import { connect } from 'react-redux'
import Navigator from '../../utils/Navigator'
import { changeLocation } from '../../redux/optionsRedux/actions'

class SearchPlaceModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      searching: false,
      searchStarted: false,
      address: "",
      positions: []
    }
  }

  componentDidUpdate(prevProps) {
    const { address } = this.props.options.userLocation
    if (prevProps.options.userLocation.address !== address) {
      this.setState({ address })
    }
  }

  handleChangeText = address => {
    this.setState({ address }, () => this.handleSearchLocation())
  }

  handleSearchLocation = async () => {
    try {
      let { address, positions } = this.state
      this.setState({ positions: [], searching: true, searchStarted: true })
      if (address.length > 10) {
        positions = await Geocoder.geocodeAddress(address)
      }
      this.setState({ positions, searching: false })
    } catch (error) {
    }
  }

  handlePlaceSelected = place => {
    const location = {
      address: place.formattedAddress.replace('Unnamed Road, ', ''),
      coords: place.position
    }
    this.setState({ address: location.address })
    this.props.onChangeLocation(location)
    this.handleCloseModal()
  }

  handleCloseModal = () => {
    Keyboard.dismiss()
    Navigator.dismissModal(this.props.componentId)
  }

  render() {
    const { searchStarted, searching, address, positions } = this.state
    const { app: { backgroundColor, textColor } } = this.props
    return (
      <>
        <SearchBar
          platform="android"
          value={address || ""}
          autoFocus
          blurOnSubmit
          showLoading={searching}
          onChangeText={address => this.handleChangeText(address)}
          autoCapitalize="words"
          onSubmitEditing={this.handleSearchLocation}
          inputStyle={styles.input}
          containerStyle={[styles.inputContainer, { backgroundColor: backgroundColor }]}
          searchIcon={<CustomIcon onPress={this.handleCloseModal}>
            <Icon type="feather" name="arrow-left" color={textColor} />
          </CustomIcon>}
          cancelIcon={<CustomIcon onPress={this.handleCloseModal}>
            <Icon type="feather" name="arrow-left" color={textColor} />
          </CustomIcon>}
          clearIcon={<CustomIcon onPress={() => this.setState({ address: "", positions: [] })} >
            <Icon type="MaterialCommunityIcons" name="close" color={textColor} />
          </CustomIcon>}
        />
        {(!searching && searchStarted && address.length > 10 && positions.length < 1) ?
          <Text style={styles.notFoundMessage}
          >
            Không tìm thấy kết quả
          </Text> :
          <FlatList
            data={positions}
            renderItem={({ item }) =>
              <ListItem
                title={item.formattedAddress.replace('Unnamed Road, ', '')}
                onPress={() => this.handlePlaceSelected(item)}
                bottomDivider
              />}
            keyExtractor={(item, index) => index}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        }
      </>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    height: 60,
    paddingVertical: 0,
    marginHorizontal: -8
  },
  input: {
    fontSize: 16,
    color: "white",
    marginLeft: 0,
    marginRight: 0
  },
  notFoundMessage: {
    textAlign: "center",
    fontSize: 16,
    paddingVertical: 15
  }
})

const mapStateToProps = state => {
  return {
    app: state.app,
    options: state.options
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onChangeLocation: location => dispatch(changeLocation(location))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPlaceModal)