import { StyleSheet } from "react-native";
import { Color } from "../../constants/Color";
import { horizontalScale, moderateScale, verticalScale } from "../../utils/dimensions";
import { Font } from "../../constants/Font";

export const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5);",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    flex: 1,
  },

  container: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: horizontalScale(350),
    borderWidth: moderateScale(3),
    borderRadius: moderateScale(35),
    gap: verticalScale(15),
    backgroundColor: Color.LightGray,
    borderColor: Color.Gray,
    paddingHorizontal: horizontalScale(26),
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(30),
  },

  header: {
    textAlign: "left",
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(38),
    color: Color.BeigeLight,
    opacity: 0.85,
  },

  message: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(18),
    textAlign: "left",
    color: Color.OffBlack,
  },

  buttonsWrapper: {
    flexDirection: "row",
    gap: horizontalScale(15),
    marginTop: verticalScale(12),
    alignSelf: "center",
    width: "86%",
  },

  button: {
    flex: 1,
    backgroundColor: Color.Beige,
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(50),
  },

  buttonText: {
    fontFamily: Font.PassionOneRegular,
    fontSize: moderateScale(30),
    color: Color.White,
    fontWeight: "600",
  },

  buttonInverted: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(3),
    borderColor: Color.Beige,
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(50),
  },

  buttonInvertedText: {
    fontFamily: Font.PassionOneRegular,
    fontSize: moderateScale(30),
    color: Color.Beige,
    fontWeight: "600",
  },
});

export default styles;
