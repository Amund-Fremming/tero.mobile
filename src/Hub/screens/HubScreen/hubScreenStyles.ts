import { StyleSheet } from "react-native";
import Colors, { Color } from "../../../Common/constants/Color";
import { verticalScale, moderateScale, horizontalScale } from "@/src/Common/utils/dimensions";
import { Font } from "../../../Common/constants/Font";

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
