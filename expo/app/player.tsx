import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { ArrowLeft, Maximize, Pause, Play, RefreshCw, Tv } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors, FontSize, Radius, Spacing } from "@/constants/colors";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function PlayerScreen() {
  const { url, name } = useLocalSearchParams<{ url: string; name: string }>();
  const router = useRouter();
  const [isFullscreen, setFullscreen] = useState(false);
  const [isPlaying, setPlaying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const decodedUrl = decodeURIComponent(url ?? "");

  const player = useVideoPlayer(decodedUrl, (player) => {
    player.loop = false;
    player.play();

    player.addListener("playingChange", (ev) => {
      setPlaying(ev.isPlaying);
    });

    player.addListener("statusChange", (ev) => {
      if (ev.status === "error") {
        setError("Impossible de lire ce flux. Essayez une autre chaîne.");
      }
    });
  });

  useEffect(() => {
    if (isFullscreen) {
      StatusBar.setHidden(true);
    } else {
      StatusBar.setHidden(false);
    }
    return () => StatusBar.setHidden(false);
  }, [isFullscreen]);

  const togglePlay = useCallback(() => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  }, [player]);

  const toggleFullscreen = useCallback(() => {
    setFullscreen((f) => !f);
  }, []);

  return (
    <View style={[styles.container, isFullscreen && styles.fullscreen]}>
      <StatusBar barStyle="light-content" />

      {/* Video */}
      <View style={[styles.videoContainer, isFullscreen && styles.videoFullscreen]}>
        {decodedUrl && !error ? (
          <VideoView
            style={StyleSheet.absoluteFill}
            player={player}
            nativeControls={false}
            contentFit="contain"
          />
        ) : null}

        {/* Loading overlay */}
        {!isPlaying && !error && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.gold} />
            <Text style={styles.loadingText}>Chargement du flux...</Text>
          </View>
        )}
      </View>

      {/* Controls overlay */}
      {!isFullscreen && (
        <SafeAreaView style={styles.controlsOverlay}>
          {/* Top bar */}
          <View style={styles.topBar}>
            <Pressable onPress={() => router.back()} style={styles.iconBtn}>
              <ArrowLeft size={22} color={Colors.white} />
            </Pressable>
            <View style={styles.channelInfo}>
              <Tv size={16} color={Colors.gold} />
              <Text style={styles.channelName} numberOfLines={1}>
                {name ?? "Streaming"}
              </Text>
            </View>
            <View style={styles.iconBtn}>
              <></>
            </View>
          </View>
        </SafeAreaView>
      )}

      {/* Error */}
      {error && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              player.play();
            }}
          >
            <RefreshCw size={16} color={Colors.white} />
            <Text style={styles.retryText}>Réessayer</Text>
          </Pressable>
        </View>
      )}

      {/* Bottom controls */}
      {!isFullscreen && !error && (
        <SafeAreaView style={styles.bottomControls}>
          <View style={styles.controlsRow}>
            <Pressable onPress={togglePlay} style={styles.playBtn}>
              {isPlaying ? (
                <Pause size={24} color={Colors.white} />
              ) : (
                <Play size={24} color={Colors.white} />
              )}
            </Pressable>
            <Pressable onPress={toggleFullscreen} style={styles.iconBtnOutline}>
              <Maximize size={18} color={Colors.white} />
            </Pressable>
          </View>
        </SafeAreaView>
      )}

      {/* Fullscreen tap to show/hide */}
      {isFullscreen && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setFullscreen(false)}
        />
      )}

      {/* Watermark */}
      {!isFullscreen && !error && (
        <View style={styles.watermark}>
          <Text style={styles.watermarkText}>Mondiali</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.nightBlueDark,
  },
  fullscreen: {
    backgroundColor: "#000",
  },
  videoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
  },
  videoFullscreen: {
    top: 0,
    bottom: 0,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  loadingText: {
    color: Colors.whiteDim,
    fontSize: FontSize.md,
    fontWeight: "600",
  },
  controlsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingTop: Platform.OS === "android" ? Spacing.lg : 0,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnOutline: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  channelInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    maxWidth: "60%",
  },
  channelName: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: "700",
    flexShrink: 1,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    padding: Spacing.xl,
  },
  errorText: {
    color: Colors.whiteDim,
    fontSize: FontSize.md,
    fontWeight: "600",
    textAlign: "center",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.fifaRed,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  retryText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: "700",
  },
  bottomControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === "android" ? Spacing.md : 0,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  playBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.fifaRed,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.fifaRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  watermark: {
    position: "absolute",
    top: 60,
    right: Spacing.md,
    opacity: 0.4,
  },
  watermarkText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: "800",
    letterSpacing: 2,
  },
});