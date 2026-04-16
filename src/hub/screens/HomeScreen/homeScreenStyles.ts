import { horizontalScale, moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";
import Colors, { Color } from "../../../core/constants/Color";
import { Font } from "../../../core/constants/Font";

export const createStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: Colors.SoftPurple,
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },

  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.BuzzifyLavenderLight,
    height: verticalScale(50),
    width: horizontalScale(50),
    borderRadius: moderateScale(10),
    position: "absolute",
    top: verticalScale(70),
    right: horizontalScale(20),
  },

  darkModeWrapper: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.BuzzifyLavenderLight,
    height: verticalScale(50),
    width: horizontalScale(50),
    borderRadius: moderateScale(10),
    position: "absolute",
    top: verticalScale(70),
    left: horizontalScale(20),
  },

  image: {
    width: "95%",
    height: "95%",
    position: "absolute",
    resizeMode: "contain",
  },

  leadContainer: {
    width: "90%",
    height: "55%",
    justifyContent: "center",
  },

  header: {
    fontSize: moderateScale(110),
    color: Colors.Black,
    fontWeight: 900,
    fontFamily: Font.PassionOneBold,
    textShadowColor: "rgba(0, 0, 0, 0.30)",
    textShadowOffset: { width: 0, height: 10 },
    textShadowRadius: 20,
  },

  subHeader: {
    fontWeight: 700,
    fontSize: moderateScale(30),
    color: Colors.White,
    fontFamily: Font.PassionOneRegular,
    textShadowColor: "rgba(0, 0, 0, 0.20)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },

  buttonContainer: {
    width: "100%",
    height: "45%",
    flexWrap: "wrap",
    flexDirection: "row",
    overflow: "visible",
  },

  buttonBase: {
    width: "50%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },

  topLeft: {
    backgroundColor: Colors.BuzzifyDarkBg,
  },

  topRight: {
    backgroundColor: "transparent",
  },

  bottomLeft: {
    backgroundColor: Colors.BuzzifyPeach,
  },

  bottomRight: {
    backgroundColor: Colors.BuzzifyOrange,
  },

  textCircle: {
    borderRadius: moderateScale(400),
    width: verticalScale(90),
    height: horizontalScale(90),
    backgroundColor: Color.White,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 3,
  },

  buttonTextWrapper: {
    flexDirection: "column",
    alignItems: "center",
    zIndex: 10,
  },

  textBase: {
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(18),
    fontWeight: "900",
    textAlign: "center",
  },

  textTopLeft: {
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
    color: Colors.White,
  },

  textTopRight: {
    color: Colors.BuzzifyOrange,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
  },

  textBottomLeft: {
    color: Colors.BuzzifyLavender,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
  },

  textBottomRight: {
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
    color: Colors.Black,
  },
});

export default createStyles;
