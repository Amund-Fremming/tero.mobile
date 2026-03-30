import { horizontalScale, moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";
import { Color } from "../../../core/constants/Color";

const BENTO_GAP = moderateScale(12);
const BENTO_PADDING = moderateScale(16);

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    width: "100%",
    height: "100%",
  },

  scrollView: {
    flex: 1,
  },

  bentoGrid: {
    padding: BENTO_PADDING,
    gap: BENTO_GAP,
  },

  bentoRow: {
    flexDirection: "row",
    gap: BENTO_GAP,
  },

  bentoBoxSavedGames: {
    flex: 1,
    backgroundColor: Color.BuzzifyLavender,
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(28),
    alignItems: "center",
    gap: verticalScale(12),
  },

  bentoBoxTips: {
    flex: 1,
    backgroundColor: Color.BuzzifyYellow,
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(28),
    alignItems: "center",
    gap: verticalScale(12),
  },

  bentoBoxLabel: {
    fontSize: moderateScale(14),
    fontWeight: "700",
    color: Color.BuzzifyDarkBg,
    letterSpacing: 0.3,
  },

  bentoBeerBox: {
    backgroundColor: Color.C2,
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    flexDirection: "row",
    alignItems: "flex-start",
    gap: horizontalScale(16),
  },

  beerIcon: {
    marginTop: verticalScale(2),
  },

  beerContent: {
    flex: 1,
    gap: verticalScale(10),
  },

  beerHeader: {
    fontSize: moderateScale(16),
    fontWeight: "800",
    color: Color.DarkBrown,
    letterSpacing: 0.2,
  },

  beerList: {
    gap: verticalScale(6),
  },

  beerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  beerPlace: {
    fontSize: moderateScale(13),
    color: Color.DarkBrown,
    fontWeight: "500",
  },

  beerPrice: {
    fontSize: moderateScale(13),
    color: Color.DarkBrown,
    fontWeight: "700",
  },
});

export default styles;
