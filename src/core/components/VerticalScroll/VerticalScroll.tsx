import { ReactNode, RefObject } from "react";
import { Dimensions, ScrollView } from "react-native";
import { verticalScale } from "../../utils/dimensions";

interface HorizontalScrollProps {
  children: ReactNode;
  scrollRef?: RefObject<ScrollView | null>;
}

const { height } = Dimensions.get("window");

export const VerticalScroll = ({ children, scrollRef }: HorizontalScrollProps) => {
  return (
    <ScrollView
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
      style={{
        width: "100%",
        backgroundColor: "transparent",
        height: height,
      }}
      contentContainerStyle={{
        alignItems: "center",
        gap: verticalScale(15),
        paddingBottom: verticalScale(20),
      }}
    >
      {children}
    </ScrollView>
  );
};

export default VerticalScroll;
