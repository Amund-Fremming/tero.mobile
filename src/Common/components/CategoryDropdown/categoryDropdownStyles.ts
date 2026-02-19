import Color from "@/src/common/constants/Color";
import Font from "@/src/common/constants/Font";
import { moderateScale, verticalScale } from "@/src/common/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  categoryButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
    height: verticalScale(69),
    backgroundColor: Color.BuzzifyLavenderLight,
    borderRadius: moderateScale(10),
  },

  selectedText: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
    textAlign: "center",
  },

  dropdownContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(8),
    borderWidth: 0,
    width: "90%",
    left: "5%",
  },

  dropdownItemContainer: {
    backgroundColor: "transparent",
  },

  dropdownItemText: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
    textAlign: "center",
  },

  dropdownItem: {
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    height: verticalScale(69),
    backgroundColor: Color.BuzzifyLavenderLight,
    borderRadius: moderateScale(10),
    marginVertical: verticalScale(5),
    alignSelf: "center",
  },

  dropdownItemSelected: {
    outlineWidth: moderateScale(5),
    outlineColor: Color.White,
  },

  bottomText: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
  },
});
