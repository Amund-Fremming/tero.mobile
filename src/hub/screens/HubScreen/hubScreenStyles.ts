import { horizontalScale, moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { StyleSheet } from "react-native";
import { Color } from "../../../core/constants/Color";

const BENTO_GAP = moderateScale(12);
const BENTO_PADDING = moderateScale(16);

export const createStyles = (isDarkMode: boolean) => {
  const tile = isDarkMode ? "#313840" : "#FFFFFF";
  const tileAccent = isDarkMode ? "#2E2A3D" : "#F5F0FF";
  const bg = isDarkMode ? Color.Black : "#F2F2F7";
  const labelColor = isDarkMode ? "#FFFFFF" : Color.Black;
  const iconColor = isDarkMode ? Color.BuzzifyLavender : Color.BuzzifyLavender;

  return StyleSheet.create({
    container: {
      backgroundColor: bg,
      width: "100%",
      height: "100%",
    },

    scrollView: {
      flex: 1,
    },

    bentoGrid: {
      padding: BENTO_PADDING,
      gap: BENTO_GAP,
    },

    bentoRow: {
      flexDirection: "row",
      gap: BENTO_GAP,
    },

    bentoBoxSavedGames: {
      flex: 1,
      backgroundColor: tile,
      borderRadius: moderateScale(20),
      paddingVertical: verticalScale(28),
      alignItems: "center",
      gap: verticalScale(12),
      borderWidth: isDarkMode ? 0 : 1,
      borderColor: "rgba(169,164,235,0.25)",
    },

    bentoBoxTips: {
      flex: 1,
      backgroundColor: tileAccent,
      borderRadius: moderateScale(20),
      paddingVertical: verticalScale(28),
      alignItems: "center",
      gap: verticalScale(12),
      borderWidth: isDarkMode ? 0 : 1,
      borderColor: "rgba(169,164,235,0.25)",
    },

    bentoBoxLabel: {
      fontSize: moderateScale(14),
      fontWeight: "700",
      color: labelColor,
      letterSpacing: 0.3,
    },

    iconColor: {
      // resolved inline in JSX via iconColor variable
    },

    bentoTrackerBox: {
      backgroundColor: isDarkMode ? "#1E2D28" : "#EAF7EC",
      borderRadius: moderateScale(20),
      paddingVertical: verticalScale(32),
      paddingHorizontal: moderateScale(20),
      flexDirection: "row",
      alignItems: "center",
      gap: horizontalScale(16),
      borderWidth: 1,
      borderColor: isDarkMode ? "rgba(100,200,130,0.15)" : "rgba(60,160,90,0.18)",
    },

    bentoTrackerIcon: {
      color: isDarkMode ? "#7EE8A2" : Color.DeepForest,
    },

    bentoTrackerContent: {
      flex: 1,
      gap: verticalScale(4),
    },

    bentoTrackerTitle: {
      fontSize: moderateScale(16),
      fontWeight: "800",
      color: isDarkMode ? "#7EE8A2" : Color.DeepForest,
      letterSpacing: 0.2,
    },

    bentoTrackerSubtitle: {
      fontSize: moderateScale(13),
      color: isDarkMode ? "rgba(126,232,162,0.7)" : Color.LighterGreen,
      fontWeight: "500",
    },

    comingSoonText: {
      textAlign: "center",
      fontSize: moderateScale(14),
      fontWeight: "600",
      color: isDarkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)",
      marginTop: verticalScale(16),
    },
  });
};

export const getIconColor = (isDarkMode: boolean) => Color.BuzzifyLavender;

export default createStyles;
