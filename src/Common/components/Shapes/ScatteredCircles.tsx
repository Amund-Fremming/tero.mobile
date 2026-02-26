import React from "react";
import { View } from "react-native";
import { moderateScale } from "@/src/Common/utils/dimensions";
import Color from "@/src/Common/constants/Color";

export const ScatteredCircles: React.FC = () => {
  const circles = [
    { size: moderateScale(150), bottom: -moderateScale(70), left: -moderateScale(70) },
    { size: moderateScale(40), top: moderateScale(10), right: moderateScale(10) },
  ];

  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {circles.map((circle, index) => (
        <View
          key={index}
          style={{
            position: "absolute",
            width: circle.size,
            height: circle.size,
            borderRadius: circle.size / 2,
            backgroundColor: Color.White,
            top: circle.top,
            bottom: circle.bottom,
            left: circle.left,
            right: circle.right,
          }}
        />
      ))}
    </View>
  );
};

export default ScatteredCircles;
