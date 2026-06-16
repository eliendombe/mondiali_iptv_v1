import { useRouter } from "expo-router";
import { Heart } from "lucide-react-native";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Colors, FontSize, Radius, Spacing } from "@/constants/colors";
import { TEAM_BY_ID } from "@/data/teams";
import type { Match } from "@/data/matches";
import { useFavorites } from "@/contexts/FavoritesContext";
import { LiveIndicator } from "./LiveIndicator";

interface Props {
  match: Match;
  index: number;
}

export const MatchCard = memo(function MatchCard({ match, index }: Props) {
  const router = useRouter();
  const { isMatchFav, toggleMatch } = useFavorites();
  const home = TEAM_BY_ID[match.homeTeamId];
  const away = TEAM_BY_ID[match.awayTeamId];
  const fav = isMatchFav(match.id);

  const isLive = match.status === "live";
  const isHalftime = match.status === "halftime";
  const isFinished = match.status === "finished";

  const statusLabel = isLive
    ? `${match.homeScore} - ${match.awayScore}`
    : isHalftime
    ? "MT"
    : isFinished
    ? `${match.homeScore} - ${match.awayScore}`
    : match.time;

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => router.push(`/match/${match.id}`)}
      >
        {/* Status bar */}
        <View style={styles.statusRow}>
          {isLive || isHalftime ? (
            <LiveIndicator showLabel />
          ) : isFinished ? (
            <View style={styles.finishedBadge}>
              <Text style={styles.finishedText}>Terminé</Text>
            </View>
          ) : (
            <View style={styles.upcomingBadge}>
              <Text style={styles.upcomingText}>{match.time}</Text>
            </View>
          )}
          <Text style={styles.groupLabel}>Groupe {match.group}</Text>
        </View>

        {/* Teams row */}
        <View style={styles.teamsRow}>
          {/* Home team */}
          <View style={styles.teamCol}>
            <Text style={styles.teamFlag}>{home.flag}</Text>
            <Text style={styles.teamName} numberOfLines={1}>
              {home.shortName}
            </Text>
          </View>

          {/* Score */}
          <View style={styles.scoreCol}>
            <View style={[styles.scoreBox, isLive && styles.scoreBoxLive]}>
              <Text style={[styles.scoreText, isLive && styles.scoreTextLive]}>
                {statusLabel}
              </Text>
            </View>
            {match.status === "upcoming" && (
              <Text style={styles.vsText}>VS</Text>
            )}
          </View>

          {/* Away team */}
          <View style={styles.teamCol}>
            <Text style={styles.teamFlag}>{away.flag}</Text>
            <Text style={styles.teamName} numberOfLines={1}>
              {away.shortName}
            </Text>
          </View>
        </View>

        {/* Bottom info */}
        <View style={styles.bottomRow}>
          <Text style={styles.venueText} numberOfLines={1}>
            {match.venue}
          </Text>
          <Pressable
            onPress={() => toggleMatch(match.id)}
            hitSlop={12}
            style={styles.favButton}
          >
            <Heart
              size={18}
              color={fav ? Colors.fifaRed : Colors.whiteMuted}
              fill={fav ? Colors.fifaRed : "none"}
            />
          </Pressable>
        </View>

        {/* Live glow */}
        {isLive && <View style={styles.liveGlow} />}
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    position: "relative",
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
    backgroundColor: Colors.surfaceElevated,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  finishedBadge: {
    backgroundColor: Colors.whiteSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  finishedText: {
    color: Colors.whiteDim,
    fontSize: FontSize.xs,
    fontWeight: "600",
  },
  upcomingBadge: {
    backgroundColor: Colors.goldMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  upcomingText: {
    color: Colors.gold,
    fontSize: FontSize.xs,
    fontWeight: "700",
  },
  groupLabel: {
    color: Colors.whiteMuted,
    fontSize: FontSize.xs,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  teamsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  teamCol: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  teamFlag: {
    fontSize: 28,
  },
  teamName: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: "700",
    textAlign: "center",
  },
  scoreCol: {
    alignItems: "center",
    paddingHorizontal: Spacing.md,
  },
  scoreBox: {
    backgroundColor: Colors.surfaceHighlight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.md,
  },
  scoreBoxLive: {
    backgroundColor: Colors.fifaRed,
  },
  scoreText: {
    color: Colors.white,
    fontSize: FontSize.xl,
    fontWeight: "900",
    letterSpacing: 1,
  },
  scoreTextLive: {
    fontSize: FontSize.xl,
  },
  vsText: {
    color: Colors.whiteMuted,
    fontSize: FontSize.xs,
    fontWeight: "600",
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  venueText: {
    color: Colors.whiteMuted,
    fontSize: FontSize.xs,
    flex: 1,
  },
  favButton: {
    padding: 4,
  },
  liveGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.liveGreen,
  },
});
