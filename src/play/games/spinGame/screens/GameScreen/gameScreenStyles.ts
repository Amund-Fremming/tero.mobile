import Color from "@/src/core/constants/Color";
import Font from "@/src/core/constants/Font";
import { horizontalScale, moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";

// Exported so GameScreen.tsx can use the same value for Animated.diffClamp
export const HEADER_HEIGHT = verticalScale(120);

const HEADER_CONTENT_OFFSET = HEADER_HEIGHT;

export const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },

  // Absolutely-positioned header that slides out when scrolling down
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(10),
  },

  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(50),
    width: horizontalScale(50),
    borderRadius: moderateScale(10),
    opacity: 0.8,
  },

  headerWrapper: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
  },

  textIcon: {
    paddingTop: verticalScale(3),
    fontSize: moderateScale(45),
    fontFamily: Font.PassionOneRegular,
    opacity: 0.8,
  },

  // ScrollView that fills the remaining screen space
  scrollView: {
    flex: 1,
    width: "100%",
  },

  // Content inside the ScrollView — paddingTop clears the absolute header
  scrollContent: {
    paddingTop: HEADER_CONTENT_OFFSET,
    paddingBottom: verticalScale(100),
    alignItems: "center",
    minHeight: "100%",
  },

  tutorialWrapper: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },

  tutorialText: {
    width: "90%",
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(40),
    textAlign: "center",
  },

  text: {
    width: "90%",
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(40),
    textAlign: "center",
    paddingTop: "50%",
  },

  tutorialHeader: {
    width: "90%",
    color: Color.Gray,
    opacity: 0.7,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(45),
    textAlign: "center",
    paddingTop: "50%",
  },

  button: {
    position: "absolute",
    bottom: verticalScale(60),
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
    borderRadius: moderateScale(15),
    height: verticalScale(70),
    backgroundColor: Color.Black,
  },

  buttonText: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
  },
});

export default styles;
