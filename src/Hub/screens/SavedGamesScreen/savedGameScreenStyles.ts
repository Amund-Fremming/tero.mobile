import Color from "@/src/core/constants/Color";
import { horizontalScale, moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";
import { Font } from "../../../core/constants/Font";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },

  gameTypeScroll: {
    width: "100%",
    backgroundColor: Color.White,
  },

  gameTypeScrollContent: {
    paddingHorizontal: moderateScale(15),
    gap: moderateScale(10),
  },

  gameTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(15),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    borderWidth: 2,
    borderColor: Color.Gray,
    backgroundColor: Color.White,
  },

  gameTypeButtonActive: {
    backgroundColor: Color.BuzzifyLavender,
    borderColor: Color.BuzzifyLavender,
  },

  gameTypeText: {
    fontFamily: Font.PassionOneRegular,
    fontSize: moderateScale(18),
    color: Color.Gray,
  },

  gameTypeTextActive: {
    color: Color.White,
  },

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

  cardCategory: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(12),
    color: Color.Burgunde,
    marginTop: verticalScale(4),
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: -2,
    fontWeight: 800,
  },

  cardHeader: {
    fontFamily: Font.PassionOneRegular,
    fontSize: moderateScale(28),
    color: Color.OffBlack,
  },

  cardDescription: {
    fontFamily: Font.SintonyRegular,
    fontSize: moderateScale(14),
    color: Color.Gray,
  },

  saveIcon: {
    padding: moderateScale(8),
  },

  separator: {
    width: "90%",
    height: verticalScale(5),
    backgroundColor: Color.LightGray,
    alignSelf: "center",
    marginVertical: verticalScale(10),
    borderRadius: moderateScale(20),
  },
  noGames: {
    fontFamily: Font.PassionOneRegular,
    fontSize: moderateScale(20),
    color: Color.Gray,
    textAlign: "center",
    marginTop: verticalScale(40),
  },
  pagination: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: verticalScale(20),
  },
  paragraph: {
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
    width: "60%",
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
});
