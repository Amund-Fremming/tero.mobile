import { View, Text, Pressable, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { styles } from "./savedGameScreenStyles";
import VerticalScroll from "@/src/common/wrappers/VerticalScroll";
import { useEffect, useState } from "react";
import { useServiceProvider } from "@/src/common/context/ServiceProvider";
import { useAuthProvider } from "@/src/common/context/AuthProvider";
import { useModalProvider } from "@/src/common/context/ModalProvider";
import { GameBase } from "@/src/common/constants/Types";
import { useNavigation } from "expo-router";
import { screenHeight, verticalScale } from "@/src/common/utils/dimensions";
import Color from "@/src/common/constants/Color";
import { Feather } from "@expo/vector-icons";
import ScreenHeader from "@/src/common/components/ScreenHeader/ScreenHeader";

export const SavedGamesScreen = () => {
  const navigation: any = useNavigation();
  const { gameService } = useServiceProvider();
  const { pseudoId: guestId, accessToken } = useAuthProvider();
  const { displayErrorModal } = useModalProvider();

  const [games, setGames] = useState<GameBase[] | undefined>(undefined);
  const [pageNum, setPageNum] = useState<number>(0);

  const hasPrev = () => pageNum > 0;

  useEffect(() => {
    fetchSavedGames();
  }, []);

  const handleUnsavePressed = async (game: GameBase) => {
    if (!accessToken) {
      console.warn("No access token present");
      return;
    }

    setGames((prev) => prev?.filter((g) => g.id != game.id));
    await gameService().unsaveGame(accessToken, game.id);
  };

  const fetchSavedGames = async () => {
    if (!accessToken) {
      console.warn("No access token present");
      return;
    }

    const result = await gameService().getSavedGames(accessToken, pageNum);
    if (result.isError()) {
      displayErrorModal(result.error);
      return;
    }

    const page = result.value;
    setGames(page.items);
  };

  const handleGamePressed = (id: string) => {
    //
  };

  const handleInfoPressed = () => {
    //
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
      style={{
        width: "100%",
        backgroundColor: Color.LightGray,
        height: screenHeight(),
      }}
      contentContainerStyle={{
        alignItems: "center",
        gap: verticalScale(15),
        paddingBottom: verticalScale(200),
      }}
    >
      <ScreenHeader
        title="Dine spill"
        onBackPressed={() => navigation.goBack()}
        onInfoPress={handleInfoPressed}
        backgroundColor={Color.LightGray}
      />

      {!games || (games.length == 0 && <Text>Du har ingen lagrede spill</Text>)}

      {games &&
        games.map((game) => (
          <TouchableOpacity onPress={() => handleGamePressed(game.id)} style={styles.card} key={game.id}>
            <View style={styles.innerCard}>
              <View style={styles.iconCardOuter}>
                <View style={styles.iconCardInner}></View>
              </View>

              <View style={styles.textWrapper}>
                <Text style={styles.cardHeader}>{game.name}</Text>
                <Text style={styles.cardParagraph}>{game.description}</Text>
              </View>
            </View>
            <Pressable style={styles.icon} onPress={() => handleUnsavePressed(game)}>
              <Feather name="x" size={30} />
            </Pressable>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
};
