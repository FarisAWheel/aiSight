import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';
import WelcomePage from './pages/welcome_page';
import BluetoothPage from './pages/Bluetooth_connect_page';
import HomePage from './pages/home_page';
import HistoryPage from './pages/peopleHistory_page';
import CameraPage from './pages/camera_Steam';
import HelpPage from "./pages/help_page";

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown: false}}>
                <Stack.Screen name="Welcome" component={WelcomePage} />
                <Stack.Screen name="Bluetooth" component={BluetoothPage} />
                <Stack.Screen name="Home" component={HomePage} />
                <Stack.Screen name="PeopleHistory" component={HistoryPage} />
                <Stack.Screen name="CameraFeed" component={CameraPage} />
                <Stack.Screen name="Help" component={HelpPage} />
            </Stack.Navigator>
        </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
