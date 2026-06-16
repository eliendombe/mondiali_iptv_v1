import { Heart, Tv } from "lucide-react-native";
import { useMemo } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Colors, FontSize, Spacing } from "@/constants/colors";
import { getWorldCupMatches } from "@/data/matches";
import { MatchCard } from "@/components/MatchCard";
import { useFavorites } from "@/contexts/FavoritesContext";

export default function FavoritesScreen() {
  const { favMatches, favChannels, loaded } = useFavorites();
  const allMatches = useMemo(() => getWorldCupMatches(), []);
  const savedMatches = useMemo(
    () => allMatches.filter((m) => favMatches.includes(m.id)),
    [allMatches, favMatches]
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInUp.springify()} style={styles.header}>
          <Text style={styles.title}>Favoris</Text>
          <Text style={styles.subtitle}>Vos matchs et chaînes sauvegardés</Text>
          <View style={styles.headerAccent} />
        </Animated.View>

        {/* Favorite matches */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Matchs ({savedMatches.length})
          </Text>
          {savedMatches.length === 0 ? (
            <View style={styles.emptyState}>
              <Heart size={36} color={Colors.whiteSubtle} />
              <Text style={styles.emptyTitle}>Aucun match favori</Text>
              <Text style={styles.emptyText}>
                Appuyez sur le cœur d'un match pour l'ajouter ici
              </Text>
            </View>
          ) : (
            savedMatches.map((match, i) => (
              <MatchCard key={match.id} match={match} index={i} />
            ))
          )}
        </View>

        {/* Favorite channels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Chaînes ({favChannels.length})
          </Text>
          {favChannels.length === 0 ? (
            <View style={styles.emptyState}>
              <Tv size={36} color={Colors.whiteSubtle} />
              <Text style={styles.emptyTitle}>Aucune chaîne favorite</Text>
              <Text style={styles.emptyText}>
                Appuyez sur le cœur d'une chaîne pour l'ajouter ici
              </Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.helperText}>
                {favChannels.length} chaîne{favChannels.length > 1 ? "s" : ""} sauvegardée{favChannels.length > 1 ? "s" : ""}
              </Text>
              <Text style={styles.emptyText}>
                Retrouvez-les dans l'onglet Streaming
              </Text>
            </View>
          )}
        </View>

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
  emptyState: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.xl,
    alignItems: "center",
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyTitle: {
    color: Colors.whiteDim,
    fontSize: FontSize.md,
    fontWeight: "700",
  },
  emptyText: {
    color: Colors.whiteMuted,
    fontSize: FontSize.sm,
    textAlign: "center",
  },
  helperText: {
    color: Colors.whiteDim,
    fontSize: FontSize.md,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 100,
  },
});