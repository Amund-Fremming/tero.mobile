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
    backgroundColor: Color.LightGray,
    borderColor: Color.Gray,
    borderWidth: moderateScale(3),
  },

  errorContainer: {
    backgroundColor: Color.White,
    borderColor: Color.HomeRed,
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
    color: Color.OffBlack,
  },

  button: {
    backgroundColor: Color.Beige,
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
    color: Color.White,
    fontWeight: "600",
  },
});

export default styles;
