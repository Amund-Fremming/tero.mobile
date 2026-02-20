import ScreenHeader from "@/src/common/components/ScreenHeader/ScreenHeader";
import { useNavigation } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { styles } from "./tipsListScreenStyles";
import Color from "@/src/common/constants/Color";
import { useEffect, useState } from "react";
import { useAuthProvider } from "@/src/common/context/AuthProvider";
import { useServiceProvider } from "@/src/common/context/ServiceProvider";
import { useModalProvider } from "@/src/common/context/ModalProvider";
import { GameTip, PagedResponse } from "@/src/common/constants/Types";

export const TipsListScreen = () => {
  const navigation: any = useNavigation();
  const [pagedResponse, setPagedResponse] = useState<PagedResponse<GameTip>>({
    items: [],
    has_next: false,
    has_prev: false,
    page_num: 0,
  });

  const { accessToken } = useAuthProvider();
  const { commonService } = useServiceProvider();
  const { displayErrorModal } = useModalProvider();

  useEffect(() => {
    fetchGameTips(0);
  }, []);

  const fetchGameTips = async (pageNum: number) => {
    if (!accessToken) {
      displayErrorModal("Access token is undefined");
      return;
    }
    const result = await commonService().getGameTips(accessToken, pageNum);
    if (result.isError()) {
      console.error("Failed to get game tips: ", result.error);
      displayErrorModal(result.error);
      return;
    }

    setPagedResponse(result.value);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Spill tips" backgroundColor={Color.LightGray} onBackPressed={() => navigation.goBack()} />

      {pagedResponse.items.map((tip) => (
        <Pressable>
          <Text>{tip.header}</Text>
          <Text>{tip.mobile_phone}</Text>
          <Text>{tip.description}</Text>
        </Pressable>
      ))}
    </View>
  );
};
