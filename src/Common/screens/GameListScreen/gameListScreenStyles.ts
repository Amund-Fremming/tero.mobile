import Color from "@/src/Common/constants/Color";
import { horizontalScale, moderateScale, verticalScale } from "@/src/Common/utils/dimensions";
import { StyleSheet } from "react-native";
import Font from "../../constants/Font";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.White,
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

  buttonLabel: {
    color: Color.White,
    fontSize: moderateScale(28),
    fontFamily: Font.PassionOneRegular,
    fontWeight: "600",
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

  iconCardInner: {
    height: verticalScale(81),
    width: horizontalScale(56),
    borderRadius: moderateScale(8),
    backgroundColor: Color.Purple,
  },

  iconCardOuter: {
    backgroundColor: Color.Black,
    height: verticalScale(90),
    width: horizontalScale(65),
    borderRadius: moderateScale(8),
    justifyContent: "center",
    alignItems: "center",
  },

  iconCardText: {
    position: "absolute",
    left: verticalScale(6),
    bottom: verticalScale(2),
    color: Color.White,
    fontFamily: Font.PassionOneRegular,
    fontSize: moderateScale(20),
  },

  textWrapper: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
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

  saveIcon: {
    position: "absolute",
    right: horizontalScale(15),
    top: verticalScale(15),
  },

  separator: {
    backgroundColor: Color.LightGray,
    height: verticalScale(5),
    width: "90%",
    borderRadius: moderateScale(20),
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
});

export default styles;
