import * as SystemUI from 'expo-system-ui';
import { useColorScheme, Appearance } from "react-native";
import { LocalStorage } from "@/types/Database";
import { Profile, ProfileData } from "@/types/Profile";
import { DarkTheme, DefaultTheme, ThemeProvider, useTheme } from "@react-navigation/native";
import { createContext, useContext, useReducer, ReactNode, Dispatch, useState, useEffect } from "react";
import SplashScreen from './SplashScreen';
import ProfileSetup from './ProfileSetup';
import { applyTheme, useThemeColor } from '@/hooks/useThemeColor';

const ProfileContext = createContext<ProfileData | {}>({});
const ProfileDispatchContext = createContext<(p: ProfileData | any) => void>(() => {});

type ProfileState = {
  loaded: boolean,
  data: ProfileData | undefined
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const _dark = useColorScheme() === 'dark'
  const [theme, setTheme] = useState(applyTheme(_dark, _dark ? DarkTheme : DefaultTheme));
  SystemUI.setBackgroundColorAsync(theme.colors.background).catch((err) => {
    console.log("System UI Error:", err);
  });

  const [profile, setProfile] = useState<ProfileState>({ loaded: false, data: undefined });
  const saveProfile = (data?: ProfileData | any) => {
    LocalStorage.setJSON('profile', data ?? {});
    setProfile({ loaded: true, data: data });
  }

  useEffect(() => {
    LocalStorage.getJSON('profile').then((output) => {
      let valid = Profile.isValid(output);
      setProfile({ loaded: true, data: valid ? output as ProfileData : undefined });
    });
  }, [])

  return (
    <ProfileContext.Provider value={profile.data ?? {}}>
      <ProfileDispatchContext.Provider value={saveProfile}>
        <ThemeProvider value={theme}>
          { 
            !profile.loaded 
              ? <SplashScreen /> 
              : Profile.isValid(profile.data) 
              ? children 
              : <ProfileSetup initialProfile={profile.data} onSubmit={saveProfile} /> 
          }
        </ThemeProvider>
      </ProfileDispatchContext.Provider>
    </ProfileContext.Provider>
  )
}

export const useProfileContext = () => useContext(ProfileContext);
export const useProfileDispatchContext = () => useContext(ProfileDispatchContext);

// const taskReducer = (state: ProfileState, action: { type: string, data: ProfileState | any }) => {
//   const { type, data } = action; const valid = Profile.isValid(data?.data);
//   if(type === 'SAVE_USER' && valid) { 
//     LocalStorage.setJSON('profile', data.data); 
//   }

//   if(type === 'SET_THEME') { 
//     let themed_data = applyTheme(useColorScheme() === 'dark', data);
//     setTheme(themed_data);
//     SystemUI.setBackgroundColorAsync(themed_data.colors.background);
//   }
  
//   return valid ? data : state;
// }

// const [profile, dispatch] = useReducer(taskReducer, { loaded: false, data: {} });
// LocalStorage.getJSON('profile').then((output) => {
//   dispatch({ type: 'LOAD_USER', data: { loaded: true, data: output } });
// });

// const saveProfile = (p: ProfileData) => {
//   dispatch({ type: 'SAVE_USER', data: { loaded: true, data: p } });
// }