import Color from "@/src/core/constants/Color";
import Font from "@/src/core/constants/Font";
import { horizontalScale, moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingTop: verticalScale(60),
    alignItems: "center",
    gap: 10,
  },

  scroll: {
    flex: 1,
    width: "100%",
  },

  scrollContent: {
    alignItems: "center",
    paddingBottom: verticalScale(10),
    gap: 10,
  },

  players: {
    paddingTop: verticalScale(20),
    fontSize: moderateScale(32),
    fontFamily: Font.PassionOneRegular,
    color: Color.White,
  },

  userIcon: {
    width: horizontalScale(70),
    height: verticalScale(70),
  },

  userIconWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: moderateScale(10),
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(20),
    width: "90%",
  },

  button: {
    marginBottom: verticalScale(40),
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
    borderRadius: moderateScale(10),
    height: verticalScale(69),
    backgroundColor: Color.Black,
  },

  stickyButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
    borderRadius: moderateScale(10),
    height: verticalScale(69),
    backgroundColor: Color.Black,
    marginBottom: verticalScale(40),
    marginTop: verticalScale(10),
  },

  buttonText: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
  },

  headerWrapper: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  headerInline: {
    justifyContent: "center",
    alignItems: "center",
  },

  toastHeader: {
    fontSize: moderateScale(25),
    fontFamily: Font.PassionOneRegular,
  },

  headerSecondScreen: {
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(45),
    fontWeight: 600,
    opacity: 0.8,
  },

  centerText: {
    paddingBottom: verticalScale(60),
    color: Color.SkyBlueLight,
    fontSize: moderateScale(35),
    fontFamily: Font.PassionOneRegular,
    textAlign: "center",
  },
});

export default styles;
