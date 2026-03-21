import Color from "@/src/core/constants/Color";
import Font from "@/src/core/constants/Font";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { horizontalScale, moderateScale, verticalScale } from "../utils/dimensions";

interface IToastContext {
  displayToast: (durationSeconds?: number) => void;
  closeToast: () => void;
  displayClickableToast: (header: string, subHeader: string, onClick: () => void) => void;
  closeClickableToast: () => void;
}

const defaultContextValue: IToastContext = {
  displayToast: () => {},
  closeToast: () => {},
  displayClickableToast: () => {},
  closeClickableToast: () => {},
};

const ToastContext = createContext<IToastContext>(defaultContextValue);

export const useToastProvider = () => useContext(ToastContext);

interface ToastProviderProps {
  children: ReactNode;
}

const DROP_FROM_Y = -70;
const SHOWN_Y = 0;

const TOAST_MESSAGE = "Spillet ble lagret.";

interface ClickableToastState {
  header: string;
  subHeader: string;
  onClick: () => void;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [clickableToast, setClickableToast] = useState<ClickableToastState | null>(null);

  const translateY = useRef(new Animated.Value(DROP_FROM_Y)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickableHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const translateY2 = useRef(new Animated.Value(DROP_FROM_Y)).current;
  const opacity2 = useRef(new Animated.Value(0)).current;

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const closeToast = () => {
    clearHideTimer();

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: DROP_FROM_Y,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setIsVisible(false);
      }
    });
  };

  const closeClickableToast = () => {
    if (clickableHideTimerRef.current) {
      clearTimeout(clickableHideTimerRef.current);
      clickableHideTimerRef.current = null;
    }
    Animated.parallel([
      Animated.timing(translateY2, {
        toValue: DROP_FROM_Y,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity2, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setClickableToast(null);
    });
  };

  const displayClickableToast = (header: string, subHeader: string, onClick: () => void) => {
    setClickableToast({ header, subHeader, onClick });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    translateY2.setValue(DROP_FROM_Y);
    opacity2.setValue(0);

    Animated.parallel([
      Animated.timing(translateY2, {
        toValue: SHOWN_Y,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity2, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    clickableHideTimerRef.current = setTimeout(() => {
      closeClickableToast();
    }, 3000);
  };

  const displayToast = (durationSeconds: number = 2.2) => {
    clearHideTimer();
    setIsVisible(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    translateY.setValue(DROP_FROM_Y);
    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SHOWN_Y,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const ms = Math.max(0.8, durationSeconds) * 1000;
    hideTimerRef.current = setTimeout(() => {
      closeToast();
    }, ms);
  };

  useEffect(() => {
    return () => {
      clearHideTimer();
    };
  }, []);

  const value = {
    displayToast,
    closeToast,
    displayClickableToast,
    closeClickableToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {isVisible && (
        <View pointerEvents="none" style={styles.overlay}>
          <Animated.View style={[styles.toast, { transform: [{ translateY }], opacity }]}>
            <View style={styles.iconWrapper}>
              <Feather name="check" size={moderateScale(38)} color={Color.White} />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.toastHeader}>Suksess!</Text>
              <Text style={styles.toastText}>{TOAST_MESSAGE}</Text>
            </View>
          </Animated.View>
        </View>
      )}
      {clickableToast && (
        <View pointerEvents="box-none" style={styles.overlay}>
          <Animated.View style={{ transform: [{ translateY: translateY2 }], opacity: opacity2, width: "92%" }}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.clickableToast}
              onPress={() => {
                clickableToast.onClick();
                closeClickableToast();
              }}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name="bulb-outline" size={moderateScale(34)} color={Color.White} />
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.toastHeader}>{clickableToast.header}</Text>
                <Text style={styles.toastText}>{clickableToast.subHeader}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: verticalScale(60),
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 2000,
  },
  toast: {
    width: "92%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(18),
    borderRadius: moderateScale(15),
    backgroundColor: Color.ToastGreen,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: horizontalScale(14),
  },
  textWrapper: {
    flex: 1,
  },
  toastHeader: {
    color: Color.White,
    fontFamily: Font.SintonyBold,
    fontSize: moderateScale(19),
    marginBottom: verticalScale(2),
  },
  toastText: {
    color: Color.White,
    fontFamily: Font.SintonyRegular,
    fontSize: moderateScale(15),
  },
  clickableToast: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(18),
    borderRadius: moderateScale(15),
    backgroundColor: Color.BuzzifyLavender,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default ToastProvider;
