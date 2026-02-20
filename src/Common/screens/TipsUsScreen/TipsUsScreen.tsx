import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "./tipsUsScreenStyles";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "expo-router";
import { useModalProvider } from "../../context/ModalProvider";
import { Feather } from "@expo/vector-icons";
import Color from "../../constants/Color";
import ScreenHeader from "../../components/ScreenHeader/ScreenHeader";
import { moderateScale } from "../../utils/dimensions";
import { useState } from "react";
import { useServiceProvider } from "../../context/ServiceProvider";
import { CreateGameTipRequest } from "../../constants/Types";

export const TipsUsScreen = () => {
  const navigation: any = useNavigation();
  const { displayInfoModal, displayErrorModal } = useModalProvider();
  const { gameService } = useServiceProvider();

  const [createRequest, setCreateRequest] = useState<CreateGameTipRequest>({
    header: "",
    mobile_phone: "",
    description: "",
  });

  const handleCreateTip = async () => {
    // Validate name/header (3-30 chars)
    if (!createRequest.header || createRequest.header.trim().length === 0) {
      displayErrorModal("Fyll inn navn.");
      return;
    }

    if (createRequest.header.trim().length < 3) {
      displayErrorModal("Navn må ha minst 3 tegn.");
      return;
    }

    if (createRequest.header.length > 30) {
      displayErrorModal("Navn er for langt.");
      return;
    }

    // Validate phone number (1-20 chars)
    if (!createRequest.mobile_phone || createRequest.mobile_phone.trim().length === 0) {
      displayErrorModal("Fyll inn mobilnummer.");
      return;
    }

    if (createRequest.mobile_phone.length > 20) {
      displayErrorModal("Mobilnummer er for langt.");
      return;
    }

    // Validate description (8-300 chars)
    if (!createRequest.description || createRequest.description.trim().length === 0) {
      displayErrorModal("Beskriv ideen.");
      return;
    }

    if (createRequest.description.length < 8) {
      displayErrorModal("Ideen er for kort.");
      return;
    }

    if (createRequest.description.length > 300) {
      displayErrorModal("Ideen er for lang.");
      return;
    }

    const result = await gameService().createGameTip(createRequest);
    if (result.isError()) {
      console.error("Create tip failed: ", result.error);
      displayErrorModal("Kunne ikke sende tips.");
      return;
    }
    displayInfoModal("Takk for tipset!", "Takk", () => navigation.goBack());
  };

  const handleInfoPressed = () => {
    console.log("Info pressed");
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Tips oss" backgroundColor={Color.LightGray} onBackPressed={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subHeader}>Send oss ditt spillforslag!</Text>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <Feather
              style={{ paddingLeft: moderateScale(15), paddingRight: moderateScale(10) }}
              name="user"
              size={24}
              color={Color.OffBlack}
            />
            <TextInput
              style={styles.input}
              placeholder="Navn"
              maxLength={30}
              value={createRequest.header}
              onChangeText={(input) => setCreateRequest((prev) => ({ ...prev, header: input }))}
              placeholderTextColor={Color.DarkerGray}
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <Feather
              style={{ paddingLeft: moderateScale(15), paddingRight: moderateScale(10) }}
              name="phone"
              size={24}
              color={Color.OffBlack}
            />
            <TextInput
              style={styles.input}
              placeholder="Mobil"
              placeholderTextColor={Color.DarkerGray}
              keyboardType="phone-pad"
              maxLength={20}
              value={createRequest.mobile_phone}
              onChangeText={(input) => setCreateRequest((prev) => ({ ...prev, mobile_phone: input }))}
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.multilineContainer}>
            <Feather
              style={{ paddingLeft: moderateScale(15), paddingRight: moderateScale(10), paddingTop: moderateScale(5) }}
              name="edit"
              size={24}
              color={Color.OffBlack}
            />
            <TextInput
              style={styles.multiline}
              placeholder="Din ide..."
              placeholderTextColor={Color.DarkerGray}
              multiline={true}
              textAlignVertical="top"
              scrollEnabled={true}
              maxLength={300}
              value={createRequest.description}
              onChangeText={(input) => setCreateRequest((prev) => ({ ...prev, description: input }))}
            />
          </View>
          <Text style={styles.charCounter}>{createRequest.description.length}/300</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleCreateTip}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};
