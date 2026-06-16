import { Tabs } from "expo-router";
import { Activity, Heart, Play } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet } from "react-native";
import { Colors, FontSize, Radius } from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.whiteMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              tint="dark"
              intensity={80}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <></>
          ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Matchs",
          tabBarIcon: ({ color, size }) => <Activity size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="streaming"
        options={{
          title: "Streaming",
          tabBarIcon: ({ color, size }) => <Play size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoris",
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Platform.OS === "ios" ? "transparent" : Colors.nightBlueDark,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 85,
    paddingBottom: 28,
    paddingTop: 8,
    position: "absolute",
    bottom: 0,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
