import Color from "@/src/core/constants/Color";
import Font from "@/src/core/constants/Font";
import { horizontalScale, moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    width: "90%",
    alignSelf: "center",
    paddingVertical: verticalScale(15),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  innerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(15),
    flex: 1,
  },

  textWrapper: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
  },

  cardCategory: {
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(12),
    color: Color.Burgunde,
    marginTop: verticalScale(4),
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: -2,
    fontWeight: "800",
  },

  cardHeader: {
    fontFamily: Font.PassionOneRegular,
    fontSize: moderateScale(28),
    color: Color.OffBlack,
  },

  cardDescription: {
    fontFamily: Font.SintonyRegular,
    fontSize: moderateScale(14),
    color: Color.Gray,
  },

  actionIcon: {
    position: "absolute",
    right: horizontalScale(0),
    top: verticalScale(15),
    padding: moderateScale(8),
  },

  separator: {
    backgroundColor: Color.LightGray,
    height: verticalScale(5),
    width: "90%",
    alignSelf: "center",
    borderRadius: moderateScale(20),
  },
});

export default styles;
