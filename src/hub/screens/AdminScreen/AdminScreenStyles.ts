import { StyleSheet } from "react-native";
import { Color } from "../../../core/constants/Color";
import { horizontalScale, moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { Font } from "../../../core/constants/Font";

export const styles = StyleSheet.create({
  uri: {
    color: Color.Burgunde,
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(18),
  },

  toggleButton: {
    position: "absolute",
    top: verticalScale(18),
    right: horizontalScale(18),
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(7),
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(2),
    zIndex: 10,
    elevation: 5,
  },

  toggleButtonActive: {
    backgroundColor: Color.BuzzifyLavender,
    borderColor: Color.BuzzifyLavender,
  },

  toggleButtonInactive: {
    backgroundColor: Color.White,
    borderColor: Color.DarkerGray,
  },

  toggleText: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(13),
    letterSpacing: 0.5,
  },

  toggleTextActive: {
    color: Color.White,
  },

  toggleTextInactive: {
    color: Color.Gray,
  },

  popupText: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(17),
    color: Color.BuzzifyLavender,
  },

  popupButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
    height: verticalScale(48),
    borderWidth: moderateScale(2.5),
    borderColor: Color.BuzzifyLavender,
    marginTop: verticalScale(4),
  },

  card: {
    borderRadius: moderateScale(10),
    width: "85%",
    gap: verticalScale(10),
    paddingVertical: verticalScale(20),
  },

  separator: {
    backgroundColor: Color.LightGray,
    height: verticalScale(5),
    width: "90%",
    borderRadius: moderateScale(20),
  },

  healthWrapper: {
    justifyContent: "space-between",
    flexDirection: "row",
  },

  text: {
    fontFamily: Font.SintonyRegular,
    fontSize: moderateScale(17),
    fontWeight: 400,
    color: Color.OffBlack,
  },

  cardTitle: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(20),
    color: Color.OffBlack,
    paddingTop: verticalScale(25),
    marginBottom: verticalScale(4),
  },

  errorLogTextBold: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(17),
    fontWeight: "bold",
  },

  sectionTitle: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(18),
    color: Color.OffBlack,
    marginBottom: verticalScale(8),
  },

  inputWrapper: {
    width: "100%",
    gap: verticalScale(6),
  },

  inputLabel: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(14),
    color: Color.OffBlack,
    marginBottom: verticalScale(2),
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.LightGray,
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(13),
    paddingHorizontal: horizontalScale(14),
  },

  input: {
    flex: 1,
    fontSize: moderateScale(18),
    color: Color.OffBlack,
    fontFamily: Font.SintonyRegular,
  },

  multilineInputContainer: {
    alignItems: "flex-start",
    minHeight: verticalScale(80),
  },

  multilineInput: {
    minHeight: verticalScale(80),
    textAlignVertical: "top",
  },

  buttonContainer: {
    flexDirection: "row",
    gap: horizontalScale(10),
    width: "100%",
  },

  saveButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
    height: verticalScale(48),
    backgroundColor: Color.BuzzifyLavender,
    shadowColor: Color.BuzzifyLavender,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  saveButtonText: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(17),
    color: Color.White,
  },

  cancelButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
    height: verticalScale(48),
    borderWidth: moderateScale(2),
    borderColor: Color.DarkerGray,
    backgroundColor: Color.White,
  },

  cancelText: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(17),
    color: Color.OffBlack,
  },
});

export default styles;
