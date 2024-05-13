import { LOCK_TIME } from "@/constants/constants";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV({
  id: "UserInactivity",
});

export const UserInactivityProvider = ({ children }: any) => {
  const appState = useRef(AppState.currentState);
  const router = useRouter();

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === "inactive") {
      router.push("/(modals)/white");
    } else {
      if (router.canGoBack()) {
        router.back();
      }
    }

    if (nextAppState === "background") {
      recordStartTime();
    } else if (nextAppState === "active" && appState.current === "background") {
      const elapsed = Date.now() - storage.getNumber("startTime")!;

      if (elapsed >= LOCK_TIME) {
        router.push("/(modals)/lock");
      }
    }

    appState.current = nextAppState;
  };

  const recordStartTime = () => {
    storage.set("startTime", Date.now());
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return children;
};
