import React from "react";

import {
  Button, View, Text
} from "react-native";

import LoginView from "./LoginView";
import SignupView from "./SignupView";
import ProfileView from "./ProfileView";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import TodayView from "./TodayView";
import ExerciseView from "./ExercisesView";
import MealView from "./MealView";
import Icon from "react-native-vector-icons/FontAwesome5";

class NestedNav extends React.Component {
  render() {
    const Tab = createBottomTabNavigator();

    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Today') {
              iconName = 'calendar-day';
            } else if (route.name === 'Exercises') {
              iconName = 'dumbbell';
            } else if (route.name === 'Me') {
              iconName = "user"
            } else if (route.name === "Meals") {
              iconName = "hamburger"
            }

            // You can return any component that you like here!
            return <Icon
              name={iconName}
              size={size}
              color={color}
            />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Today" options={{
          title: "Today",
          headerShown: false,
        }}>
          {(props) => (
            <TodayView
              {...props}
              username={this.props.username}
              accessToken={this.props.accessToken}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Exercises" options={{
          title: "Exercises",
          headerShown: false,
        }}>
          {(props) => (
            <ExerciseView
              {...props}
              username={this.props.username}
              accessToken={this.props.accessToken}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Meals" options={{
          title: "Meals",
          headerShown: false,
        }}>
          {(props) => (
            <MealView
              {...props}
              username={this.props.username}
              accessToken={this.props.accessToken}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Me" options={{
          title: "Me",
          headerShown: false,
        }}>
          {(props) => (
            <ProfileView
              {...props}
              username={this.props.username}
              accessToken={this.props.accessToken}
              revokeAccessToken={this.props.revokeAccessToken}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    )
  }
}

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      accessToken: undefined,
      username: undefined,
    };

    this.login = this.login.bind(this);
    this.revokeAccessToken = this.revokeAccessToken.bind(this);
  }

  /**
   * A callback function to store username and accessToken in the state
   * This callback function is passed to `LoginView`
   *
   * @param {string} username
   * @param {string} accessToken
   */
  login(username, accessToken) {
    this.setState({
      username: username,
      accessToken: accessToken,
    });
  }

  /**
   * Revokes the access token in the state, so that the user is logged out
   *
   */
  revokeAccessToken() {
    this.setState({
      accessToken: undefined,
    });
  }

  /**
   * Defines a stack navigator for three screens, LoginView, SignupView, and ProfileView.
   *
   * We define the navigator to show only LoginView and SignupView if user is not logged in ('this.state.accessToken' does not exist)
   * and show ProfileView if the user is logged in (this.state.accessToken exists)
   *
   * See https://reactnavigation.org/docs/auth-flow/ for more details on the authentication flow.
   *
   * @returns `NavigationContainer`
   */
  render() {
    const AuthStack = createStackNavigator();

    return (
      <NavigationContainer>
        <AuthStack.Navigator>
          {!this.state.accessToken ? (
            <>
              <AuthStack.Screen
                name="SignIn"
                options={{
                  title: "Fitness Tracker Welcome",
                }}
              >
                {(props) => <LoginView {...props} login={this.login} />}
              </AuthStack.Screen>
              <AuthStack.Screen
                name="SignUp"
                options={{
                  title: "Fitness Tracker Signup",
                }}
              >
                {(props) => <SignupView {...props} />}
              </AuthStack.Screen>
            </>
          ) : (
            // Add a tab navigator in here somehow
            <AuthStack.Screen
              name="FitnessTracker"
              options={{
                title: "Fitness Tracker",
                headerRight: () => (
                  <Button
                    onPress={() => this.revokeAccessToken()}
                    title="Sign Out"
                  />
                )
              }}
            // Look at https://reactnavigation.org/docs/nesting-navigators
            >
              {(props) => (
                <NestedNav
                  {...props}
                  username={this.state.username}
                  accessToken={this.state.accessToken}
                  revokeAccessToken={this.revokeAccessToken}
                />
              )}
              {/* {(props) => (
                    <ProfileView
                      {...props}
                      username={this.state.username}
                      accessToken={this.state.accessToken}
                      revokeAccessToken={this.revokeAccessToken}
                    />
              )} */}
            </AuthStack.Screen>
          )}
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
