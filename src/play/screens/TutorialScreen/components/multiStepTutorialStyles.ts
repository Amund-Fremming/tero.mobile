import { StyleSheet } from "react-native";
import Color from "../../../../core/constants/Color";
import Font from "../../../../core/constants/Font";
import { moderateScale, verticalScale } from "../../../../core/utils/dimensions";

const DOT_SIZE = moderateScale(8);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageWrapper: {
    flex: 1,
  },
  dotRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: moderateScale(6),
    paddingVertical: verticalScale(16),
  },
  dot: {
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: Color.BuzzifyLavender,
  },
  buttonRow: {
    flexDirection: "row",
    marginHorizontal: moderateScale(20),
    marginBottom: verticalScale(40),
    gap: moderateScale(10),
  },
  backButton: {
    flex: 1,
    backgroundColor: Color.Black,
    borderRadius: moderateScale(14),
    paddingVertical: verticalScale(16),
    alignItems: "center",
  },
  nextButton: {
    flex: 2,
    backgroundColor: Color.BuzzifyLavender,
    borderRadius: moderateScale(14),
    paddingVertical: verticalScale(16),
    alignItems: "center",
  },
  buttonText: {
    fontFamily: Font.ArchivoBlackRegular,
    fontSize: moderateScale(15),
    color: Color.White,
  },
});

export default styles;
