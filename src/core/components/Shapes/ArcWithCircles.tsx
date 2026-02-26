import React from "react";
import { View } from "react-native";
import { moderateScale } from "@/src/core/utils/dimensions";
import Color from "@/src/core/constants/Color";

export const ArcWithCircles: React.FC = () => {
  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Yellow arc (quarter circle) in bottom-left */}
      <View
        style={{
          position: "absolute",
          width: "200%",
          height: "200%",
          borderRadius: 1000,
          backgroundColor: Color.BuzzifyYellow,
          bottom: -moderateScale(260),
          left: -moderateScale(210),
        }}
      />
    </View>
  );
};

export default ArcWithCircles;
