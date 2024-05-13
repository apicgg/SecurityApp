import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, TouchableOpacity } from "react-native";

type Props = {
  onPress: () => void;
};

const Biometric = ({ onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {Platform.OS === "ios" && (
        <MaterialCommunityIcons
          name="face-recognition"
          size={26}
          color="black"
        />
      )}
      {Platform.OS === "android" && (
        <MaterialCommunityIcons name="fingerprint" size={30} color="black" />
      )}
    </TouchableOpacity>
  );
};

export default Biometric;
