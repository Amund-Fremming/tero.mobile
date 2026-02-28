import Color from "@/src/core/constants/Color";
import Font from "@/src/core/constants/Font";
import { horizontalScale, moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingTop: verticalScale(80),
    alignItems: "center",
    gap: 10,
    backgroundColor: Color.LighterGreen,
    justifyContent: "space-between",
  },

  iconWrapper: {
    backgroundColor: Color.DarkerGray,
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(50),
    width: horizontalScale(50),
    borderRadius: moderateScale(10),
  },

  headerWrapper: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  textIcon: {
    paddingTop: verticalScale(3),
    fontSize: moderateScale(45),
    fontFamily: Font.PassionOneRegular,
  },

  header: {
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(55),
    fontWeight: 600,
    opacity: 0.8,
  },

  question: {
    maxWidth: "90%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(60),
    opacity: 0.5,
  },

  buttonWrapper: {
    bottom: verticalScale(50),
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: verticalScale(20),
  },

  prevText: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
  },

  nextText: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
    textAlign: "center",
  },

  prevButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
    height: verticalScale(69),
    borderRadius: moderateScale(10),
    backgroundColor: Color.Black,
  },

  nextButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
    borderRadius: moderateScale(10),
    height: verticalScale(69),
    backgroundColor: Color.DeepForest,
  },
});

export default styles;
