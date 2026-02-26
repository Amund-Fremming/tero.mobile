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
    borderRadius: moderateScale(30),
    gap: verticalScale(15),
    paddingHorizontal: horizontalScale(20),
    backgroundColor: Color.White,
    borderColor: Color.Gray,
    borderWidth: moderateScale(5),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(30),
  },

  message: {
    width: "90%",
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(24),
    textAlign: "center",
    color: Color.Black,
  },

  button: {
    backgroundColor: Color.BuzzifyLavender,
    borderRadius: moderateScale(10),
    marginTop: verticalScale(12),
    width: "86%",
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
});

export default styles;
