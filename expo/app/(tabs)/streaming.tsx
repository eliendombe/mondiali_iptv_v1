import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Search, Tv, WifiOff } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Colors, FontSize, Radius, Spacing } from "@/constants/colors";
import { ChannelCard } from "@/components/ChannelCard";
import type { IPTVChannel } from "@/services/iptvService";
import { fetchSportsChannels, getFeaturedChannels, searchChannels } from "@/services/iptvService";

export default function StreamingScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: channels = [], isLoading, error } = useQuery({
    queryKey: ["iptv-sports-channels"],
    queryFn: fetchSportsChannels,
    staleTime: 30 * 60 * 1000,
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return channels;
    return searchChannels(channels, search);
  }, [channels, search]);

  const featured = useMemo(() => getFeaturedChannels(channels), [channels]);

  const handlePlay = useCallback(
    (channel: IPTVChannel) => {
      router.push({
        pathname: "/player",
        params: { url: encodeURIComponent(channel.url), name: channel.name },
      });
    },
    [router]
  );

  const displayChannels = search.trim() ? filtered : channels;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInUp.springify()} style={styles.header}>
          <Text style={styles.title}>Regarder en direct</Text>
          <Text style={styles.subtitle}>Streaming TV sportive mondiale</Text>
          <View style={styles.headerAccent} />
        </Animated.View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Search size={18} color={Colors.whiteMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une chaîne..."
            placeholderTextColor={Colors.whiteMuted}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
          />
        </View>

        {/* Loading */}
        {isLoading && (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={Colors.gold} />
            <Text style={styles.helperText}>Chargement des chaînes...</Text>
          </View>
        )}

        {/* Error / Empty */}
        {error && !isLoading && (
          <View style={styles.centerState}>
            <WifiOff size={40} color={Colors.whiteMuted} />
            <Text style={styles.helperText}>Impossible de charger les chaînes</Text>
            <Text style={styles.helperSubtext}>
              Vérifiez votre connexion et réessayez
            </Text>
          </View>
        )}

        {/* Featured channels */}
        {!isLoading && !search.trim() && featured.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chaînes recommandées</Text>
            {featured.map((ch, i) => (
              <ChannelCard key={ch.id} channel={ch} index={i} onPlay={handlePlay} />
            ))}
          </View>
        )}

        {/* All channels */}
        {!isLoading && displayChannels.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {search.trim()
                ? `${displayChannels.length} résultat${displayChannels.length > 1 ? "s" : ""}`
                : `${displayChannels.length} chaînes sportives`}
            </Text>
            {displayChannels.map((ch, i) => (
              <ChannelCard key={ch.id} channel={ch} index={i} onPlay={handlePlay} />
            ))}
          </View>
        )}

        {!isLoading && !error && displayChannels.length === 0 && (
          <View style={styles.centerState}>
            <Tv size={40} color={Colors.whiteMuted} />
            <Text style={styles.helperText}>Aucune chaîne trouvée</Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.nightBlue,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  header: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    position: "relative",
  },
  title: {
    color: Colors.white,
    fontSize: FontSize.hero,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: Colors.gold,
    fontSize: FontSize.md,
    fontWeight: "600",
    marginTop: 4,
  },
  headerAccent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 40,
    height: 3,
    backgroundColor: Colors.gold,
    borderRadius: 2,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontSize: FontSize.md,
    height: "100%",
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.gold,
    fontSize: FontSize.md,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  centerState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  helperText: {
    color: Colors.whiteDim,
    fontSize: FontSize.md,
    fontWeight: "600",
  },
  helperSubtext: {
    color: Colors.whiteMuted,
    fontSize: FontSize.sm,
  },
  bottomSpacer: {
    height: 100,
  },
});
