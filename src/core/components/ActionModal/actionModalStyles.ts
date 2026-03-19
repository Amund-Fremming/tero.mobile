import { StyleSheet } from "react-native";
import { Font } from "../../constants/Font";
import { horizontalScale, moderateScale, verticalScale } from "../../utils/dimensions";

export const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(74, 40, 20, 0.6)",
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
    borderWidth: moderateScale(2),
    borderRadius: moderateScale(28),
    gap: verticalScale(12),
    backgroundColor: "#F2E9E4",
    borderColor: "#212529",
    paddingHorizontal: horizontalScale(26),
    paddingTop: verticalScale(28),
    paddingBottom: verticalScale(28),
    overflow: "hidden",
  },

  watermark: {
    position: "absolute",
    width: horizontalScale(240),
    height: horizontalScale(240),
    right: horizontalScale(-40),
    bottom: verticalScale(-40),
    opacity: 0.05,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },

  headerIcon: {
    width: moderateScale(30),
    height: moderateScale(30),
  },

  header: {
    textAlign: "left",
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(34),
    color: "#212529",
  },

  message: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    textAlign: "left",
    color: "#212529",
  },

  buttonsWrapper: {
    flexDirection: "row",
    gap: horizontalScale(12),
    marginTop: verticalScale(10),
    alignSelf: "stretch",
  },

  button: {
    flex: 1,
    backgroundColor: "#212529",
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(50),
  },

  buttonText: {
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(18),
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  buttonSecondary: {
    flex: 1,
    backgroundColor: "#D9D9D9",
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(50),
  },

  buttonSecondaryText: {
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(18),
    color: "#212529",
    letterSpacing: 0.5,
  },
});

export default styles;
