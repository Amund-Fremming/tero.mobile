import Color from "@/src/core/constants/Color";
import Font from "@/src/core/constants/Font";
import { moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: Color.LighterGreen,
  },

  header: {
    fontWeight: 800,
    fontFamily: Font.PassionOneRegular,
    fontSize: moderateScale(50),
    color: Color.White,
    textAlign: "center",
  },

  subHeader: {
    fontWeight: 800,
    fontSize: moderateScale(22),
    color: Color.OffBlack,
    textAlign: "center",
  },

  textBox: {
    paddingTop: "40%",
    gap: verticalScale(15),
    width: "90%",
  },

  button: {
    position: "absolute",
    bottom: verticalScale(60),
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
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
