import { useAuth } from "../authContext";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
// import { Audio } from "expo-audio";

export const triggerFeedback = async () => {
  const { user } = useAuth();
  if (user?.settings?.vibrations) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  if (user?.settings?.sounds) {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sounds/feedback.mp3")
    );
    await sound.playAsync();
  }
};
