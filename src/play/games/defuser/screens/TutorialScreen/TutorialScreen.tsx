import GenericTutorialScreen from "@/src/play/screens/GenericTutorialScreen/GenericTutorialScreen";
import React from "react";

interface TutorialScreenProps {
  onFinished: () => void;
}

export const TutorialScreen = ({ onFinished }: TutorialScreenProps) => {
  return <GenericTutorialScreen onFinishedPressed={onFinished} />;
};

export default TutorialScreen;
