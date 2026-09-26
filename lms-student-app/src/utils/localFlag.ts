import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "lms_onboarding_complete";

const AsyncStorageFallback = {
  async isOnboardingComplete(): Promise<boolean> {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === "true";
  },
  async setOnboardingComplete(): Promise<void> {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
  },
};

export default AsyncStorageFallback;
