import { StyleSheet } from "react-native";
import Color from "../../constants/Color";
import Font from "../../constants/Font";
import { horizontalScale, moderateScale, verticalScale } from "../../utils/dimensions";

export const styles = StyleSheet.create({
  topWrapper: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(20),
  },

  headerWrapper: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  borderAndHeader: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },

  miniHeader: {
    fontFamily: Font.SintonyRegular,
    fontSize: moderateScale(14),
    opacity: 0.6,
    marginBottom: verticalScale(2),
  },

  header: {
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(55),
    fontWeight: "600",
    opacity: 0.8,
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

  textIcon: {
    paddingTop: verticalScale(3),
    fontSize: moderateScale(45),
    fontFamily: Font.PassionOneRegular,
    opacity: 0.8,
  },
});

export default styles;
