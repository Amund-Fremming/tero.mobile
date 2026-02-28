import { StyleSheet } from "react-native";
import { Color } from "../../../core/constants/Color";
import { moderateScale, verticalScale } from "@/src/core/utils/dimensions";

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
    fontSize: moderateScale(20),
    fontWeight: 700,
    marginBottom: verticalScale(8),
  },

  debugBox: {
    marginTop: verticalScale(30),
    alignItems: "flex-start",
    padding: verticalScale(15),
    gap: verticalScale(6),
    borderColor: Color.Red,
    borderWidth: moderateScale(2),
    borderRadius: moderateScale(10),
    width: "90%",
  },
});

export default styles;
