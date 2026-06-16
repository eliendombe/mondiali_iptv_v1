import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const MATCH_KEY = "@mondiali/fav_matches";
const CHANNEL_KEY = "@mondiali/fav_channels";

export const [FavoritesProvider, useFavorites] = createContextHook(() => {
  const [favMatches, setFavMatches] = useState<string[]>([]);
  const [favChannels, setFavChannels] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [m, c] = await Promise.all([
          AsyncStorage.getItem(MATCH_KEY),
          AsyncStorage.getItem(CHANNEL_KEY),
        ]);
        if (m) setFavMatches(JSON.parse(m));
        if (c) setFavChannels(JSON.parse(c));
      } catch {
        // ignore
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persistMatches = useCallback(async (ids: string[]) => {
    setFavMatches(ids);
    await AsyncStorage.setItem(MATCH_KEY, JSON.stringify(ids));
  }, []);

  const persistChannels = useCallback(async (ids: string[]) => {
    setFavChannels(ids);
    await AsyncStorage.setItem(CHANNEL_KEY, JSON.stringify(ids));
  }, []);

  const toggleMatch = useCallback(
    (id: string) => {
      const next = favMatches.includes(id)
        ? favMatches.filter((m) => m !== id)
        : [...favMatches, id];
      persistMatches(next);
    },
    [favMatches, persistMatches]
  );

  const toggleChannel = useCallback(
    (id: string) => {
      const next = favChannels.includes(id)
        ? favChannels.filter((c) => c !== id)
        : [...favChannels, id];
      persistChannels(next);
    },
    [favChannels, persistChannels]
  );

  const isMatchFav = useCallback(
    (id: string) => favMatches.includes(id),
    [favMatches]
  );

  const isChannelFav = useCallback(
    (id: string) => favChannels.includes(id),
    [favChannels]
  );

  return {
    favMatches,
    favChannels,
    loaded,
    toggleMatch,
    toggleChannel,
    isMatchFav,
    isChannelFav,
  };
});