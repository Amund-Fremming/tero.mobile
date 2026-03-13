import ScreenHeader from "@/src/core/components/ScreenHeader/ScreenHeader";
import Color from "@/src/core/constants/Color";
import { useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, View } from "react-native";
import Svg, { Circle, ClipPath, Defs, G, LinearGradient, Polygon, Rect, Stop } from "react-native-svg";
import { styles } from "./diceGameStyles";

const FACE_LAYOUTS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const PIP_POSITIONS: Record<number, { x: number; y: number }> = {
  0: { x: 0.28, y: 0.28 },
  1: { x: 0.5, y: 0.28 },
  2: { x: 0.72, y: 0.28 },
  3: { x: 0.28, y: 0.5 },
  4: { x: 0.5, y: 0.5 },
  5: { x: 0.72, y: 0.5 },
  6: { x: 0.28, y: 0.72 },
  7: { x: 0.5, y: 0.72 },
  8: { x: 0.72, y: 0.72 },
};

type Vec3 = {
  x: number;
  y: number;
  z: number;
};

type Vec2 = {
  x: number;
  y: number;
};

type Angles = {
  x: number;
  y: number;
  z: number;
};

const FACE_VALUES = {
  front: 1,
  back: 6,
  right: 3,
  left: 4,
  top: 2,
  bottom: 5,
} as const;

const BASE_FRONT_ANGLES: Record<number, Angles> = {
  1: { x: 0, y: 0, z: 0 },
  2: { x: 90, y: 0, z: 0 },
  3: { x: 0, y: -90, z: 0 },
  4: { x: 0, y: 90, z: 0 },
  5: { x: -90, y: 0, z: 0 },
  6: { x: 0, y: 180, z: 0 },
};

const CUBE_POINTS: Vec3[] = [
  { x: -1, y: 1, z: 1 },
  { x: 1, y: 1, z: 1 },
  { x: 1, y: -1, z: 1 },
  { x: -1, y: -1, z: 1 },
  { x: -1, y: 1, z: -1 },
  { x: 1, y: 1, z: -1 },
  { x: 1, y: -1, z: -1 },
  { x: -1, y: -1, z: -1 },
];

const FACE_DEFS = [
  { id: "front", indices: [0, 3, 2, 1] as const, fill: "url(#frontGrad)" },
  { id: "back", indices: [4, 5, 6, 7] as const, fill: "#d8d8df" },
  { id: "right", indices: [1, 2, 6, 5] as const, fill: "url(#rightGrad)" },
  { id: "left", indices: [4, 7, 3, 0] as const, fill: "#dcdce1" },
  { id: "top", indices: [4, 0, 1, 5] as const, fill: "url(#topGrad)" },
  { id: "bottom", indices: [3, 7, 6, 2] as const, fill: "#d5d5db" },
] as const;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const rotatePoint = (point: Vec3, angles: Angles): Vec3 => {
  const rx = toRadians(angles.x);
  const ry = toRadians(angles.y);
  const rz = toRadians(angles.z);

  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  const cosZ = Math.cos(rz);
  const sinZ = Math.sin(rz);

  const y1 = point.y * cosX - point.z * sinX;
  const z1 = point.y * sinX + point.z * cosX;
  const x2 = point.x * cosY + z1 * sinY;
  const z2 = -point.x * sinY + z1 * cosY;
  const x3 = x2 * cosZ - y1 * sinZ;
  const y3 = x2 * sinZ + y1 * cosZ;

  return { x: x3, y: y3, z: z2 };
};

const cross = (a: Vec3, b: Vec3): Vec3 => {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
};

const bilinear = (corners: [Vec2, Vec2, Vec2, Vec2], ux: number, uy: number): Vec2 => {
  const [p0, p1, p2, p3] = corners;

  const w0 = (1 - ux) * (1 - uy);
  const w1 = ux * (1 - uy);
  const w2 = ux * uy;
  const w3 = (1 - ux) * uy;

  return {
    x: p0.x * w0 + p1.x * w1 + p2.x * w2 + p3.x * w3,
    y: p0.y * w0 + p1.y * w1 + p2.y * w2 + p3.y * w3,
  };
};

