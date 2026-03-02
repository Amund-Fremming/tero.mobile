import { StyleSheet } from "react-native";
import Color from "../../../../core/constants/Color";
import Font from "../../../../core/constants/Font";
import { horizontalScale, moderateScale, verticalScale } from "../../../../core/utils/dimensions";

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(16),
    gap: verticalScale(12),
  },
  title: {
    fontFamily: Font.ArchivoBlackRegular,
    fontSize: moderateScale(22),
    color: Color.Black,
    marginBottom: verticalScale(4),
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.White,
    borderRadius: moderateScale(14),
    padding: moderateScale(14),
    gap: moderateScale(14),
    shadowColor: Color.Black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  badge: {
    width: horizontalScale(38),
    height: horizontalScale(38),
    borderRadius: moderateScale(10),
    borderWidth: 2,
    borderColor: Color.BuzzifyLavender,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  badgeText: {
    fontFamily: Font.ArchivoBlackRegular,
    fontSize: moderateScale(18),
    color: Color.BuzzifyLavender,
    lineHeight: moderateScale(22),
  },
  itemText: {
    flex: 1,
    fontFamily: Font.SintonyRegular,
    fontSize: moderateScale(14),
    color: Color.OffBlack,
    lineHeight: moderateScale(21),
  },
});

export default styles;
