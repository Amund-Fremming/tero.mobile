import Color from "@/src/core/constants/Color";
import { horizontalScale, moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    minHeight: "100%",
    backgroundColor: Color.White,
    borderRadius: moderateScale(10),
  },

  loggedIn: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  imageCard: {
    marginTop: verticalScale(30),
    justifyContent: "flex-end",
    alignItems: "center",
    width: horizontalScale(140),
    height: verticalScale(140),
    borderRadius: moderateScale(28),
    backgroundColor: Color.Blue,
  },

  image: {
    width: horizontalScale(120),
    height: verticalScale(120),
  },

  crown: {
    height: verticalScale(70),
    width: horizontalScale(70),
    resizeMode: "cover",
  },

  name: {
    paddingTop: verticalScale(15),
    fontSize: moderateScale(25),
    fontWeight: 600,
  },

  username: {
    paddingTop: verticalScale(5),
    fontSize: moderateScale(18),
  },

  layover: {
    width: "100%",
    height: "65%",
    backgroundColor: Color.LightGray,
    borderTopLeftRadius: moderateScale(50),
    borderTopRightRadius: moderateScale(50),
    marginTop: verticalScale(20),
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: verticalScale(40),
  },

  bigButton: {
    marginTop: verticalScale(30),
    width: "86%",
    height: verticalScale(60),
    borderRadius: moderateScale(15),
    alignItems: "center",
    justifyContent: "flex-start",
    display: "flex",
    flexDirection: "row",
  },

  iconGuard: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
    backgroundColor: Color.White,
    width: horizontalScale(55),
    height: verticalScale(55),
  },

  buttonText: {
    flex: 1,
    paddingLeft: horizontalScale(15),
    fontSize: moderateScale(18),
    textAlign: "left",
  },
});
