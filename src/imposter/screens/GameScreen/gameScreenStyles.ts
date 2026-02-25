import Color from "@/src/common/constants/Color";
import Font from "@/src/common/constants/Font";
import { moderateScale, verticalScale } from "@/src/common/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: Color.BuzzifyLavender,
  },

  helperWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: verticalScale(20),
  },

  helperText: {
    fontFamily: Font.SintonyRegular,
    fontSize: moderateScale(16),
  },

  scrollView: {
    flex: 1,
    width: "100%",
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: verticalScale(10),
    alignItems: "center",
  },

  playersWrapper: {
    width: "93%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    rowGap: verticalScale(15),
    columnGap: "4%",
  },

  playerCard: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: Color.BuzzifyLavenderLight,
    paddingHorizontal: moderateScale(15),
    paddingVertical: verticalScale(25),
    borderRadius: moderateScale(10),
    gap: moderateScale(12),
    height: verticalScale(95),
    overflow: "hidden",
  },

  playerCardFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Color.Black,
  },

  playerNameText: {
    flex: 1,
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(20),
  },

  text: {},

  button: {},

  buttonText: {},
});

export default styles;
