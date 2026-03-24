import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { moderateScale } from "../../utils/dimensions";
import styles from "./screenHeaderStyles";

interface ScreenHeaderProps {
  title: string;
  onBackPressed: () => void;
  onInfoPress?: () => void;
  infoIconOverride?: "?" | "user" | "log-out" | "x";
  showBorder?: boolean;
  backgroundColor?: string;
  children?: ReactNode;
}

export const ScreenHeader = ({
  title,
  onBackPressed,
  onInfoPress,
  infoIconOverride = "?",
  showBorder = false,
  backgroundColor,
  children,
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
          {children ?? <Text style={styles.header}>{title}</Text>}
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
