import { StyleSheet } from "react-native";
import Color from "../../../Common/constants/Color";
import { horizontalScale, moderateScale, verticalScale } from "@/src/Common/utils/dimensions";
import { Font } from "../../../Common/constants/Font";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },

  separator: {
    backgroundColor: Color.LightGray,
    height: verticalScale(5),
    width: "90%",
    alignSelf: "center",
    borderRadius: moderateScale(20),
    marginVertical: verticalScale(10),
  },

  categoryScroll: {
    width: "100%",
    backgroundColor: Color.White,
    paddingVertical: verticalScale(10),
  },

  categoryScrollContent: {
    paddingHorizontal: moderateScale(15),
    gap: moderateScale(10),
  },

  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(15),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    borderWidth: 2,
    borderColor: Color.Gray,
    backgroundColor: Color.White,
  },

  categoryButtonActive: {
    backgroundColor: Color.BuzzifyLavender,
    borderColor: Color.BuzzifyLavender,
  },

  categoryText: {
    fontFamily: Font.PassionOneRegular,
    fontSize: moderateScale(18),
    color: Color.Gray,
  },

  categoryTextActive: {
    color: Color.White,
  },

  logCard: {
    backgroundColor: Color.White,
    width: "90%",
    alignSelf: "center",
    paddingLeft: horizontalScale(20),
    paddingRight: horizontalScale(20),
    gap: verticalScale(10),
    paddingVertical: verticalScale(20),
    position: "relative",
  },

  logCategory: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },

  logMessage: {
    fontFamily: Font.SintonyRegular,
    fontSize: moderateScale(16),
    color: Color.OffBlack,
  },

  logTimestamp: {
    fontFamily: Font.SintonyRegular,
    fontSize: moderateScale(14),
    color: Color.Gray,
  },

  logSource: {
    fontFamily: Font.SintonyRegular,
    fontSize: moderateScale(14),
    color: Color.Gray,
    fontStyle: "italic",
  },

  pagination: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: verticalScale(20),
  },

  pageInfo: {
    color: Color.OffBlack,
    fontSize: moderateScale(20),
    fontFamily: Font.SintonyBold,
    paddingVertical: verticalScale(10),
  },

  navButtons: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
    gap: horizontalScale(15),
    paddingTop: verticalScale(15),
  },

  button: {
    backgroundColor: Color.BuzzifyLavender,
    flex: 1,
    maxWidth: horizontalScale(160),
    height: verticalScale(55),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(12),
  },

  buttonSingle: {
    backgroundColor: Color.BuzzifyLavender,
    width: horizontalScale(160),
    height: verticalScale(55),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(12),
  },

  buttonLabel: {
    color: Color.White,
    fontSize: moderateScale(28),
    fontFamily: Font.PassionOneRegular,
    fontWeight: "600",
  },

  emptyText: {
    fontFamily: Font.PassionOneRegular,
    fontSize: moderateScale(20),
    color: Color.Gray,
    textAlign: "center",
    marginTop: verticalScale(40),
    alignSelf: "center",
  },
});

export default styles;
