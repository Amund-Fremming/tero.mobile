import Color from "@/src/core/constants/Color";
import Font from "@/src/core/constants/Font";
import { horizontalScale, moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },

  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(50),
    width: horizontalScale(50),
    borderRadius: moderateScale(10),
    opacity: 0.8,
  },

  headerWrapper: {
    position: "absolute",
    top: verticalScale(60),
    left: 0,
    right: 0,
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },

  scrollContent: {
    paddingTop: verticalScale(130),
    paddingBottom: verticalScale(130),
    alignItems: "center",
    width: "100%",
    minHeight: "100%",
  },

  textIcon: {
    paddingTop: verticalScale(3),
    fontSize: moderateScale(45),
    fontFamily: Font.PassionOneRegular,
    opacity: 0.8,
  },

  tutorialWrapper: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },

  tutorialText: {
    width: "90%",
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(40),
    textAlign: "center",
  },

  text: {
    width: "90%",
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(40),
    textAlign: "center",
  },

  tutorialHeader: {
    width: "90%",
    color: Color.Gray,
    opacity: 0.7,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(45),
    textAlign: "center",
  },

  buttonWrapper: {
    position: "absolute",
    bottom: verticalScale(60),
    width: "86%",
    alignItems: "center",
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
