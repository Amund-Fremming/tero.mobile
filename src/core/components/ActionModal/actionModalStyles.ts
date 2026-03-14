import { StyleSheet } from "react-native";
import { Font } from "../../constants/Font";
import { horizontalScale, moderateScale, verticalScale } from "../../utils/dimensions";

export const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    backgroundColor: "#EAF2FA",
    borderColor: "#6F89A2",
    paddingHorizontal: horizontalScale(26),
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(30),
  },

  header: {
    textAlign: "left",
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(38),
    color: "#3B6282",
    opacity: 0.85,
  },

  message: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(18),
    textAlign: "left",
    color: "#2B3036",
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
    backgroundColor: "#1F3D58",
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(50),
  },

  buttonText: {
    fontFamily: Font.PassionOneRegular,
    fontSize: moderateScale(30),
    color: "#EDF6FF",
    fontWeight: "600",
  },

  buttonInverted: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(3),
    borderColor: "#1F3D58",
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(50),
  },

  buttonInvertedText: {
    fontFamily: Font.PassionOneRegular,
    fontSize: moderateScale(30),
    color: "#1F3D58",
    fontWeight: "600",
  },
});

export default styles;
