import { ReactNode, useEffect, useState, RefObject } from "react";
import { Keyboard, Platform, TouchableWithoutFeedback, View, Animated, Dimensions, TextInput } from "react-native";

interface KeyboardAvoidingWrapperProps {
  children: ReactNode;
  backgroundColor?: string;
  anchorRef?: RefObject<View | null>;
}

const PADDING_ABOVE_KEYBOARD = 20;

export const KeyboardAvoidingWrapper = ({ children, backgroundColor, anchorRef }: KeyboardAvoidingWrapperProps) => {
  const [translateY] = useState(new Animated.Value(0));

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = Keyboard.addListener(showEvent, (e) => {
      const screenHeight = Dimensions.get("window").height;
      const keyboardTop = screenHeight - e.endCoordinates.height;
      const duration = Platform.OS === "ios" ? e.duration : 150;

      const measure = (ref: any) => {
        ref.measure((_x: number, _y: number, _width: number, height: number, _pageX: number, pageY: number) => {
          if (pageY === 0 && height === 0) {
            Animated.timing(translateY, {
              toValue: -(e.endCoordinates.height / 2),
              duration,
              useNativeDriver: true,
            }).start();
            return;
          }
          const elementBottom = pageY + height;
          const overlap = elementBottom - keyboardTop + PADDING_ABOVE_KEYBOARD;
          Animated.timing(translateY, {
            toValue: overlap > 0 ? -overlap : 0,
            duration,
            useNativeDriver: true,
          }).start();
        });
      };

      if (anchorRef?.current) {
        measure(anchorRef.current);
      } else {
        const focusedInput = TextInput.State.currentlyFocusedInput();
        if (focusedInput) {
          measure(focusedInput);
        } else {
          Animated.timing(translateY, {
            toValue: -(e.endCoordinates.height / 2),
            duration,
            useNativeDriver: true,
          }).start();
        }
      }
    });

    const onHide = Keyboard.addListener(hideEvent, (e) => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: Platform.OS === "ios" ? e.duration : 150,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor }}>
        <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>{children}</Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};
