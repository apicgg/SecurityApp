import { OFFSET, TIME, codeLength } from "@/constants/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const Page = () => {
  const [code, setCode] = useState<number[]>([]);
  const router = useRouter();

  const offset = useSharedValue(0);
  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  const onNumberPress = (number: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCode([...code, number]);
  };

  const onNumberDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCode(code.slice(0, -1));
  };

  const onBiometricPress = async () => {
    const { success } = await LocalAuthentication.authenticateAsync();

    if (success) {
      router.replace("/");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  useEffect(() => {
    if (code.length === 6) {
      if (code.join("") === "111111") {
        router.replace("/");
        setCode([]);
      } else {
        offset.value = withSequence(
          withTiming(-OFFSET, { duration: TIME / 2 }),
          withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
          withTiming(0, { duration: TIME / 2 })
        );

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

        setCode([]);
      }
    }
  }, [code]);

  return (
    <SafeAreaView>
      <Text style={styles.greeting}>Welcome back, Anurag</Text>

      <Animated.View style={[styles.codeView, animationStyle]}>
        {codeLength.map((_, index) => (
          <View
            key={index}
            style={[
              styles.codeEmpty,
              {
                backgroundColor: code[index] ? "#3d38ed" : "#d8dce2",
              },
            ]}
          />
        ))}
      </Animated.View>

      <View style={styles.numbersView}>
        <View style={styles.numbersRow}>
          {[1, 2, 3].map((number) => (
            <TouchableOpacity
              key={number}
              onPress={() => onNumberPress(number)}
            >
              <Text style={styles.number}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.numbersRow}>
          {[4, 5, 6].map((number) => (
            <TouchableOpacity
              key={number}
              onPress={() => onNumberPress(number)}
            >
              <Text style={styles.number}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.numbersRow}>
          {[7, 8, 9].map((number) => (
            <TouchableOpacity
              key={number}
              onPress={() => onNumberPress(number)}
            >
              <Text style={styles.number}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.lastNumberRow}>
          <TouchableOpacity onPress={onBiometricPress}>
            <MaterialCommunityIcons
              name="face-recognition"
              size={26}
              color="black"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onNumberPress(0)}>
            <Text style={styles.number}>0</Text>
          </TouchableOpacity>

          <View style={styles.backButton}>
            {code.length > 0 && (
              <TouchableOpacity onPress={onNumberDelete}>
                <MaterialCommunityIcons
                  name="backspace-outline"
                  size={26}
                  color="black"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 80,
    alignSelf: "center",
  },
  codeView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginVertical: 100,
  },
  codeEmpty: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  numbersView: {
    marginHorizontal: 80,
    gap: 60,
  },
  numbersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lastNumberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  number: {
    fontSize: 32,
  },
  backButton: {
    minWidth: 30,
  },
});

export default Page;
