import Color from "@/src/core/constants/Color";
import { Font } from "@/src/core/constants/Font";
import { AppTheme } from "@/src/core/context/ThemeProvider";
import { horizontalScale, moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";

export const createStyles = (theme: AppTheme, darkMode: boolean) => {
  const contentColor = darkMode ? Color.White : Color.OffBlack;
  return {
    contentColor,
    ...StyleSheet.create({
      container: {
        backgroundColor: theme.primary,
        height: "100%",
        width: "100%",
        position: "relative" as const,
      },

      scrollView: {
        flex: 1,
        width: "100%",
      },

      scrollContent: {
        alignItems: "center" as const,
        gap: verticalScale(20),
        paddingTop: verticalScale(20),
        paddingBottom: verticalScale(180),
      },

      email: {
        fontFamily: Font.SintonyBold,
        fontSize: moderateScale(22),
        color: contentColor,
        marginBottom: verticalScale(10),
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
        fontSize: moderateScale(20),
        color: contentColor,
        paddingRight: moderateScale(20),
      },

      genderLabel: {
        fontSize: moderateScale(18),
        fontFamily: Font.SintonyBold,
        color: contentColor,
        marginBottom: verticalScale(10),
        alignSelf: "flex-start" as const,
        marginLeft: "5%",
      },

      genderButtonContainer: {
        width: "90%",
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,
        alignItems: "center" as const,
        gap: horizontalScale(8),
      },

      genderButton: {
        flex: 1,
        height: verticalScale(50),
        backgroundColor: theme.secondary,
        borderRadius: moderateScale(15),
        borderWidth: moderateScale(3),
        borderColor: theme.secondary,
        justifyContent: "center" as const,
        alignItems: "center" as const,
      },

      genderButtonSelected: {
        borderColor: Color.BuzzifyLavender,
      },

      genderButtonText: {
        fontSize: moderateScale(16),
        fontWeight: "400" as const,
        color: contentColor,
      },

      genderButtonTextSelected: {
        fontWeight: "700" as const,
        color: Color.BuzzifyLavender,
      },

      buttonWrapper: {
        position: "absolute" as const,
        bottom: verticalScale(40),
        width: "100%",
        flexDirection: "column" as const,
        justifyContent: "center" as const,
        alignItems: "center" as const,
        paddingHorizontal: "5%",
      },

      cancelButton: {
        width: "90%",
        height: verticalScale(69),
        backgroundColor: theme.secondary,
        borderRadius: moderateScale(15),
        borderWidth: moderateScale(4),
        borderColor: Color.BuzzifyLavender,
        justifyContent: "center" as const,
        alignItems: "center" as const,
      },

      cancelButtonText: {
        fontSize: moderateScale(28),
        fontFamily: Font.PassionOneBold,
        color: Color.BuzzifyLavender,
      },

      saveButton: {
        width: "90%",
        height: verticalScale(69),
        backgroundColor: Color.HomeRed,
        borderRadius: moderateScale(15),
        justifyContent: "center" as const,
        alignItems: "center" as const,
      },

      saveButtonText: {
        fontSize: moderateScale(35),
        fontFamily: Font.PassionOneBold,
        color: Color.White,
      },
    }),
  };
};
