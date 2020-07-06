import React, { Component } from 'react'
import LoginScreen from './LoginScreen'
import SignupScreen from './SignupScreen'
import { connect } from 'react-redux'
import { sideMenu } from '../../configs/menu/sideMenu'
import Navigator from '../../utils/Navigator'

class AuthScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNavigated: false,
      showLoginScreen: true,
    };
  }

  render() {
    const { showLoginScreen, isNavigated } = this.state
    const { authenticated } = this.props.auth
    if (authenticated) {
      if (!isNavigated) {
        Navigator.setRoot({
          sideMenu
        })
        this.setState({ isNavigated: true })
      }
      return <></>;
    }
    return (
      <>
        {showLoginScreen ? <LoginScreen onNavigateToSignup={() => this.setState({ showLoginScreen: false })} /> : <SignupScreen onNavigateToLogin={() => this.setState({ showLoginScreen: true })} />}
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, null)(AuthScreen);