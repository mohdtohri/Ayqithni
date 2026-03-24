/**
 * Emergency detection utility
 * Analyzes accelerometer and heart rate data to detect fainting/seizures
 */

// Thresholds for emergency detection
const FALL_ACCELERATION_THRESHOLD = 2.5; // g-force
const ABNORMAL_HEART_RATE_HIGH = 150;    // bpm
const ABNORMAL_HEART_RATE_LOW = 40;      // bpm
const HEART_RATE_SPIKE_THRESHOLD = 40;   // bpm change

let previousHeartRate = 72;
let previousAcceleration = { x: 0, y: 0, z: 9.8 };

/**
 * Detects if a fall/sudden movement has occurred
 */
export const detectFall = ({ x, y, z }) => {
  const magnitude = Math.sqrt(x * x + y * y + z * z);
  const prevMagnitude = Math.sqrt(
    previousAcceleration.x ** 2 +
    previousAcceleration.y ** 2 +
    previousAcceleration.z ** 2
  );

  previousAcceleration = { x, y, z };

  // Detect sudden change in acceleration (fall signature)
  const delta = Math.abs(magnitude - prevMagnitude);
  return delta > FALL_ACCELERATION_THRESHOLD;
};

/**
 * Detects abnormal heart rate patterns
 */
export const detectAbnormalHeartRate = (currentBpm) => {
  const isAbnormal =
    currentBpm > ABNORMAL_HEART_RATE_HIGH ||
    currentBpm < ABNORMAL_HEART_RATE_LOW ||
    Math.abs(currentBpm - previousHeartRate) > HEART_RATE_SPIKE_THRESHOLD;

  previousHeartRate = currentBpm;
  return isAbnormal;
};

/**
 * Combined emergency detection
 */
export const detectEmergency = ({ acceleration, heartRate }) => {
  const fallDetected = detectFall(acceleration);
  const heartAbnormal = detectAbnormalHeartRate(heartRate);

  return {
    isEmergency: fallDetected || heartAbnormal,
    fallDetected,
    heartAbnormal,
    severity: fallDetected && heartAbnormal ? 'critical' : fallDetected ? 'high' : 'medium',
  };
};

/**
 * Simulates sensor readings for demo purposes
 */
export const simulateSensorData = (baseHeartRate = 72) => {
  const variation = (Math.random() - 0.5) * 4;
  return {
    heartRate: Math.round(baseHeartRate + variation),
    acceleration: {
      x: (Math.random() - 0.5) * 0.5,
      y: (Math.random() - 0.5) * 0.5,
      z: 9.8 + (Math.random() - 0.5) * 0.2,
    },
  };
};
