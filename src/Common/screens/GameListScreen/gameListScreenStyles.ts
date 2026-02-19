import Color from "@/src/common/constants/Color";
import { horizontalScale, moderateScale, verticalScale } from "@/src/common/utils/dimensions";
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
    color: Color.Black,
    fontSize: moderateScale(16),
    fontFamily: Font.SintonyRegular,
    paddingVertical: verticalScale(15),
  },

  navButtons: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
    gap: horizontalScale(15),
    paddingTop: verticalScale(20),
  },

  buttonLabel: {
    color: Color.White,
    fontSize: moderateScale(18),
    fontFamily: Font.PassionOneRegular,
  },

  button: {
    backgroundColor: Color.Purple,
    width: horizontalScale(120),
    height: verticalScale(45),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(8),
  },

  card: {
    height: verticalScale(110),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
    marginVertical: verticalScale(8),
    elevation: 2,
    shadowColor: Color.Black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  innerCard: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: verticalScale(90),
    width: "85%",
    flexDirection: "row",
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
    paddingLeft: horizontalScale(20),
    paddingRight: horizontalScale(60),
    flex: 1,
  },

  cardHeader: {
    fontFamily: Font.PassionOneRegular,
    fontSize: moderateScale(28),
    color: Color.OffBlack,
  },

  cardDescription: {
    fontFamily: Font.SintonyRegular,
    fontSize: moderateScale(18),
    color: Color.Gray,
    paddingTop: verticalScale(4),
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
