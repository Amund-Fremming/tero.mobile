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
  const beerTile = isDarkMode ? "#2E2820" : "#FFFBF0";
  const beerBorder = isDarkMode ? "rgba(255,200,100,0.15)" : "rgba(180,130,50,0.18)";
  const beerText = isDarkMode ? "#E8C97A" : Color.DarkBrown;
  const beerSubText = isDarkMode ? "rgba(232,201,122,0.75)" : Color.DarkBrown;

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

    bentoBeerWrapper: {
      position: "relative",
      borderRadius: moderateScale(20),
      overflow: "hidden",
    },

    bentoBeerBox: {
      backgroundColor: beerTile,
      borderRadius: moderateScale(20),
      padding: moderateScale(20),
      flexDirection: "row",
      alignItems: "flex-start",
      gap: horizontalScale(16),
      borderWidth: 1,
      borderColor: beerBorder,
    },

    beerRibbon: {
      position: "absolute",
      top: moderateScale(58),
      left: -moderateScale(60),
      right: -moderateScale(60),
      alignItems: "center",
      transform: [{ rotate: "20deg" }],
    },

    beerRibbonText: {
      color: Color.HomeRed,
      fontSize: moderateScale(25),
      fontWeight: "900",
      letterSpacing: 3,
    },

    beerIcon: {
      marginTop: verticalScale(2),
    },

    beerContent: {
      flex: 1,
      gap: verticalScale(10),
    },

    beerHeader: {
      fontSize: moderateScale(16),
      fontWeight: "800",
      color: beerText,
      letterSpacing: 0.2,
    },

    beerList: {
      gap: verticalScale(6),
    },

    beerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    beerPlace: {
      fontSize: moderateScale(13),
      color: beerSubText,
      fontWeight: "500",
    },

    beerPrice: {
      fontSize: moderateScale(13),
      color: beerText,
      fontWeight: "700",
    },
  });
};

export const getIconColor = (isDarkMode: boolean) => Color.BuzzifyLavender;
export const getBeerIconColor = (isDarkMode: boolean) => (isDarkMode ? "#E8C97A" : Color.DarkBrown);

export default createStyles;
