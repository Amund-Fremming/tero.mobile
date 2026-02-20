import { StyleSheet } from "react-native";
import Colors, { Color } from "../../../common/constants/Color";
import { horizontalScale, moderateScale, verticalScale } from "@/src/common/utils/dimensions";
import { Font } from "../../../common/constants/Font";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: "100%",
    backgroundColor: Colors.LightGray,
    gap: verticalScale(20),
  },

  uri: {
    color: Color.Burgunde,
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(18),
  },

  leadContainer: {
    paddingTop: verticalScale(50),
    width: "90%",
    justifyContent: "center",
  },

  activeButton: {
    position: "absolute",
    top: verticalScale(20),
    right: horizontalScale(20),
    width: moderateScale(60),
    height: moderateScale(60),
    justifyContent: "center",
    alignItems: "center",
  },

  modalIndicator: {
    fontSize: moderateScale(20),
    position: "absolute",
    top: verticalScale(5),
    right: horizontalScale(5),
  },

  popupText: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(19),
    color: Color.Purple,
  },

  popupButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
    height: verticalScale(45),
    borderWidth: moderateScale(3),
    borderColor: Color.Purple,
  },

  singleButton: {
    marginTop: verticalScale(20),
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderRadius: moderateScale(10),
    height: verticalScale(45),
    borderWidth: moderateScale(3),
    borderColor: Color.Purple,
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
    fontSize: moderateScale(20),
    fontWeight: 400,
  },

  errorLogTextBold: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },

  inputField: {
    fontFamily: Font.SintonyRegular,
    fontSize: moderateScale(18),
    borderWidth: moderateScale(2),
    borderColor: Color.Purple,
    borderRadius: moderateScale(8),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(10),
    backgroundColor: Color.White,
    width: "100%",
  },

  multilineInput: {
    minHeight: verticalScale(120),
    maxHeight: verticalScale(200),
    textAlignVertical: "top",
  },

  buttonContainer: {
    flexDirection: "row",
    gap: horizontalScale(10),
    marginTop: verticalScale(10),
    width: "100%",
  },

  cancelButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
    height: verticalScale(45),
    borderWidth: moderateScale(3),
    borderColor: Color.LightGray,
    backgroundColor: Color.LightGray,
  },

  cancelText: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(19),
    color: Color.Black,
  },
});

export default styles;
