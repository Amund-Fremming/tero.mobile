import { StyleSheet } from "react-native";
import { Color } from "../../../core/constants/Color";
import { verticalScale, moderateScale, horizontalScale } from "@/src/core/utils/dimensions";
import { Font } from "../../../core/constants/Font";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.LightGray,
    width: "100%",
    height: "100%",
    alignItems: "center",
    gap: 10,
  },

  cardWrapper: {
    position: "relative",
    marginTop: "50%",
    width: "90%",
  },

  mascot: {
    position: "absolute",
    top: 0,
    right: horizontalScale(5),
    width: horizontalScale(100),
    height: verticalScale(100),
    zIndex: 10,
    transform: [{ translateY: "-45%" }],
  },

  goBack: {
    position: "absolute",
    top: verticalScale(50),
    left: verticalScale(20),
    backgroundColor: Color.LightGray,
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
    width: horizontalScale(40),
    height: horizontalScale(40),
  },

  paragraph: {
    fontSize: moderateScale(16),
  },

  input: {
    flex: 1,
    fontSize: moderateScale(35),
    fontFamily: Font.PassionOneRegular,
    color: Color.OffBlack,
    paddingRight: moderateScale(20),
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.LightGray,
    borderRadius: moderateScale(15),
    width: "85%",
    paddingVertical: verticalScale(10),
    height: verticalScale(70),
  },

  card: {
    paddingTop: verticalScale(35),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(20),
    backgroundColor: Color.White,
    gap: verticalScale(25),
    paddingBottom: verticalScale(40),
  },

  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
    borderRadius: moderateScale(15),
    height: verticalScale(69),
    backgroundColor: Color.BuzzifyLavender,
  },

  buttonText: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
  },
});

export default styles;
