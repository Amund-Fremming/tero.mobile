import Color from "@/src/core/constants/Color";
import Font from "@/src/core/constants/Font";
import { moderateScale, verticalScale } from "@/src/core/utils/dimensions";
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
