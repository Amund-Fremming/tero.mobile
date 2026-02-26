import Color from "@/src/Common/constants/Color";
import Font from "@/src/Common/constants/Font";
import { moderateScale, verticalScale } from "@/src/Common/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  separator: {
    backgroundColor: Color.LightGray,
    height: verticalScale(5),
    width: "90%",
    borderRadius: moderateScale(20),
  },

  phone: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(16),
    color: Color.Burgunde,
    marginTop: verticalScale(4),
    textTransform: "uppercase",
    fontWeight: 800,
  },

  card: {
    minHeight: verticalScale(110),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
    marginVertical: verticalScale(8),
    elevation: 2,
    shadowColor: Color.Black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  innerCard: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "85%",
    flexDirection: "column",
    paddingVertical: verticalScale(10),
  },

  header: {
    fontFamily: Font.PassionOneRegular,
    fontSize: moderateScale(30),
    color: Color.OffBlack,
  },

  description: {
    fontFamily: Font.SintonyRegular,
    fontSize: moderateScale(14),
    color: Color.Gray,
    marginTop: verticalScale(8),
    lineHeight: moderateScale(20),
  },
});
