import Color from "@/src/common/constants/Color";
import Font from "@/src/common/constants/Font";
import { horizontalScale, moderateScale, verticalScale } from "@/src/common/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },

  header: {
    fontWeight: 800,
    fontSize: moderateScale(20),
    color: Color.Black,
    textAlign: "center",
  },

  textBox: {
    width: "70%",
  },

  textIcon: {
    paddingTop: verticalScale(3),
    fontSize: moderateScale(45),
    fontFamily: Font.PassionOneRegular,
    opacity: 0.8,
  },

  headerWrapper: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  icon: {
    fontSize: moderateScale(40),
  },

  borderWrapper: {
    paddingTop: verticalScale(4),
    flexDirection: "row",
    width: "100%",
  },

  iconWrapper: {
    backgroundColor: Color.DarkerGray,
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(50),
    width: horizontalScale(50),
    borderRadius: moderateScale(10),
  },

  topWrapper: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Color.LightGray,
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(20),
  },
});

export default styles;
