import { StyleSheet } from "react-native";
import { Color } from "../../../core/constants/Color";
import { AppTheme } from "../../../core/context/ThemeProvider";
import { Font } from "../../../core/constants/Font";
import { moderateScale, verticalScale } from "../../../core/utils/dimensions";

export const createStyles = (theme: AppTheme, darkMode: boolean) => {
  const contentColor = darkMode ? Color.White : Color.OffBlack;
  return {
    contentColor,
    ...StyleSheet.create({
      container: {
        backgroundColor: theme.primary,
        flex: 1,
        width: "100%",
      },

      scrollView: {
        flex: 1,
        width: "100%",
      },

      scrollContent: {
        alignItems: "center" as const,
        gap: verticalScale(25),
        paddingTop: verticalScale(20),
        paddingBottom: verticalScale(100),
      },

      subHeader: {
        fontFamily: Font.SintonyRegular,
        fontSize: moderateScale(24),
        color: contentColor,
        fontWeight: "600" as const,
        marginTop: verticalScale(20),
      },

      inputWrapper: {
        width: "100%",
        alignItems: "center" as const,
      },

      inputContainer: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        backgroundColor: theme.secondary,
        borderRadius: moderateScale(15),
        width: "90%",
        paddingVertical: verticalScale(12),
        height: verticalScale(65),
      },

      input: {
        flex: 1,
        fontSize: moderateScale(22),
        color: contentColor,
        paddingRight: moderateScale(20),
      },

      multilineContainer: {
        flexDirection: "row" as const,
        backgroundColor: theme.secondary,
        borderRadius: moderateScale(15),
        width: "90%",
        paddingVertical: verticalScale(10),
        height: verticalScale(300),
      },

      multiline: {
        flex: 1,
        fontSize: moderateScale(20),
        color: contentColor,
        paddingRight: moderateScale(20),
        paddingTop: moderateScale(5),
        maxHeight: verticalScale(280),
      },

      charCounter: {
        fontFamily: Font.SintonyRegular,
        fontSize: moderateScale(16),
        color: Color.DarkerGray,
        alignSelf: "flex-end" as const,
        marginRight: "5%",
        marginTop: verticalScale(5),
      },

      button: {
        position: "absolute" as const,
        bottom: verticalScale(40),
        left: "5%",
        justifyContent: "center" as const,
        alignItems: "center" as const,
        width: "90%",
        borderRadius: moderateScale(15),
        height: verticalScale(69),
        backgroundColor: Color.HomeRed,
      },

      buttonText: {
        color: Color.Black,
        fontFamily: Font.PassionOneBold,
        fontSize: moderateScale(35),
      },
    }),
  };
};
