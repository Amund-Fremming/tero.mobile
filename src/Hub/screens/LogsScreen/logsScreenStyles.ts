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

  separator: {
    backgroundColor: Color.LightGray,
    height: verticalScale(5),
    width: "90%",
    borderRadius: moderateScale(20),
  },

  leadContainer: {
    paddingTop: verticalScale(50),
    width: "90%",
    justifyContent: "center",
  },

  header: {
    color: Colors.Purple,
    fontSize: moderateScale(40),
    fontFamily: Font.PassionOneBold,
  },

  categoryBar: {
    flexDirection: "row",
    width: "90%",
    gap: horizontalScale(10),
    marginTop: verticalScale(10),
  },

  categoryButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
    height: verticalScale(45),
    borderWidth: moderateScale(3),
    borderColor: Color.Purple,
    backgroundColor: Color.White,
  },

  categoryButtonActive: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
    height: verticalScale(45),
    borderWidth: moderateScale(3),
    borderColor: Color.Purple,
    backgroundColor: Color.Purple,
  },

  categoryText: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(16),
    color: Color.Purple,
  },

  categoryTextActive: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(16),
    color: Color.White,
  },

  logCard: {
    backgroundColor: Color.White,
    width: "90%",
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

  navButtons: {
    flexDirection: "row",
    gap: horizontalScale(10),
    width: "90%",
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
  },

  navButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
    height: verticalScale(45),
    borderWidth: moderateScale(3),
    borderColor: Color.Purple,
  },

  navButtonText: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(19),
    color: Color.Purple,
  },

  pageInfo: {
    fontFamily: Font.SintonyRegular,
    fontSize: moderateScale(16),
    color: Color.OffBlack,
    marginBottom: verticalScale(20),
  },

  emptyText: {
    fontFamily: Font.SintonyRegular,
    fontSize: moderateScale(18),
    color: Color.Gray,
    textAlign: "center",
    marginTop: verticalScale(40),
  },
});

export default styles;
