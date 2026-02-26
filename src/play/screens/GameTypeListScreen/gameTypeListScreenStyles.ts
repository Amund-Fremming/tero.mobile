import { StyleSheet } from "react-native";
import Colors, { Color } from "../../../core/constants/Color";
import { horizontalScale, moderateScale, verticalScale } from "../../../core/utils/dimensions";
import { Font } from "../../../core/constants/Font";

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

  card: {
    borderWidth: moderateScale(6.3),
    borderColor: Color.OffBlack,
    height: verticalScale(210),
    width: "45%",
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },

  cardAdd: {
    backgroundColor: Color.Purple,
    borderWidth: moderateScale(6.3),
    borderColor: Color.OffBlack,
    height: verticalScale(210),
    width: "45%",
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },

  cardHeader: {
    position: "absolute",
    fontWeight: 800,
    fontSize: moderateScale(30),
    bottom: moderateScale(5),
    left: moderateScale(15),
    display: "flex",
    paddingBottom: verticalScale(5),
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },

  cardSubheader: {
    position: "absolute",
    fontWeight: 600,
    fontSize: moderateScale(18),
    color: Color.White,
    bottom: moderateScale(5),
    left: moderateScale(15),
    display: "flex",
    paddingBottom: verticalScale(5),
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },

  paragraph: {
    color: Color.Black,
  },

  imagePlaceholder: {
    backgroundColor: Color.Purple,
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(13),
  },
});

export default styles;
