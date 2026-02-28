import React, { createContext, ReactNode, useContext, useRef, useState } from "react";
import InfoModal from "../components/InfoModal/InfoModal";
import ActionModal from "../components/ActionModal/ActionModal";
import { View, StyleSheet, Dimensions } from "react-native";
import LoadingModal from "../components/LoadingModal/LoadingModal";

enum DisplayOption {
  None,
  Error,
  Info,
  Action,
  Loading,
}

interface IModalContext {
  displayActionModal: (message: string, onLeftCloseAction: () => void, onRightCloseAction: () => void) => void;
  displayErrorModal: (errorMessage: string, onCloseAction?: () => void) => void;
  displayInfoModal: (message: string, header?: string, onCloseAction?: () => void) => void;
  displayLoadingModal: (onCloseAction: () => void, message?: string) => void;
  closeLoadingModal: () => void;
}

const defaultContextValue: IModalContext = {
  displayActionModal: () => {},
  displayErrorModal: () => {},
  displayInfoModal: () => {},
  displayLoadingModal: () => {},
  closeLoadingModal: () => {},
};

const ModalContext = createContext<IModalContext>(defaultContextValue);

export const useModalProvider = () => useContext(ModalContext);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [displayOption, setDisplayOption] = useState<DisplayOption>(DisplayOption.None);
  const [message, setMessage] = useState<string>("");
  const [header, setHeader] = useState<string>("");
  const onCloseActionRef = useRef<(() => void) | undefined>(undefined);
  const onLeftActionRef = useRef<(() => void) | undefined>(undefined);
  const onRightActionRef = useRef<(() => void) | undefined>(undefined);

  const displayErrorModal = (message: string, onCloseAction?: () => void) => {
    onCloseActionRef.current = onCloseAction;
    setDisplayOption(DisplayOption.Error);
    setMessage(message);
    setHeader("Oops");
  };

  const displayInfoModal = (message: string, header?: string, onCloseAction?: () => void) => {
    onCloseActionRef.current = onCloseAction;
    setDisplayOption(DisplayOption.Info);
    setMessage(message);
    setHeader(header ? header : "Heisann");
  };

  const displayActionModal = (message: string, onLeftCloseAction: () => void, onRightCloseAction: () => void) => {
    onLeftActionRef.current = onLeftCloseAction;
    onRightActionRef.current = onRightCloseAction;
    setDisplayOption(DisplayOption.Action);
    setMessage(message);
  };

  const displayLoadingModal = (onCloseAction: () => void, message?: string) => {
    setDisplayOption(DisplayOption.Action);
    onCloseActionRef.current = onCloseAction;
    setMessage(message ?? "Forbindelsen er brutt. Vi prøver å koble deg til igjen.");
    setDisplayOption(DisplayOption.Loading);
  };

  const handleClose = () => {
    onCloseActionRef.current?.();
    setDisplayOption(DisplayOption.None);
  };

  const handleLeftClick = () => {
    onLeftActionRef.current?.();
    setDisplayOption(DisplayOption.None);
  };

  const handleRightClick = () => {
    onRightActionRef.current?.();
    setDisplayOption(DisplayOption.None);
  };

  const closeLoadingModal = () => setDisplayOption(DisplayOption.None);

  const value = {
    displayErrorModal,
    displayInfoModal,
    displayActionModal,
    displayLoadingModal,
    closeLoadingModal,
  };

  const renderModal = () => {
    switch (displayOption) {
      case DisplayOption.Action:
        return <ActionModal message={message} onLeftClick={handleLeftClick} onRightClick={handleRightClick} />;
      case DisplayOption.Error:
      case DisplayOption.Info:
        return (
          <InfoModal
            message={message}
            header={header}
            isError={displayOption === DisplayOption.Error}
            onCloseFunc={handleClose}
          />
        );
      case DisplayOption.Loading:
        return <LoadingModal onCloseFunc={onCloseActionRef.current} message={message} />;
      case DisplayOption.None:
        return <></>;
    }
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {displayOption !== DisplayOption.None && <View style={styles.overlay}>{renderModal()}</View>}
    </ModalContext.Provider>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    zIndex: 1000,
  },
});

export default ModalProvider;
