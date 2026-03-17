import Color from "@/src/core/constants/Color";
import Font from "@/src/core/constants/Font";
import { horizontalScale, moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    paddingTop: verticalScale(60),
    alignItems: "center",
    gap: 10,
  },

  icon: {
    position: "absolute",
    opacity: 0.15,
    paddingTop: "90%",
    left: "50%",
    zIndex: -1,
    transform: [{ translateX: -moderateScale(210) }, { translateY: -moderateScale(210) }],
  },

  iconWrapper: {
    backgroundColor: Color.DarkerGray,
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(50),
    width: horizontalScale(50),
    borderRadius: moderateScale(10),
  },

  finishedMainText: {
    fontFamily: Font.PassionOneBold,
    color: Color.LightGray,
    fontSize: moderateScale(45),
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
    paddingBottom: verticalScale(5),
  },

  finishedSubText: {
    fontFamily: Font.PassionOneRegular,
    fontSize: moderateScale(25),
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  header: {
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(55),
    fontWeight: 600,
    opacity: 0.8,
  },

  headerWrapper: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  textIcon: {
    paddingTop: verticalScale(3),
    fontSize: moderateScale(45),
    fontFamily: Font.PassionOneRegular,
    opacity: 0.8,
  },

  midSection: {
    zIndex: 100,
    paddingTop: "30%",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },

  bottomSection: {
    position: "absolute",
    bottom: verticalScale(50),
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: verticalScale(20),
  },

  createButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
    borderRadius: moderateScale(10),
    height: verticalScale(69),
    backgroundColor: Color.Black,
  },

  bottomText: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
  },

  input: {
    width: "70%",
    fontSize: moderateScale(35),
    marginBottom: verticalScale(-10),
    fontFamily: Font.PassionOneRegular,
    color: Color.C2,
  },

  inputBorder: {
    backgroundColor: Color.Black,
    opacity: 0.9,
    width: "85%",
    height: verticalScale(10),
    borderRadius: moderateScale(10),
  },
});

export default styles;
