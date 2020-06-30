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
      showLoginScreen: true,
    };
  }

  render() {
    const { showLoginScreen } = this.state
    const { authenticated } = this.props.auth
    if (authenticated) {
      Navigator.setRoot({
        sideMenu
      })
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