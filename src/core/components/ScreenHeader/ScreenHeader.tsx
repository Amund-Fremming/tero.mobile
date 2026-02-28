import { Text, TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { moderateScale } from "../../utils/dimensions";
import styles from "./screenHeaderStyles";

interface ScreenHeaderProps {
  title: string;
  onBackPressed: () => void;
  onInfoPress?: () => void;
  infoIconOverride?: "?" | "user" | "log-out" | "x";
  showBorder?: boolean;
  backgroundColor?: string;
  miniHeader?: string;
}

export const ScreenHeader = ({
  title,
  onBackPressed,
  onInfoPress,
  infoIconOverride = "?",
  showBorder = false,
  backgroundColor,
  miniHeader,
}: ScreenHeaderProps) => {
  return (
    <View style={[styles.topWrapper, backgroundColor && { backgroundColor }]}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onBackPressed();
          }}
          style={styles.iconWrapper}
        >
          <Feather name="chevron-left" size={moderateScale(45)} />
        </TouchableOpacity>

        <View style={styles.borderAndHeader}>
          {miniHeader && <Text style={styles.miniHeader}>{miniHeader}</Text>}
          <Text style={styles.header}>{title}</Text>
          {showBorder && (
            <View style={styles.borderWrapper}>
              <View style={styles.borderLeft} />
              <View style={styles.borderRight} />
            </View>
          )}
        </View>

        {onInfoPress ? (
          infoIconOverride === "?" ? (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onInfoPress!();
              }}
              style={styles.iconWrapper}
            >
              <Text style={styles.textIcon}>?</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onInfoPress!();
              }}
              style={styles.iconWrapper}
            >
              <Feather name={infoIconOverride} size={moderateScale(35)} />
            </TouchableOpacity>
          )
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </View>
  );
};

export default ScreenHeader;
