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

  genericContainer: {
    paddingVertical: verticalScale(30),
    justifyContent: "center",
    alignItems: "flex-start",
    width: horizontalScale(350),
    height: "auto",
    borderWidth: moderateScale(2),
    borderRadius: moderateScale(35),
    gap: verticalScale(15),
    paddingHorizontal: horizontalScale(26),
  },

  messageContainer: {
    backgroundColor: "#EAF2FA",
    borderColor: "#6F89A2",
    borderWidth: moderateScale(3),
  },

  errorContainer: {
    backgroundColor: "#FFF4F2",
    borderColor: "#C96E5A",
    borderWidth: moderateScale(3),
  },

  header: {
    textAlign: "left",
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(38),
    opacity: 0.85,
  },

  message: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(18),
    textAlign: "left",
    color: "#2B3036",
  },

  button: {
    backgroundColor: "#1F3D58",
    borderRadius: moderateScale(10),
    marginTop: verticalScale(12),
    width: "80%",
    alignSelf: "center",
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
});

export default styles;
