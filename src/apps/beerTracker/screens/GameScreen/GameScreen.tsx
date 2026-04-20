import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import Color from "@/src/core/constants/Color";
import { moderateScale } from "@/src/core/utils/dimensions";
import * as Haptics from "expo-haptics";
import { useNavigation } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { BeerTrackerGame, BeerTrackerScreen } from "../../constants/beerTrackerTypes";
import { useBeerTrackerProvider } from "../../context/BeerTrackerProvider";
import { finishGame, getGame, incrementBeer, leaveGame } from "../../services/beerTrackerService";

export const GameScreen = () => {
  const navigation: any = useNavigation();
  const { gameId, playerName, setScreen, clearBeerTrackerValues } = useBeerTrackerProvider();
  const [game, setGame] = useState<BeerTrackerGame | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchGame = useCallback(async () => {
    if (!gameId) return;
    const result = await getGame(gameId);
    if (!result.isError()) setGame(result.value);
  }, [gameId]);

  useEffect(() => {
    fetchGame();
    pollRef.current = setInterval(fetchGame, 2500);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchGame]);

  const handleAddBeer = async () => {
    if (!gameId || !playerName || !game) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const result = await incrementBeer(gameId, playerName, game.can_size);
    if (!result.isError()) setGame(result.value);
  };

  const handleLeave = () => {
    Alert.alert("Forlat spill", "Er du sikker?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Forlat",
        style: "destructive",
        onPress: async () => {
          if (gameId && playerName) await leaveGame(gameId, playerName);
          clearBeerTrackerValues();
          navigation.goBack();
        },
      },
    ]);
  };

  const handleFinish = () => {
    Alert.alert("Avslutt spill", "Spillet slettes for alle.", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Avslutt",
        style: "destructive",
        onPress: async () => {
          if (gameId) await finishGame(gameId);
          clearBeerTrackerValues();
          navigation.goBack();
        },
      },
    ]);
  };

  if (!game) return null;

  const sorted = [...game.members].sort((a, b) => b.count - a.count);

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader title={`Rom: ${game.id}`} onBackPressed={handleLeave} titleFontSize={moderateScale(28)} />
      <View style={{ padding: moderateScale(16), gap: moderateScale(12), flex: 1 }}>
        {game.goal && (
          <Text style={{ fontSize: moderateScale(16), textAlign: "center", color: Color.Gray }}>
            Mål: {game.goal} enheter
          </Text>
        )}

        <FlatList
          data={sorted}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{ gap: moderateScale(8) }}
          renderItem={({ item, index }) => {
            const isMe = item.name === playerName;
            const units = item.count / 100;
            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isMe ? Color.BuzzifyLavender : Color.LightGray,
                  borderRadius: moderateScale(12),
                  padding: moderateScale(12),
                  gap: moderateScale(12),
                }}
              >
                <Image
                  source={{ uri: `https://api.dicebear.com/9.x/pixel-art/png?seed=${item.name}` }}
                  style={{ width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20) }}
                />
                <Text style={{ flex: 1, fontSize: moderateScale(16), fontWeight: "600", color: isMe ? Color.White : Color.OffBlack }}>
                  {index + 1}. {item.name}
                </Text>
                <Text style={{ fontSize: moderateScale(20), fontWeight: "700", color: isMe ? Color.White : Color.OffBlack }}>
                  {units.toFixed(1)}
                </Text>
              </View>
            );
          }}
        />

        <TouchableOpacity
          onPress={handleAddBeer}
          style={{
            backgroundColor: Color.BuzzifyOrange,
            borderRadius: moderateScale(16),
            paddingVertical: moderateScale(20),
            alignItems: "center",
          }}
        >
          <Text style={{ color: Color.White, fontSize: moderateScale(24), fontWeight: "800" }}>+1 Øl 🍺</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleFinish} style={{ alignItems: "center", paddingVertical: moderateScale(8) }}>
          <Text style={{ color: Color.Red, fontSize: moderateScale(14) }}>Avslutt spill</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GameScreen;
