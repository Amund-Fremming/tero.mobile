import React from "react";
import { View } from "react-native";
import Color from "@/src/core/constants/Color";

export const DiagonalSplit: React.FC = () => {
  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Bottom-left half (white) */}
      <View
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          backgroundColor: "transparent",
          borderStyle: "solid",
          borderLeftWidth: 1000,
          borderBottomWidth: 1000,
          borderLeftColor: Color.White,
          borderBottomColor: "transparent",
          bottom: 0,
          left: 0,
        }}
      />
      {/* Top-right half (lavender) */}
      <View
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          backgroundColor: "transparent",
          borderStyle: "solid",
          borderRightWidth: 1000,
          borderTopWidth: 1000,
          borderRightColor: Color.BuzzifyLavender,
          borderTopColor: "transparent",
          top: 0,
          right: 0,
        }}
      />
      {/* Center circle */}
      <View
        style={{
          position: "absolute",
          width: "70%",
          height: "70%",
          borderRadius: 1000,
          backgroundColor: Color.BuzzifyLightBeige,
          top: "15%",
          left: "15%",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </View>
  );
};

export default DiagonalSplit;
