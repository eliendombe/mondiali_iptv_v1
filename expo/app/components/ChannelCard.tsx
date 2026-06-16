import { Play, Heart, Monitor } from "lucide-react-native";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { Colors, FontSize, Radius, Spacing } from "@/constants/colors";
import type { IPTVChannel } from "@/services/iptvService";
import { useFavorites } from "@/contexts/FavoritesContext";

interface Props {
  channel: IPTVChannel;
  index: number;
  onPlay: (channel: IPTVChannel) => void;
}

export const ChannelCard = memo(function ChannelCard({ channel, index, onPlay }: Props) {
  const { isChannelFav, toggleChannel } = useFavorites();
  const fav = isChannelFav(channel.id);

  const qualityColor =
    channel.quality === "4K"
      ? Colors.gold
      : channel.quality === "FHD"
      ? Colors.liveGreen
      : Colors.whiteDim;

  return (
    <Animated.View entering={FadeInRight.delay(index * 50).springify()}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => onPlay(channel)}
      >
        <View style={styles.left}>
          {/* Logo placeholder */}
          <View style={styles.logoBox}>
            <Monitor size={20} color={Colors.whiteDim} />
          </View>
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {channel.name}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.group} numberOfLines={1}>
                {channel.group}
              </Text>
              <View style={styles.dot} />
              <Text style={[styles.quality, { color: qualityColor }]}>
                {channel.quality}
              </Text>
              {channel.language !== "N/A" && (
                <>
                  <View style={styles.dot} />
                  <Text style={styles.lang}>{channel.language.toUpperCase()}</Text>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={() => onPlay(channel)}
            style={styles.playButton}
            hitSlop={8}
          >
            <Play size={18} color={Colors.white} fill={Colors.white} />
          </Pressable>
          <Pressable
            onPress={() => toggleChannel(channel.id)}
            hitSlop={8}
          >
            <Heart
              size={16}
              color={fav ? Colors.fifaRed : Colors.whiteMuted}
              fill={fav ? Colors.fifaRed : "none"}
            />
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardPressed: {
    opacity: 0.85,
    backgroundColor: Colors.surfaceElevated,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: Spacing.sm,
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceHighlight,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  group: {
    color: Colors.whiteMuted,
    fontSize: FontSize.xs,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.whiteMuted,
  },
  quality: {
    fontSize: FontSize.xs,
    fontWeight: "800",
  },
  lang: {
    color: Colors.whiteMuted,
    fontSize: FontSize.xs,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.fifaRed,
    alignItems: "center",
    justifyContent: "center",
  },
});
