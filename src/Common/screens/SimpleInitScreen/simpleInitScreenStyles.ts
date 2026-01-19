import Color from "@/src/Common/constants/Color";
import Font from "@/src/Common/constants/Font";
import { horizontalScale, moderateScale, verticalScale } from "@/src/Common/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingTop: verticalScale(80),
    alignItems: "center",
    gap: 10,
  },

  iconWrapper: {
    backgroundColor: Color.DarkerGray,
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(50),
    width: horizontalScale(50),
    borderRadius: moderateScale(10),
  },

  header: {
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(55),
    fontWeight: 600,
    opacity: 0.8,
  },

  paragraph: {
    fontSize: moderateScale(16),
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

  iterations: {
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(160),
    marginBottom: verticalScale(-25),
  },

  midSection: {
    justifyContent: "center",
    alignItems: "center",
  },

  bottomSection: {
    position: "absolute",
    bottom: verticalScale(50),
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: verticalScale(20),
  },

  createButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
    borderRadius: moderateScale(10),
    height: verticalScale(69),
    backgroundColor: Color.Black,
  },

  categoryButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
    borderRadius: moderateScale(10),
    height: verticalScale(69),
  },

  bottomText: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
  },

  input: {
    width: "70%",
    fontSize: moderateScale(35),
    marginBottom: verticalScale(-10),
    fontFamily: Font.PassionOneRegular,
    color: Color.C2,
  },

  inputBorder: {
    backgroundColor: Color.Black,
    opacity: 0.9,
    width: "85%",
    height: verticalScale(10),
    borderRadius: moderateScale(10),
  },
});

export default styles;
