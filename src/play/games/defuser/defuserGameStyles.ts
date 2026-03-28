import Color from "@/src/core/constants/Color";
import Font from "@/src/core/constants/Font";
import { moderateScale, verticalScale } from "@/src/core/utils/dimensions";
import { Dimensions, StyleSheet } from "react-native";

const HALF_SCREEN = Dimensions.get("window").height / 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1f23",
  },

  // ── Bomb panel ──────────────────────────────────────────────────
  bombPanel: {
    paddingTop: verticalScale(70),
    paddingBottom: moderateScale(20),
    paddingHorizontal: moderateScale(20),
    backgroundColor: "#2a2d32",
    borderBottomWidth: 4,
    borderBottomColor: "#111316",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 16,
  },

  // Corner hex bolts
  bolt: {
    position: "absolute",
    width: moderateScale(14),
    height: moderateScale(14),
    borderRadius: moderateScale(7),
    backgroundColor: "#4a4f58",
    borderWidth: 2,
    borderColor: "#666c78",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
  },
  boltTL: { top: moderateScale(8), left: moderateScale(10) },
  boltTR: { top: moderateScale(8), right: moderateScale(10) },
  boltBL: { bottom: moderateScale(8), left: moderateScale(10) },
  boltBR: { bottom: moderateScale(8), right: moderateScale(10) },

  // ── Timer ───────────────────────────────────────────────────────
  clockHousing: {
    width: moderateScale(240),
    alignItems: "center",
    backgroundColor: "#060606",
    borderRadius: moderateScale(6),
    paddingHorizontal: moderateScale(18),
    paddingVertical: moderateScale(12),
    borderWidth: 2,
    borderColor: "#2a0000",
    shadowColor: Color.Red,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 18,
    elevation: 12,
  },
  clockText: {
    color: "#ff2020",
    fontSize: moderateScale(54),
    fontFamily: "monospace",
    letterSpacing: moderateScale(8),
    fontWeight: "bold",
    textShadowColor: "rgba(255, 0, 0, 0.7)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },

  // ── LEDs ────────────────────────────────────────────────────────
  ledRow: {
    flexDirection: "row",
    marginTop: moderateScale(14),
    gap: moderateScale(16),
  },
  led: {
    width: moderateScale(16),
    height: moderateScale(16),
    borderRadius: moderateScale(8),
  },
  ledGreen: {
    backgroundColor: "#22c55e",
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  ledRed: {
    backgroundColor: Color.Red,
    shadowColor: Color.Red,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  armedLabel: {
    color: "#6b7280",
    fontSize: moderateScale(9),
    letterSpacing: moderateScale(4),
    marginTop: moderateScale(10),
    fontWeight: "bold",
  },

  // ── Wires ───────────────────────────────────────────────────────
  wiresArea: {
    height: HALF_SCREEN,
    flexDirection: "row",
    paddingHorizontal: moderateScale(4),
    gap: moderateScale(3),
    backgroundColor: "#0d0f12",
    overflow: "hidden",
  },
  // Bottom terminal row (sits below wiresArea)
  wireTermRowBottom: {
    flexDirection: "row",
    paddingHorizontal: moderateScale(4),
    gap: moderateScale(3),
    backgroundColor: "#0d0f12",
  },
  wireTermBottomCell: {
    flex: 1,
    alignItems: "center",
  },
  wireTermBottom: {
    width: "90%",
    height: moderateScale(10),
    backgroundColor: "#595f6b",
    borderRadius: moderateScale(2),
    borderBottomLeftRadius: moderateScale(3),
    borderBottomRightRadius: moderateScale(3),
    borderWidth: 1,
    borderColor: "#7a8290",
  },
  wireCol: {
    flex: 1,
    alignItems: "center",
  },
  // Metallic screw terminal at top of each wire
  wireTerm: {
    width: "90%",
    height: moderateScale(10),
    backgroundColor: "#595f6b",
    borderRadius: moderateScale(2),
    borderTopLeftRadius: moderateScale(3),
    borderTopRightRadius: moderateScale(3),
    marginBottom: 1,
    borderWidth: 1,
    borderColor: "#7a8290",
  },
  wireNub: {
    display: "none",
  },
  // Cylindrical wire: base color + highlight child
  wireVert: {
    width: "100%",
    flexGrow: 1,
    flexShrink: 0,
    height: 9999,
    overflow: "hidden",
  },
  wireHighlight: {
    position: "absolute",
    left: "18%",
    width: "22%",
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.28)",
    borderRadius: moderateScale(4),
  },
  wireVertStub: {
    width: "100%",
    height: moderateScale(34),
    overflow: "hidden",
    opacity: 0.75,
  },
  wireVertSegment: {
    width: "100%",
    flexGrow: 1,
    height: 9999,
    opacity: 0.45,
  },
  wireVertGap: {
    flex: 1,
    width: "100%",
  },

  // ── Hazard stripe ───────────────────────────────────────────────
  hazardStripe: {
    flexDirection: "row",
    height: moderateScale(14),
    overflow: "hidden",
  },
  hazardBand: {
    flex: 1,
  },

  // ── Bottom plate ────────────────────────────────────────────────
  bottomPanel: {
    flex: 1,
    backgroundColor: "#1c1f23",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 2,
    borderTopColor: "#111316",
  },
  modelPlate: {
    color: "#4a5060",
    fontSize: moderateScale(9),
    letterSpacing: moderateScale(2),
    fontFamily: Font.SpaceMonoRegular,
    textAlign: "center",
  },

  // ── Overlays ────────────────────────────────────────────────────
  fullOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },
  gameOverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 10, 0.88)",
    zIndex: 60,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(24),
  },
  gameOverTitle: {
    color: Color.HomeRed,
    fontSize: moderateScale(52),
    fontFamily: Font.PassionOneBold,
    textAlign: "center",
    lineHeight: moderateScale(62),
  },
  retryBtn: {
    marginTop: moderateScale(32),
    backgroundColor: Color.HomeRed,
    paddingHorizontal: moderateScale(40),
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(10),
  },
  retryBtnText: {
    color: Color.White,
    fontSize: moderateScale(22),
    letterSpacing: 0.5,
  },
});
