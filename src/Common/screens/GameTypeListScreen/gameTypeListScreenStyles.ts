import { StyleSheet } from "react-native";
import Colors, { Color } from "../../constants/Color";
import { horizontalScale, moderateScale, verticalScale } from "../../utils/dimensions";
import { Font } from "../../constants/Font";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    flexDirection: "row",
  },

  headerWrapper: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  headerInline: {
    justifyContent: "center",
    alignItems: "center",
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

  icon: {
    fontSize: moderateScale(40),
  },

  borderWrapper: {
    paddingTop: verticalScale(4),
    flexDirection: "row",
    width: "100%",
  },

  borderAndHeader: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
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

  card: {
    borderWidth: moderateScale(6.3),
    borderColor: Color.OffBlack,
    height: verticalScale(210),
    width: "45%",
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },

  cardHeader: {
    position: "absolute",
    fontWeight: 800,
    fontSize: moderateScale(28),
    color: Color.White,
    bottom: moderateScale(5),
    left: moderateScale(15),
    display: "flex",
    paddingBottom: verticalScale(5),
  },

  cardSubheader: {
    position: "absolute",
    fontWeight: 600,
    fontSize: moderateScale(18),
    color: Color.White,
    bottom: moderateScale(5),
    left: moderateScale(15),
    display: "flex",
    paddingBottom: verticalScale(5),
  },

  paragraph: {
    color: Color.Black,
  },

  imagePlaceholder: {
    backgroundColor: Color.Purple,
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(13),
  },
});

export default styles;
