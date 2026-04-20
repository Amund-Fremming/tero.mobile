import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import Color from "@/src/core/constants/Color";
import { moderateScale } from "@/src/core/utils/dimensions";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BeerTrackerScreen } from "../../constants/beerTrackerTypes";
import { useBeerTrackerProvider } from "../../context/BeerTrackerProvider";
import { createGame, joinGame } from "../../services/beerTrackerService";

const CAN_SIZES = [0.33, 0.5];

export const HomeScreen = () => {
  const navigation: any = useNavigation();
  const { setScreen, setGameId, setPlayerName } = useBeerTrackerProvider();

  const [canSize, setCanSize] = useState(0.5);
  const [goal, setGoal] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Skriv inn navnet ditt");
      return;
    }
    setLoading(true);
    setError("");

    const goalNum = goal.trim() ? parseInt(goal, 10) : null;
    const result = await createGame(canSize, goalNum);
    if (result.isError()) {
      setError(result.error);
      setLoading(false);
      return;
    }

    const game = result.value;
    const joinResult = await joinGame(game.id, name.trim());
    if (joinResult.isError()) {
      setError(joinResult.error);
      setLoading(false);
      return;
    }

    setGameId(game.id);
    setPlayerName(name.trim());
    setScreen(BeerTrackerScreen.Game);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader title="Beer Tracker" onBackPressed={() => navigation.goBack()} titleFontSize={moderateScale(40)} />
      <View style={{ flex: 1, padding: moderateScale(24), gap: moderateScale(16) }}>
        <Text style={{ fontSize: moderateScale(18), fontWeight: "600" }}>Boks størrelse</Text>
        <View style={{ flexDirection: "row", gap: moderateScale(12) }}>
          {CAN_SIZES.map((size) => (
            <TouchableOpacity
              key={size}
              onPress={() => setCanSize(size)}
              style={{
                flex: 1,
                paddingVertical: moderateScale(14),
                borderRadius: moderateScale(12),
                backgroundColor: canSize === size ? Color.BuzzifyLavender : Color.LightGray,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: moderateScale(18), fontWeight: "600", color: canSize === size ? Color.White : Color.OffBlack }}>
                {size}L
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={{ fontSize: moderateScale(18), fontWeight: "600" }}>Mål (valgfritt)</Text>
        <TextInput
          style={{
            backgroundColor: Color.LightGray,
            borderRadius: moderateScale(12),
            padding: moderateScale(14),
            fontSize: moderateScale(16),
          }}
          placeholder="F.eks. 10"
          placeholderTextColor={Color.Gray}
          keyboardType="number-pad"
          value={goal}
          onChangeText={setGoal}
        />

        <Text style={{ fontSize: moderateScale(18), fontWeight: "600" }}>Ditt navn</Text>
        <TextInput
          style={{
            backgroundColor: Color.LightGray,
            borderRadius: moderateScale(12),
            padding: moderateScale(14),
            fontSize: moderateScale(16),
          }}
          placeholder="Navn"
          placeholderTextColor={Color.Gray}
          value={name}
          onChangeText={(t) => {
            setName(t);
            setError("");
          }}
          autoCapitalize="words"
        />

        {error !== "" && <Text style={{ color: Color.Red, textAlign: "center", fontSize: moderateScale(14) }}>{error}</Text>}

        <TouchableOpacity
          onPress={handleCreate}
          disabled={loading}
          style={{
            backgroundColor: Color.BuzzifyLavender,
            borderRadius: moderateScale(12),
            paddingVertical: moderateScale(16),
            alignItems: "center",
            marginTop: moderateScale(8),
          }}
        >
          {loading ? (
            <ActivityIndicator color={Color.White} />
          ) : (
            <Text style={{ color: Color.White, fontSize: moderateScale(20), fontWeight: "700" }}>Opprett spill</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