const Dice3D = ({ angles }: { angles: Angles }) => {
  const size = 54;
  const cameraZ = 305;
  const focal = 280;
  const centerX = 130;
  const centerY = 130;

  const transformed = CUBE_POINTS.map((point) => rotatePoint(point, angles));
  const scaled = transformed.map((point) => ({ x: point.x * size, y: point.y * size, z: point.z * size }));

  const projected = scaled.map((point) => {
    const perspective = focal / (cameraZ - point.z);
    return {
      x: centerX + point.x * perspective,
      y: centerY - point.y * perspective,
      z: point.z,
    };
  });

  const faces = FACE_DEFS.map((face) => {
    const a = scaled[face.indices[0]];
    const b = scaled[face.indices[1]];
    const c = scaled[face.indices[2]];

    const ab = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
    const ac = { x: c.x - a.x, y: c.y - a.y, z: c.z - a.z };
    const normal = cross(ab, ac);

    const points2d = face.indices.map((index) => ({ x: projected[index].x, y: projected[index].y })) as [
      Vec2,
      Vec2,
      Vec2,
      Vec2,
    ];

    const avgZ = face.indices.reduce<number>((sum, index) => sum + scaled[index].z, 0) / 4;

    return {
      id: face.id,
      fill: face.fill,
      points2d,
      avgZ,
      visible: normal.z > 0.12,
    };
  })
    .filter((face) => face.visible)
    .sort((a, b) => a.avgZ - b.avgZ);

  const valueMap: Record<string, number> = {
    front: FACE_VALUES.front,
    back: FACE_VALUES.back,
    right: FACE_VALUES.right,
    left: FACE_VALUES.left,
    top: FACE_VALUES.top,
    bottom: FACE_VALUES.bottom,
  };

  return (
    <Svg width="100%" height="100%" viewBox="0 0 260 260">
      <Defs>
        <ClipPath id="diceClip">
          <Rect x="22" y="22" width="216" height="216" rx="58" ry="58" />
        </ClipPath>
        <LinearGradient id="frontGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#ffffff" />
          <Stop offset="1" stopColor="#ececef" />
        </LinearGradient>
        <LinearGradient id="topGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#ffffff" />
          <Stop offset="1" stopColor="#f1f1f5" />
        </LinearGradient>
        <LinearGradient id="rightGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#e7e7eb" />
          <Stop offset="1" stopColor="#d6d6dd" />
        </LinearGradient>
      </Defs>

      <G clipPath="url(#diceClip)">
        {faces.map((face) => {
          const points = face.points2d.map((point) => `${point.x},${point.y}`).join(" ");
          return (
            <Polygon
              key={`poly-${face.id}`}
              points={points}
              fill={face.fill}
              stroke="#bfc1c8"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}

        {faces.map((face) => {
          const value = valueMap[face.id];
          if (!value) {
            return null;
          }

          return FACE_LAYOUTS[value].map((pipIndex) => {
            const position = PIP_POSITIONS[pipIndex];
            const pipPoint = bilinear(face.points2d, position.x, position.y);
            const radius = face.id === "front" ? 7.5 : 6.2;

            return (
              <Circle key={`pip-${face.id}-${pipIndex}`} cx={pipPoint.x} cy={pipPoint.y} r={radius} fill="#20242a" />
            );
          });
        })}
      </G>
    </Svg>
  );
};

export const DiceGame = () => {
  const navigation: any = useNavigation();
  const [isRolling, setIsRolling] = useState(false);
  const [cubeAngles, setCubeAngles] = useState<Angles>(BASE_FRONT_ANGLES[1]);

  const throwProgress = useRef(new Animated.Value(0)).current;
  const angleX = useRef(new Animated.Value(BASE_FRONT_ANGLES[1].x)).current;
  const angleY = useRef(new Animated.Value(BASE_FRONT_ANGLES[1].y)).current;
  const angleZ = useRef(new Animated.Value(BASE_FRONT_ANGLES[1].z)).current;

  const currentAnglesRef = useRef<Angles>(BASE_FRONT_ANGLES[1]);

  useEffect(() => {
    const xListener = angleX.addListener(({ value }) => {
      currentAnglesRef.current = { ...currentAnglesRef.current, x: value };
      setCubeAngles((previous) => ({ ...previous, x: value }));
    });

    const yListener = angleY.addListener(({ value }) => {
      currentAnglesRef.current = { ...currentAnglesRef.current, y: value };
      setCubeAngles((previous) => ({ ...previous, y: value }));
    });

    const zListener = angleZ.addListener(({ value }) => {
      currentAnglesRef.current = { ...currentAnglesRef.current, z: value };
      setCubeAngles((previous) => ({ ...previous, z: value }));
    });

    return () => {
      angleX.removeListener(xListener);
      angleY.removeListener(yListener);
      angleZ.removeListener(zListener);
    };
  }, [angleX, angleY, angleZ]);

  const handleInfoPressed = () => {
    //
  };

  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getTargetAngles = (frontValue: number): Angles => {
    return BASE_FRONT_ANGLES[frontValue] ?? BASE_FRONT_ANGLES[1];
  };

  const handleRoll = () => {
    if (isRolling) {
      return;
    }

    const nextValue = Math.floor(Math.random() * 6) + 1;
    const target = getTargetAngles(nextValue);
    const start = currentAnglesRef.current;

    const targetX = target.x + randomInt(2, 4) * 360;
    const targetY = target.y + randomInt(2, 5) * 360;
    const targetZ = start.z + randomInt(1, 4) * 360 * (Math.random() > 0.5 ? 1 : -1);

    setIsRolling(true);
    throwProgress.setValue(0);

    Animated.parallel([
      Animated.timing(throwProgress, {
        toValue: 1,
        duration: 1150,
        easing: Easing.bezier(0.2, 0.85, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(angleX, {
        toValue: targetX,
        duration: 1150,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(angleY, {
        toValue: targetY,
        duration: 1150,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(angleZ, {
        toValue: targetZ,
        duration: 1150,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Snap to canonical orientation to prevent end-of-roll face flicker.
      angleX.setValue(target.x);
      angleY.setValue(target.y);
      angleZ.setValue(target.z);
      currentAnglesRef.current = target;
      setCubeAngles(target);
      setIsRolling(false);
    });
  };

  const translateY = throwProgress.interpolate({
    inputRange: [0, 0.45, 0.82, 1],
    outputRange: [0, -170, 14, 0],
  });

  const scale = throwProgress.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [1, 0.9, 1.04, 1],
  });

  const shadowScale = throwProgress.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [1, 0.74, 1],
  });

  const shadowOpacity = throwProgress.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.35, 0.14, 0.3],
  });

  const animatedDiceStyle = {
    transform: [{ translateY }, { scale }],
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Terning" backgroundColor={Color.DarkBrown} onBackPressed={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.tableSurface}>
          <View style={styles.tableFelt} />
          <View style={styles.spotlight} />

          <Animated.View
            pointerEvents="none"
            style={[
              styles.diceGroundShadow,
              {
                opacity: shadowOpacity,
                transform: [{ scale: shadowScale }],
              },
            ]}
          />

          <Pressable style={styles.dicePressable} onPress={handleRoll} disabled={isRolling}>
            <Animated.View style={[styles.diceContainer, animatedDiceStyle]}>
              <View style={styles.diceCube}>
                <Dice3D angles={cubeAngles} />
              </View>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default DiceGame;
