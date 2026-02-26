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
    alignItems: "center",
    width: horizontalScale(350),
    borderWidth: moderateScale(5),
    borderRadius: moderateScale(30),
    gap: verticalScale(15),
    backgroundColor: Color.White,
    borderColor: Color.Gray,
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(30),
  },

  header: {
    textAlign: "center",
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(45),
    color: Color.OffBlack,
    opacity: 0.8,
  },

  message: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(24),
    textAlign: "center",
    color: Color.Black,
  },

  buttonsWrapper: {
    flexDirection: "row",
    gap: horizontalScale(15),
    marginTop: verticalScale(12),
    width: "86%",
  },

  button: {
    flex: 1,
    backgroundColor: Color.Gray,
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
    backgroundColor: Color.White,
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(4),
    borderColor: Color.Gray,
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(50),
  },
  buttonInvertedText: {
    fontFamily: Font.PassionOneRegular,
    fontSize: moderateScale(30),
    color: Color.Gray,
    fontWeight: "600",
  },
});

export default styles;
