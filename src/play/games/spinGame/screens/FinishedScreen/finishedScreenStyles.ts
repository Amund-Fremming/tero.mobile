import Color from "@/src/core/constants/Color";
import Font from "@/src/core/constants/Font";
import { moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    height: "100%",
  },

  text: {
    width: "90%",
    color: Color.White,
    paddingTop: "38%",
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(45),
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },

  buttonWrapper: {
    position: "absolute",
    bottom: verticalScale(60),
    width: "86%",
    borderRadius: moderateScale(15),
    overflow: "hidden",
  },

  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderRadius: moderateScale(15),
    height: verticalScale(70),
    backgroundColor: Color.Black,
  },

  buttonText: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
  },
});

export default styles;
