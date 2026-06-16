import { useMemo } from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSize, Spacing } from "@/constants/colors";
import { getWorldCupMatches, groupMatchesByDate } from "@/data/matches";
import { MatchCard } from "@/components/MatchCard";
import { useQuery } from "@tanstack/react-query";

export default function MatchesScreen() {
  const { data: matches = [], isLoading, refetch } = useQuery({
    queryKey: ["worldcup-matches"],
    queryFn: () => Promise.resolve(getWorldCupMatches()),
    staleTime: 5 * 60 * 1000,
  });

  const grouped = useMemo(() => groupMatchesByDate(matches), [matches]);

  const liveCount = useMemo(
    () => matches.filter((m) => m.status === "live" || m.status === "halftime").length,
    [matches]
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => refetch()}
            tintColor={Colors.gold}
            colors={[Colors.gold]}
          />
        }
      >
        {/* Header */}
        <Animated.View entering={FadeInUp.springify()} style={styles.header}>
          <Text style={styles.title}>Coupe du Monde 2026</Text>
          <Text style={styles.subtitle}>
            {liveCount > 0
              ? `${liveCount} match${liveCount > 1 ? "s" : ""} en direct`
              : "Suivez tous les matchs"}
          </Text>
          <View style={styles.headerAccent} />
        </Animated.View>

        {/* Live banner */}
        {liveCount > 0 && (
          <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.liveBanner}>
            <View style={styles.livePulse} />
            <Text style={styles.liveBannerText}>
              {liveCount} match{liveCount > 1 ? "s" : ""} en direct — regardez sur l'onglet Streaming
            </Text>
          </Animated.View>
        )}

        {/* Match groups */}
        {grouped.map((group, gi) => (
          <View key={group.date} style={styles.groupSection}>
            <Text style={styles.dateLabel}>{group.label}</Text>
            <View style={styles.dateLine} />
            {group.matches.map((match, mi) => (
              <MatchCard key={match.id} match={match} index={mi} />
            ))}
          </View>
        ))}

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
  liveBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.fifaRed,
    borderRadius: 12,
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  livePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  liveBannerText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: "700",
    flex: 1,
  },
  groupSection: {
    marginBottom: Spacing.lg,
  },
  dateLabel: {
    color: Colors.gold,
    fontSize: FontSize.md,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  dateLine: {
    height: 1,
    backgroundColor: Colors.borderGlow,
    marginBottom: Spacing.md,
  },
  bottomSpacer: {
    height: 100,
  },
});
