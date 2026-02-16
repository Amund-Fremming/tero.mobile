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
    backgroundColor: Color.LightGray,
  },

  headerWrapper: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  icon: {
    fontSize: moderateScale(40),
  },

  borderWrapper: {
    paddingTop: verticalScale(4),
    flexDirection: "row",
    width: "100%",
  },

  borderLeft: {
    backgroundColor: Color.HomeRed,
    borderTopLeftRadius: moderateScale(5),
    borderBottomLeftRadius: moderateScale(5),
    flex: 1,
    height: verticalScale(7),
  },

  borderRight: {
    borderTopRightRadius: moderateScale(5),
    borderBottomRightRadius: moderateScale(5),
    backgroundColor: Color.BuzzifyLavender,
    flex: 1,
    height: verticalScale(7),
  },

  iconWrapper: {
    backgroundColor: Color.DarkerGray,
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(50),
    width: horizontalScale(50),
    borderRadius: moderateScale(10),
  },

  topWrapper: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Color.LightGray,
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(20),
  },

  borderAndHeader: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },

  textIcon: {
    paddingTop: verticalScale(3),
    fontSize: moderateScale(45),
    fontFamily: Font.PassionOneRegular,
    opacity: 0.8,
  },

  header: {
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(55),
    fontWeight: 600,
    opacity: 0.8,
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
    width: "90%",
    backgroundColor: Color.White,
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
    width: "90%",
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
    fontSize: moderateScale(22),
    color: Color.Black,
  },

  cardDescription: {
    fontFamily: Font.SintonyRegular,
    fontSize: moderateScale(14),
    color: Color.Gray,
    marginTop: verticalScale(2),
  },

  cardCategory: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(12),
    color: Color.Purple,
    marginTop: verticalScale(4),
  },

  saveIcon: {
    position: "absolute",
    right: horizontalScale(15),
    top: verticalScale(15),
  },
});

export default styles;
