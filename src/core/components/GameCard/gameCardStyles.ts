import { moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    width: "95%",
    height: verticalScale(100),
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 2,
    borderColor: "white",
  },

  header: {
    color: "white",
    fontSize: moderateScale(20),
    fontWeight: 600,
  },

  iterations: {
    color: "white",
    fontSize: moderateScale(18),
    fontWeight: 500,
  },
});

export default styles;
