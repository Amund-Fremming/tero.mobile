import { StyleSheet } from "react-native";
import { moderateScale, verticalScale, horizontalScale } from "@/src/Common/utils/dimensions";
import Color from "@/src/Common/constants/Color";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: Color.LightGray,
    justifyContent: "center",
    alignItems: "center",
  },

  contentWrapper: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.White,
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(60),
    paddingHorizontal: horizontalScale(30),
    shadowColor: Color.Black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  iconContainer: {
    marginBottom: verticalScale(30),
  },

  mainHeader: {
    fontSize: moderateScale(60),
    color: Color.OffBlack,
    fontWeight: "900",
    fontFamily: "PassionOne-Bold",
    marginBottom: verticalScale(10),
  },

  subHeader: {
    fontSize: moderateScale(28),
    color: Color.BuzzifyLavender,
    fontWeight: "700",
    fontFamily: "PassionOne-Regular",
    marginBottom: verticalScale(25),
    textAlign: "center",
  },

  messageContainer: {
    alignItems: "center",
    marginBottom: verticalScale(40),
  },

  message: {
    fontSize: moderateScale(16),
    color: Color.Gray,
    textAlign: "center",
    marginBottom: verticalScale(8),
    paddingHorizontal: horizontalScale(20),
  },

  decorativeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: horizontalScale(25),
    marginTop: verticalScale(20),
  },

  decorativeIcon: {
    opacity: 0.3,
  },
});
