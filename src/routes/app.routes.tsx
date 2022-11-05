import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NewPool } from "../screens/NewPool";
import { Pools } from "../screens/Pools";
import { FindPool } from "../screens/FindPool";
import { PlusCircle, SoccerBall } from 'phosphor-react-native';
import { useTheme } from 'native-base';
import { Platform } from "react-native";

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
    const { colors, sizes } = useTheme();
    const size = sizes[6];

    return (
        <Navigator screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.yellow[500],
            tabBarInactiveTintColor: colors.gray[300],
            tabBarStyle: {
                position: 'absolute',
                height: sizes[22],
                borderTopWidth: 0,
                backgroundColor: colors.gray[800]
            },
            tabBarItemStyle: {
                position: 'relative',
                top: Platform.OS === 'android' ? -10 : 0
            }
        }}>
            <Screen
                options={{
                    tabBarIcon: ({ color }) => <PlusCircle color={color} size={size} />,
                    tabBarLabel: 'Novo Boloão'
                }}
                name="new"
                component={NewPool} />

            <Screen
                options={{
                    tabBarIcon: ({ color }) => <SoccerBall color={color} size={size} />,
                    tabBarLabel: 'Meus Bolões'
                }}
                name="pools"
                component={Pools} />

            <Screen
                options={{tabBarButton: () => null}}
                name="findPool"
                component={FindPool} />
        </Navigator>
    )

}