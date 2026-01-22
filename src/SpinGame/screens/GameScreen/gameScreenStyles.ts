import Color from "@/src/Common/constants/Color";
import Font from "@/src/Common/constants/Font";
import { horizontalScale, moderateScale, verticalScale } from "@/src/Common/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(60),
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },

  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(50),
    width: horizontalScale(50),
    borderRadius: moderateScale(10),
    opacity: 0.8,
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
    opacity: 0.8,
  },

  text: {
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
    textAlign: "center",
  },

  buttonWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
    borderRadius: moderateScale(15),
    height: verticalScale(70),
    backgroundColor: Color.Black,
    marginBottom: verticalScale(60),
  },

  buttonText: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
  },
});

export default styles;
