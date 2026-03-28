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
    fontSize: moderateScale(30),
    marginTop: "50%",
    textAlign: "center",
    opacity: 0.5,
  },
});

export default styles;
