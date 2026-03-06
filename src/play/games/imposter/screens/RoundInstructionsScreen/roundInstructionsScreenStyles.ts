import Color from "@/src/core/constants/Color";
import Font from "@/src/core/constants/Font";
import { moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: verticalScale(24),
  },
  buttonWrapper: {
    paddingHorizontal: moderateScale(28),
    paddingBottom: verticalScale(40),
  },
  revealButton: {
    borderRadius: moderateScale(14),
    paddingVertical: verticalScale(16),
    alignItems: "center",
    backgroundColor: Color.BuzzifyLavender,
  },
  revealButtonText: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
  },
});

export default styles;
