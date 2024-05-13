import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

type Props = {
  onPress: () => void;
};

const BackspaceButton = ({ onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <MaterialCommunityIcons
        name="backspace-outline"
        size={26}
        color="black"
      />
    </TouchableOpacity>
  );
};

export default BackspaceButton;
