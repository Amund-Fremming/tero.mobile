import { horizontalScale, moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";
import { Color } from "../../../core/constants/Color";
import { Font } from "../../../core/constants/Font";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    gap: 10,
  },

  cardWrapper: {
    position: "relative",
    marginTop: "50%",
    width: "90%",
  },

  bgCircle1: {
    position: "absolute",
    width: moderateScale(380),
    height: moderateScale(380),
    borderRadius: moderateScale(190),
    backgroundColor: "rgba(169, 164, 235, 0.18)",
    top: -moderateScale(120),
    left: -moderateScale(110),
  },

  bgCircle2: {
    position: "absolute",
    width: moderateScale(410),
    height: moderateScale(410),
    borderRadius: moderateScale(190),
    backgroundColor: "rgba(169, 164, 235, 0.14)",
    bottom: -moderateScale(190),
    right: -moderateScale(190),
  },

  bgCircle3: {
    position: "absolute",
    width: moderateScale(320),
    height: moderateScale(320),
    borderRadius: moderateScale(160),
    backgroundColor: "rgba(169, 164, 235, 0.12)",
    top: "38%",
    left: -moderateScale(160),
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

  input: {
    flex: 1,
    fontSize: moderateScale(35),
    fontFamily: Font.PassionOneRegular,
    paddingRight: moderateScale(20),
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    gap: verticalScale(25),
    paddingBottom: verticalScale(40),
  },

  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
    borderRadius: moderateScale(15),
    height: verticalScale(69),
    backgroundColor: Color.HomeRed,
  },

  buttonText: {
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
  },
});

export default styles;
