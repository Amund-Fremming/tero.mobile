import { StyleSheet } from "react-native";
import Colors, { Color } from "../../../common/constants/Color";
import { verticalScale, moderateScale, horizontalScale } from "@/src/common/utils/dimensions";
import { Font } from "../../../common/constants/Font";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    flexDirection: "row",
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

  borderAndHeader: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },

  borderWrapper: {
    paddingTop: verticalScale(4),
    flexDirection: "row",
    width: "100%",
  },

  header: {
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(55),
    fontWeight: 600,
    opacity: 0.8,
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

  debugHeader: {
    fontSize: moderateScale(25),
    fontWeight: 700,
    paddingRight: "60%",
    paddingBottom: verticalScale(15),
  },

  debugBox: {
    marginTop: verticalScale(50),
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: verticalScale(25),
    borderColor: Color.Red,
    borderWidth: moderateScale(6),
    width: "90%",
  },
});

export default styles;
