import Color from "@/src/core/constants/Color";
import { horizontalScale, moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { Font } from "@/src/core/constants/Font";
import { StyleSheet } from "react-native";

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
    gap: verticalScale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(180),
  },

  email: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(22),
    color: Color.OffBlack,
    marginBottom: verticalScale(10),
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
    fontSize: moderateScale(20),
    color: Color.OffBlack,
    paddingRight: moderateScale(20),
  },

  genderLabel: {
    fontSize: moderateScale(18),
    fontFamily: Font.SintonyBold,
    color: Color.OffBlack,
    marginBottom: verticalScale(10),
    alignSelf: "flex-start",
    marginLeft: "5%",
  },

  genderButtonContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: horizontalScale(8),
  },

  genderButton: {
    flex: 1,
    height: verticalScale(50),
    backgroundColor: Color.White,
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(3),
    borderColor: Color.White,
    justifyContent: "center",
    alignItems: "center",
  },

  genderButtonSelected: {
    borderColor: Color.Purple,
  },

  genderButtonText: {
    fontSize: moderateScale(16),
    fontWeight: "400",
    color: Color.OffBlack,
  },

  genderButtonTextSelected: {
    fontWeight: "700",
    color: Color.Purple,
  },

  buttonWrapper: {
    position: "absolute",
    bottom: verticalScale(40),
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "5%",
  },

  cancelButton: {
    width: "90%",
    height: verticalScale(69),
    backgroundColor: Color.White,
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(4),
    borderColor: Color.BuzzifyLavender,
    justifyContent: "center",
    alignItems: "center",
  },

  cancelButtonText: {
    fontSize: moderateScale(28),
    fontFamily: Font.PassionOneBold,
    color: Color.BuzzifyLavender,
  },

  saveButton: {
    width: "90%",
    height: verticalScale(69),
    backgroundColor: Color.BuzzifyLavender,
    borderRadius: moderateScale(15),
    justifyContent: "center",
    alignItems: "center",
  },

  saveButtonText: {
    fontSize: moderateScale(28),
    fontFamily: Font.PassionOneBold,
    color: Color.White,
  },
});
