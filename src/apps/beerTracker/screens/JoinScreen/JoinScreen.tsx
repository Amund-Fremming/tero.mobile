import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import Color from "@/src/core/constants/Color";
import { moderateScale } from "@/src/core/utils/dimensions";
import { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BeerTrackerScreen } from "../../constants/beerTrackerTypes";
import { useBeerTrackerProvider } from "../../context/BeerTrackerProvider";
import { joinGame } from "../../services/beerTrackerService";

export const JoinScreen = () => {
  const { gameId, setScreen, setPlayerName, clearBeerTrackerValues } = useBeerTrackerProvider();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async () => {
    if (!name.trim()) {
      setError("Skriv inn navnet ditt");
      return;
    }
    if (!gameId) return;
    setLoading(true);
    setError("");

    const result = await joinGame(gameId, name.trim());
    if (result.isError()) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setPlayerName(name.trim());
    setScreen(BeerTrackerScreen.Game);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader title="Bli med" onBackPressed={clearBeerTrackerValues} titleFontSize={moderateScale(36)} />
      <View style={{ flex: 1, padding: moderateScale(24), gap: moderateScale(16), justifyContent: "center" }}>
        <Text style={{ fontSize: moderateScale(16), textAlign: "center", color: Color.Gray }}>
          Rom: {gameId}
        </Text>
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
        {error !== "" && <Text style={{ color: Color.Red, textAlign: "center" }}>{error}</Text>}
        <TouchableOpacity
          onPress={handleJoin}
          disabled={loading}
          style={{
            backgroundColor: Color.BuzzifyLavender,
            borderRadius: moderateScale(12),
            paddingVertical: moderateScale(16),
            alignItems: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator color={Color.White} />
          ) : (
            <Text style={{ color: Color.White, fontSize: moderateScale(20), fontWeight: "700" }}>Bli med</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JoinScreen;
