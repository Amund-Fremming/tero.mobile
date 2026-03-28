import Color from "@/src/core/constants/Color";
import { moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.LightGray,
  },

  content: {
    flex: 1,
    backgroundColor: "#5f432f",
  },

  tableSurface: {
    width: "100%",
    height: "100%",
    backgroundColor: "#6a4b34",
    borderWidth: moderateScale(8),
    borderColor: "#4d3423",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: Color.Black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },

  tableFelt: {
    position: "absolute",
    width: "97%",
    height: "96%",
    borderRadius: moderateScale(14),
    backgroundColor: "#2f6f4b",
    borderWidth: moderateScale(2),
    borderColor: "#204e35",
  },

  spotlight: {
    position: "absolute",
    top: verticalScale(60),
    width: moderateScale(300),
    height: moderateScale(180),
    borderRadius: moderateScale(999),
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  diceGroundShadow: {
    position: "absolute",
    bottom: verticalScale(175),
    width: moderateScale(160),
    height: moderateScale(44),
    borderRadius: moderateScale(999),
    backgroundColor: "rgba(8, 16, 12, 0.52)",
  },

  dicePressable: {
    width: moderateScale(320),
    height: moderateScale(320),
    alignItems: "center",
    justifyContent: "center",
  },

  diceContainer: {
    width: moderateScale(250),
    height: moderateScale(250),
    alignItems: "center",
    justifyContent: "center",
  },

  diceCube: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
});
