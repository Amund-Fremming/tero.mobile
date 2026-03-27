import { StyleSheet } from "react-native";
import Font from "../../constants/Font";
import { moderateScale, verticalScale } from "../../utils/dimensions";

export const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
    borderRadius: moderateScale(10),
    height: verticalScale(69),
  },

  label: {
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
  },
});
