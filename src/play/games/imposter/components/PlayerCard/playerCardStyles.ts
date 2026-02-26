import Color from "@/src/core/constants/Color";
import Font from "@/src/core/constants/Font";
import { moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  playerCardFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Color.Black,
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

  playerNameText: {
    flex: 1,
    color: Color.White,
    fontFamily: Font.PassionOneRegular,
    fontSize: moderateScale(26),
  },
});
