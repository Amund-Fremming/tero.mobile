import { Dimensions, StyleSheet } from "react-native";
import Color from "../../../core/constants/Color";
import Font from "../../../core/constants/Font";
import { moderateScale, verticalScale } from "../../../core/utils/dimensions";

const { width } = Dimensions.get("window");

const DOT_SIZE = moderateScale(8);
const DOT_GAP = moderateScale(6);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.LightGray,
  },
  page: {
    width,
    paddingHorizontal: moderateScale(28),
    paddingTop: verticalScale(36),
    gap: verticalScale(14),
  },
  pageTitle: {
    fontFamily: Font.ArchivoBlackRegular,
    fontSize: moderateScale(22),
    color: Color.Black,
    marginBottom: verticalScale(6),
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: moderateScale(10),
  },
  bulletDot: {
    width: moderateScale(7),
    height: moderateScale(7),
    borderRadius: moderateScale(4),
    backgroundColor: Color.BuzzifyLavender,
    marginTop: moderateScale(7),
    flexShrink: 0,
  },
  bulletText: {
    flex: 1,
    fontFamily: Font.SintonyRegular,
    fontSize: moderateScale(15),
    color: Color.OffBlack,
    lineHeight: moderateScale(22),
  },
  dotRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: DOT_GAP,
    paddingVertical: verticalScale(20),
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: Color.BuzzifyLavender,
    opacity: 0.35,
  },
  dotActive: {
    width: DOT_SIZE * 3,
    opacity: 1,
    borderRadius: DOT_SIZE / 2,
  },
  continueButton: {
    marginHorizontal: moderateScale(28),
    marginBottom: verticalScale(40),
    backgroundColor: Color.BuzzifyLavender,
    borderRadius: moderateScale(14),
    paddingVertical: verticalScale(16),
    alignItems: "center",
  },
  continueText: {
    fontFamily: Font.ArchivoBlackRegular,
    fontSize: moderateScale(16),
    color: Color.White,
    letterSpacing: 0.5,
  },
});

export default styles;
