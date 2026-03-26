import Color from "@/src/core/constants/Color";
import Font from "@/src/core/constants/Font";
import { moderateScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  placeholder: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(40),
    marginTop: "38%",
    textAlign: "center",
  },
});

export default styles;
