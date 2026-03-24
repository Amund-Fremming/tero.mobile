import Color from "@/src/core/constants/Color";
import Font from "@/src/core/constants/Font";
import { horizontalScale, moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.White,
  },

  noGames: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(25),
    textAlign: "center",
    width: "80%",
    color: Color.OffBlack,
    paddingTop: verticalScale(50),
  },

  pagination: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  paragraph: {
    color: Color.OffBlack,
    fontSize: moderateScale(20),
    fontFamily: Font.SintonyBold,
    paddingVertical: verticalScale(10),
  },

  navButtons: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
    gap: horizontalScale(15),
    paddingTop: verticalScale(15),
  },

  buttonLabel: {
    color: Color.White,
    fontSize: moderateScale(20),
    fontFamily: Font.PassionOneRegular,
    fontWeight: "600",
  },

  buttonLabelInverted: {
    color: Color.Gray,
    fontSize: moderateScale(20),
    fontFamily: Font.PassionOneRegular,
    fontWeight: "600",
  },

  button: {
    backgroundColor: Color.Gray,
    flex: 1,
    maxWidth: horizontalScale(160),
    height: verticalScale(42),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
  },

  buttonSingleLeft: {
    backgroundColor: Color.Gray,
    width: "45%",
    height: verticalScale(42),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
  },

  buttonSingleRight: {
    backgroundColor: Color.Gray,
    width: "45%",
    height: verticalScale(42),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
    marginLeft: "auto",
  },

  buttonInverted: {
    backgroundColor: Color.White,
    borderWidth: 2,
    borderColor: Color.Gray,
    flex: 1,
    maxWidth: horizontalScale(160),
    height: verticalScale(42),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
  },

  // Skeleton styles
  card: {
    width: "90%",
    alignSelf: "center",
    paddingVertical: verticalScale(15),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  innerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(15),
    flex: 1,
  },

  textWrapper: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
  },

  separator: {
    backgroundColor: Color.LightGray,
    height: verticalScale(5),
    width: "90%",
    borderRadius: moderateScale(20),
  },

  skeletonIcon: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(8),
    backgroundColor: Color.DarkerGray,
  },

  skeletonLineShort: {
    width: horizontalScale(60),
    height: verticalScale(10),
    borderRadius: moderateScale(6),
    backgroundColor: Color.DarkerGray,
    marginBottom: verticalScale(6),
  },

  skeletonLineLong: {
    width: horizontalScale(140),
    height: verticalScale(22),
    borderRadius: moderateScale(6),
    backgroundColor: Color.DarkerGray,
    marginBottom: verticalScale(6),
  },

  skeletonLineMedium: {
    width: horizontalScale(90),
    height: verticalScale(10),
    borderRadius: moderateScale(6),
    backgroundColor: Color.DarkerGray,
  },
});
