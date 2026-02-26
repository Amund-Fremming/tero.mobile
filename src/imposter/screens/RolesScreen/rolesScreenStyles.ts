import Color from "@/src/Common/constants/Color";
import Font from "@/src/Common/constants/Font";
import { moderateScale, verticalScale } from "@/src/Common/utils/dimensions";
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
    borderRadius: moderateScale(15),
    gap: moderateScale(12),
    height: verticalScale(95),
    overflow: "hidden",
  },

  buttonText: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
  },

  buttonsWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: verticalScale(20),
    marginTop: "auto",
    paddingTop: verticalScale(20),
    paddingBottom: 50,
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
    fontFamily: Font.PassionOneRegular,
    fontSize: moderateScale(26),
  },

  nextButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
    borderRadius: moderateScale(10),
    height: verticalScale(69),
    backgroundColor: Color.Black,
  },
});

export default styles;
