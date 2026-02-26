import Color from "@/src/core/constants/Color";
import Font from "@/src/core/constants/Font";
import { moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.LightGray,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: verticalScale(30),
    paddingBottom: verticalScale(100),
  },

  title: {
    fontSize: moderateScale(32),
    fontFamily: Font.PassionOneBold,
    color: Color.OffBlack,
    textAlign: "center",
  },

  diceContainer: {
    shadowColor: Color.Black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  dice: {
    width: moderateScale(200),
    height: moderateScale(200),
    backgroundColor: Color.White,
    borderRadius: moderateScale(25),
    borderWidth: moderateScale(6),
    borderColor: Color.OffBlack,
    justifyContent: "center",
    alignItems: "center",
  },

  diceEmoji: {
    fontSize: moderateScale(120),
  },

  resultContainer: {
    backgroundColor: Color.White,
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(4),
    borderColor: Color.OffBlack,
    paddingHorizontal: moderateScale(40),
    paddingVertical: verticalScale(20),
    alignItems: "center",
    gap: verticalScale(5),
    minWidth: moderateScale(150),
  },

  resultLabel: {
    fontSize: moderateScale(20),
    fontFamily: Font.SintonyBold,
    color: Color.Gray,
    textTransform: "uppercase",
  },

  resultValue: {
    fontSize: moderateScale(50),
    fontFamily: Font.PassionOneBold,
    color: Color.HomeRed,
  },

  hint: {
    fontSize: moderateScale(18),
    fontFamily: Font.SintonyRegular,
    color: Color.OffBlack,
    textAlign: "center",
    marginTop: verticalScale(10),
  },
});
