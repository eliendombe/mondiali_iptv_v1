import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Heart, MapPin, Trophy } from "lucide-react-native";
import { useMemo } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { Colors, FontSize, Radius, Spacing } from "@/constants/colors";
import { TEAM_BY_ID } from "@/data/teams";
import { getWorldCupMatches } from "@/data/matches";
import type { Match } from "@/data/matches";
import { useFavorites } from "@/contexts/FavoritesContext";
import { LiveIndicator } from "@/components/LiveIndicator";

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isMatchFav, toggleMatch } = useFavorites();

  const match = useMemo(() => {
    const all = getWorldCupMatches();
    return all.find((m) => m.id === id) ?? null;
  }, [id]);

  if (!match) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>Match non trouvé</Text>
      </SafeAreaView>
    );
  }

  const home = TEAM_BY_ID[match.homeTeamId];
  const away = TEAM_BY_ID[match.awayTeamId];
  const isLive = match.status === "live" || match.status === "halftime";
  const isFinished = match.status === "finished";
  const fav = isMatchFav(match.id);

  const stageLabels: Record<Match["stage"], string> = {
    group: `Groupe ${match.group} — Phase de groupes`,
    round_of_32: "16èmes de finale",
    round_of_16: "8èmes de finale",
    quarterfinal: "Quarts de finale",
    semifinal: "Demi-finale",
    third_place: "Match pour la 3ème place",
    final: "Finale",
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Nav bar */}
        <Animated.View entering={FadeInDown.springify()} style={styles.navBar}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={22} color={Colors.white} />
          </Pressable>
          <Pressable
            onPress={() => toggleMatch(match.id)}
            style={styles.favButton}
          >
            <Heart
              size={22}
              color={fav ? Colors.fifaRed : Colors.white}
              fill={fav ? Colors.fifaRed : "none"}
            />
          </Pressable>
        </Animated.View>

        {/* Match card */}
        <Animated.View
          entering={FadeInUp.delay(100).springify()}
          style={styles.matchCard}
        >
          {/* Stage */}
          <View style={styles.stageRow}>
            <Trophy size={14} color={Colors.gold} />
            <Text style={styles.stageText}>{stageLabels[match.stage]}</Text>
            {isLive && <LiveIndicator />}
            {isFinished && (
              <View style={styles.finishedBadge}>
                <Text style={styles.finishedText}>Terminé</Text>
              </View>
            )}
          </View>

          {/* Teams + Score */}
          <View style={styles.teamsBlock}>
            {/* Home */}
            <View style={styles.teamBlock}>
              <Text style={styles.teamFlag}>{home.flag}</Text>
              <Text style={styles.teamName}>{home.name}</Text>
              <Text style={styles.teamRank}>FIFA #{home.fifaRank}</Text>
            </View>

            {/* Score */}
            <View style={styles.scoreBlock}>
              {match.status === "upcoming" ? (
                <View style={styles.upcomingScore}>
                  <Text style={styles.timeText}>{match.time}</Text>
                  <Text style={styles.vsText}>VS</Text>
                </View>
              ) : (
                <View style={styles.scoreRow}>
                  <Text style={[styles.scoreNumber, isLive && styles.scoreLive]}>
                    {match.homeScore}
                  </Text>
                  <Text style={styles.scoreDivider}>-</Text>
                  <Text style={[styles.scoreNumber, isLive && styles.scoreLive]}>
                    {match.awayScore}
                  </Text>
                </View>
              )}
            </View>

            {/* Away */}
            <View style={styles.teamBlock}>
              <Text style={styles.teamFlag}>{away.flag}</Text>
              <Text style={styles.teamName}>{away.name}</Text>
              <Text style={styles.teamRank}>FIFA #{away.fifaRank}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Match info */}
        <Animated.View
          entering={FadeInUp.delay(200).springify()}
          style={styles.infoCard}
        >
          <View style={styles.infoRow}>
            <MapPin size={16} color={Colors.whiteMuted} />
            <Text style={styles.infoText}>{match.venue}</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoDot} />
            <Text style={styles.infoText}>
              {match.date} à {match.time}
            </Text>
          </View>
        </Animated.View>

        {/* Events timeline */}
        {match.events.length > 0 && (
          <Animated.View
            entering={FadeInUp.delay(300).springify()}
            style={styles.eventsSection}
          >
            <Text style={styles.eventsTitle}>Chronologie</Text>
            {match.events.map((ev, i) => {
              const isGoal = ev.type === "goal";
              const isCard = ev.type === "yellow_card" || ev.type === "red_card";
              const team = TEAM_BY_ID[ev.teamId];
              return (
                <View key={i} style={styles.eventRow}>
                  <Text style={styles.eventMinute}>{ev.minute}'</Text>
                  <View
                    style={[
                      styles.eventIcon,
                      isGoal && styles.eventIconGoal,
                      isCard && styles.eventIconCard,
                    ]}
                  >
                    <Text style={styles.eventIconText}>
                      {isGoal ? "⚽" : ev.type === "red_card" ? "🟥" : "🟨"}
                    </Text>
                  </View>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventPlayer}>{ev.player}</Text>
                    <Text style={styles.eventTeam}>{team.shortName}</Text>
                    {ev.detail && (
                      <Text style={styles.eventDetail}>{ev.detail}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </Animated.View>
        )}

        {/* Broadcast channels */}
        {match.broadcastChannels.length > 0 && (
          <Animated.View
            entering={FadeInUp.delay(400).springify()}
            style={styles.broadcastSection}
          >
            <Text style={styles.eventsTitle}>Diffuseurs TV</Text>
            <View style={styles.broadcastChips}>
              {match.broadcastChannels.map((ch) => (
                <View key={ch} style={styles.broadcastChip}>
                  <Text style={styles.broadcastChipText}>{ch}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.broadcastHint}>
              Retrouvez ces chaînes dans l'onglet Streaming
            </Text>
          </Animated.View>
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
    paddingTop: Spacing.sm,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  favButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  matchCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  stageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  stageText: {
    color: Colors.gold,
    fontSize: FontSize.sm,
    fontWeight: "700",
    flex: 1,
  },
  finishedBadge: {
    backgroundColor: Colors.whiteSubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  finishedText: {
    color: Colors.whiteDim,
    fontSize: FontSize.xs,
    fontWeight: "600",
  },
  teamsBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamBlock: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  teamFlag: {
    fontSize: 42,
  },
  teamName: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: "800",
    textAlign: "center",
  },
  teamRank: {
    color: Colors.whiteMuted,
    fontSize: FontSize.xs,
  },
  scoreBlock: {
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  scoreNumber: {
    color: Colors.white,
    fontSize: FontSize.score,
    fontWeight: "900",
  },
  scoreLive: {
    color: Colors.liveGreen,
  },
  scoreDivider: {
    color: Colors.whiteMuted,
    fontSize: FontSize.score,
    fontWeight: "300",
  },
  upcomingScore: {
    alignItems: "center",
  },
  timeText: {
    color: Colors.gold,
    fontSize: FontSize.xxl,
    fontWeight: "900",
  },
  vsText: {
    color: Colors.whiteMuted,
    fontSize: FontSize.xs,
    fontWeight: "700",
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  infoText: {
    color: Colors.whiteDim,
    fontSize: FontSize.sm,
    fontWeight: "600",
  },
  infoDot: {
    width: 16,
    alignItems: "center",
  },
  eventsSection: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  eventsTitle: {
    color: Colors.gold,
    fontSize: FontSize.md,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  eventMinute: {
    color: Colors.whiteMuted,
    fontSize: FontSize.sm,
    fontWeight: "700",
    width: 32,
  },
  eventIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceHighlight,
    alignItems: "center",
    justifyContent: "center",
  },
  eventIconGoal: {
    backgroundColor: Colors.goldMuted,
  },
  eventIconCard: {
    backgroundColor: Colors.surfaceHighlight,
  },
  eventIconText: {
    fontSize: 14,
  },
  eventInfo: {
    flex: 1,
  },
  eventPlayer: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: "700",
  },
  eventTeam: {
    color: Colors.whiteMuted,
    fontSize: FontSize.xs,
  },
  eventDetail: {
    color: Colors.whiteMuted,
    fontSize: FontSize.xs,
    fontStyle: "italic",
  },
  broadcastSection: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  broadcastChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  broadcastChip: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  broadcastChipText: {
    color: Colors.whiteDim,
    fontSize: FontSize.xs,
    fontWeight: "600",
  },
  broadcastHint: {
    color: Colors.goldDim,
    fontSize: FontSize.xs,
    marginTop: Spacing.sm,
    fontStyle: "italic",
  },
  notFound: {
    color: Colors.white,
    fontSize: FontSize.lg,
    textAlign: "center",
    marginTop: 100,
  },
  bottomSpacer: {
    height: 100,
  },
});
