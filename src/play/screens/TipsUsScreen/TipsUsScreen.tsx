import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNavigation } from "expo-router";
import { useRef, useState } from "react";
import { Keyboard, ScrollView, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { BigButton } from "../../../core/components/BigButton/BigButton";
import { KeyboardAvoidingWrapper } from "../../../core/components/KeyboardAvoidingWrapper/KeyboardAvoidingWrapper";
import ScreenHeader from "../../../core/components/ScreenHeader/ScreenHeader";
import Color from "../../../core/constants/Color";
import { CreateGameTipRequest } from "../../../core/constants/Types";
import { useModalProvider } from "../../../core/context/ModalProvider";
import { useServiceProvider } from "../../../core/context/ServiceProvider";
import { useThemeProvider } from "../../../core/context/ThemeProvider";
import { moderateScale, verticalScale } from "../../../core/utils/dimensions";
import { createStyles } from "./tipsUsScreenStyles";

export const TipsUsScreen = () => {
  const navigation: any = useNavigation();
  const { displayInfoModal, displayErrorModal } = useModalProvider();
  const { gameService } = useServiceProvider();
  const { theme, darkMode } = useThemeProvider();
  const styles = createStyles(theme, darkMode);

  const [createRequest, setCreateRequest] = useState<CreateGameTipRequest>({
    header: "",
    mobile_phone: "",
    description: "",
  });
  const anchorRef = useRef<View>(null);

  const handleCreateTip = async () => {
    // Validate name/header (3-14 chars)
    if (!createRequest.header || createRequest.header.trim().length === 0) {
      displayErrorModal("Fyll inn navn.");
      return;
    }

    if (createRequest.header.trim().length < 3) {
      displayErrorModal("Navn må ha minst 3 tegn.");
      return;
    }

    if (createRequest.header.length > 14) {
      displayErrorModal("Navn er for langt.");
      return;
    }

    // Validate phone number
    const phoneDigits = createRequest.mobile_phone.trim();
    if (!phoneDigits) {
      displayErrorModal("Fyll inn mobilnummer.");
      return;
    }

    if (!/^\+?\d{7,20}$/.test(phoneDigits)) {
      displayErrorModal("Ugyldig mobilnummer.");
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
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    displayInfoModal("Takk for tipset!", "Takk", () => navigation.goBack());
  };

  const handleNameInput = (input: string) => {
    if (input.length > 14) {
      displayInfoModal("Navn kan ikke være lengre enn 14 tegn.");
      return;
    }
    setCreateRequest((prev) => ({ ...prev, header: input }));
  };

  return (
    <KeyboardAvoidingWrapper backgroundColor={theme.primary} anchorRef={anchorRef}>
      <View style={styles.container}>
        <ScreenHeader title="Tips oss" onBackPressed={() => navigation.goBack()} backgroundColor={theme.primary} />

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
                color={styles.contentColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Navn"
                maxLength={14}
                placeholderTextColor={Color.Gray}
                value={createRequest.header}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                onChangeText={(input) => handleNameInput(input)}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <Feather
                style={{ paddingLeft: moderateScale(15), paddingRight: moderateScale(10) }}
                name="phone"
                size={24}
                color={styles.contentColor}
              />
              <TextInput
                style={styles.input}
                placeholder="Mobil"
                placeholderTextColor={Color.Gray}
                keyboardType="phone-pad"
                maxLength={20}
                value={createRequest.mobile_phone}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                onChangeText={(input) => setCreateRequest((prev) => ({ ...prev, mobile_phone: input }))}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.multilineContainer}>
              <Feather
                style={{
                  paddingLeft: moderateScale(15),
                  paddingRight: moderateScale(10),
                  paddingTop: moderateScale(5),
                }}
                name="edit"
                size={24}
                color={styles.contentColor}
              />
              <TextInput
                style={styles.multiline}
                placeholder="Din ide..."
                placeholderTextColor={Color.Gray}
                multiline={true}
                textAlignVertical="top"
                scrollEnabled={true}
                maxLength={300}
                blurOnSubmit={true}
                value={createRequest.description}
                onChangeText={(input) => setCreateRequest((prev) => ({ ...prev, description: input }))}
              />
            </View>
            <Text style={styles.charCounter}>{createRequest.description.length}/300</Text>
          </View>
        </ScrollView>

        <View style={{ width: "100%", alignItems: "center", position: "absolute", bottom: verticalScale(40) }}>
          <BigButton label="Send" backgroundColor={Color.HomeRed} textColor={Color.White} onPress={handleCreateTip} />
        </View>
      </View>
    </KeyboardAvoidingWrapper>
  );
};
