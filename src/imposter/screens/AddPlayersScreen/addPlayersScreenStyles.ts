import Color from "@/src/common/constants/Color";
import Font from "@/src/common/constants/Font";
import { moderateScale, verticalScale } from "@/src/common/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: Color.BuzzifyLavender,
    justifyContent: "space-between",
  },

  addButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
    borderRadius: moderateScale(10),
    height: verticalScale(69),
    backgroundColor: Color.BuzzifyLavenderLight,
  },

  nextButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "86%",
    borderRadius: moderateScale(10),
    height: verticalScale(69),
    backgroundColor: Color.Black,
  },

  buttonText: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(35),
  },

  buttonsWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: verticalScale(20),
    marginTop: "auto",
    paddingTop: verticalScale(20),
    paddingBottom: 50,
  },

  scrollView: {
    flex: 1,
    width: "100%",
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: verticalScale(10),
    alignItems: "center",
  },

  headerRow: {
    width: "93%",
    alignItems: "flex-end",
    marginBottom: verticalScale(15),
  },

  editButtonText: {
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(22),
  },

  playersWrapper: {
    width: "93%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    rowGap: verticalScale(15),
    columnGap: "4%",
  },

  playerCard: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: Color.BuzzifyLavenderLight,
    paddingHorizontal: moderateScale(15),
    paddingVertical: verticalScale(25),
    borderRadius: moderateScale(10),
    gap: moderateScale(12),
    position: "relative",
    height: verticalScale(95),
  },

  deleteButton: {
    position: "absolute",
    top: -moderateScale(8),
    right: -moderateScale(8),
    backgroundColor: Color.Black,
    borderRadius: moderateScale(15),
    width: moderateScale(30),
    height: moderateScale(30),
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  playerNameInput: {
    flex: 1,
    color: Color.White,
    fontFamily: Font.PassionOneBold,
    fontSize: moderateScale(20),
    padding: 0,
  },
});

export default styles;
