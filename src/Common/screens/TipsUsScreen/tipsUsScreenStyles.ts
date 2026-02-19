import { StyleSheet } from "react-native";
import { Color } from "../../constants/Color";
import { horizontalScale, moderateScale, verticalScale } from "../../utils/dimensions";
import { Font } from "../../constants/Font";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.LightGray,
    height: "100%",
    width: "100%",
    position: "relative",
  },

  scrollView: {
    flex: 1,
    width: "100%",
  },

  scrollContent: {
    alignItems: "center",
    gap: verticalScale(25),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(100),
  },

  subHeader: {
    fontFamily: Font.SintonyRegular,
    fontSize: moderateScale(24),
    color: Color.OffBlack,
    fontWeight: "600",
    marginTop: verticalScale(20),
  },

  inputWrapper: {
    width: "100%",
    alignItems: "center",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.White,
    borderRadius: moderateScale(15),
    width: "90%",
    paddingVertical: verticalScale(12),
    height: verticalScale(65),
  },

  input: {
    flex: 1,
    fontSize: moderateScale(22),
    color: Color.OffBlack,
    paddingRight: moderateScale(20),
  },

  multilineContainer: {
    flexDirection: "row",
    backgroundColor: Color.White,
    borderRadius: moderateScale(15),
    width: "90%",
    paddingVertical: verticalScale(10),
    height: verticalScale(300),
  },

  multiline: {
    flex: 1,
    fontSize: moderateScale(20),
    color: Color.OffBlack,
    paddingRight: moderateScale(20),
    paddingTop: moderateScale(5),
    maxHeight: verticalScale(280),
  },

  button: {
    position: "absolute",
    bottom: verticalScale(40),
    left: "5%",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    borderRadius: moderateScale(15),
    height: verticalScale(69),
    backgroundColor: Color.BuzzifyLavender,
  },

  buttonText: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
  },
});
