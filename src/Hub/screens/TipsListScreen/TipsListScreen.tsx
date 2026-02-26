import ScreenHeader from "@/src/Common/components/ScreenHeader/ScreenHeader";
import { useNavigation } from "expo-router";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./tipsListScreenStyles";
import Color from "@/src/Common/constants/Color";
import React, { useEffect, useState } from "react";
import { useAuthProvider } from "@/src/Common/context/AuthProvider";
import { useServiceProvider } from "@/src/Common/context/ServiceProvider";
import { useModalProvider } from "@/src/Common/context/ModalProvider";
import { GameTip, PagedResponse } from "@/src/Common/constants/Types";

export const TipsListScreen = () => {
  const navigation: any = useNavigation();
  const [openCards, setOpenCards] = useState<Set<string>>(new Set());
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

  const handleCardToggled = (id: string) => {
    setOpenCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Spill tips" backgroundColor={Color.LightGray} onBackPressed={() => navigation.goBack()} />

      {pagedResponse.items.map((tip) => (
        <React.Fragment key={tip.id}>
          <TouchableOpacity style={styles.card} onPress={() => handleCardToggled(tip.id)}>
            <View style={styles.innerCard}>
              <Text style={styles.header}>{tip.header}</Text>
              <Text style={styles.phone}>{tip.mobile_phone}</Text>
              {openCards.has(tip.id) && <Text style={styles.description}>{tip.description}</Text>}
            </View>
          </TouchableOpacity>

          <View style={styles.separator} />
        </React.Fragment>
      ))}
    </View>
  );
};
