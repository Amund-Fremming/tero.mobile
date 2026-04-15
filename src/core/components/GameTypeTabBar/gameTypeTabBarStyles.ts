import Color from "@/src/core/constants/Color";
import Font from "@/src/core/constants/Font";
import { horizontalScale, moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";

export const createStyles = (activeColor: string, outlined: boolean, darkMode: boolean = false) =>
  StyleSheet.create({
    tabBar: {
      flexShrink: 0,
    },

    tabBarContent: {
      paddingLeft: horizontalScale(20),
      paddingRight: horizontalScale(15),
      paddingVertical: verticalScale(10),
      gap: horizontalScale(8),
      alignItems: "center" as const,
    },

    tab: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: horizontalScale(8),
      paddingVertical: verticalScale(10),
      paddingHorizontal: horizontalScale(18),
      borderRadius: moderateScale(20),
      backgroundColor: outlined
        ? darkMode
          ? Color.OffBlack
          : Color.White
        : darkMode
          ? Color.OffBlack
          : Color.LightGray,
      borderWidth: outlined ? 2 : 0,
      borderColor: outlined ? (darkMode ? Color.Gray : Color.Gray) : "transparent",
    },

    tabSelected: {
      backgroundColor: activeColor,
      borderColor: activeColor,
    },

    tabLabel: {
      fontFamily: Font.PassionOneRegular,
      fontSize: moderateScale(18),
      color: outlined ? (darkMode ? Color.White : Color.Gray) : darkMode ? Color.White : Color.OffBlack,
    },

    tabLabelSelected: {
      color: Color.White,
    },
  });

export default createStyles;
