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

  genericContainer: {
    paddingVertical: verticalScale(28),
    justifyContent: "center",
    alignItems: "flex-start",
    width: horizontalScale(350),
    height: "auto",
    borderWidth: moderateScale(2),
    borderRadius: moderateScale(28),
    gap: verticalScale(12),
    paddingHorizontal: horizontalScale(26),
    borderColor: "#212529",
    overflow: "hidden",
  },

  infoContainer: {
    backgroundColor: "#F2E9E4",
  },

  successContainer: {
    backgroundColor: "#F0F7F0",
  },

  errorContainer: {
    backgroundColor: "#F9F1F0",
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
  },

  message: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    textAlign: "left",
    color: "#212529",
  },

  button: {
    backgroundColor: "#212529",
    borderRadius: moderateScale(10),
    marginTop: verticalScale(10),
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(50),
  },

  buttonSuccess: {
    backgroundColor: "#212529",
    borderRadius: moderateScale(10),
    marginTop: verticalScale(10),
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(50),
  },

  buttonError: {
    backgroundColor: "#A53F2B",
    borderRadius: moderateScale(10),
    marginTop: verticalScale(10),
    alignSelf: "stretch",
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
});

export default styles;
