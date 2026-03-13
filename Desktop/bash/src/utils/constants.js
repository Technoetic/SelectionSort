// Hash Table Configuration
export const DEFAULT_CAPACITY = 16;
export const DEFAULT_LOAD_FACTOR_THRESHOLD = 0.75;
export const DEFAULT_COLLISION_STRATEGY = "chaining";

// Animation Configuration
export const ANIMATION_DURATION = 600; // milliseconds
export const ANIMATION_EASING = "easeInOutQuad";
export const ANIMATION_SPEED_MULTIPLIER = 1.0;

// UI Configuration
export const MAX_MESSAGE_DURATION = 3000; // milliseconds
export const MESSAGE_TYPES = {
	SUCCESS: "success",
	ERROR: "error",
	INFO: "info",
	WARNING: "warning",
};

// Canvas Configuration
export const CANVAS_WIDTH = 1000;
export const CANVAS_HEIGHT = 600;
export const BUCKET_WIDTH = 80;
export const BUCKET_HEIGHT = 60;
export const ITEM_RADIUS = 20;

// Color Scheme
export const COLORS = {
	// Background
	darkBg: "#1a1a1a",
	darkSurface: "#2d2d2d",

	// States
	bucketBg: "#f0f0f0",
	bucketBorder: "#333",
	bucketActive: "#ffeb3b",
	bucketEmpty: "#e0e0e0",

	// Items
	itemBg: "#2196f3",
	itemText: "#fff",
	itemFound: "#4caf50",
	itemError: "#f44336",
	itemHighlight: "#ff9800",

	// Status Colors
	success: "#00E676",
	danger: "#F27772",
	warning: "#FFB300",
	info: "#64B5F6",

	// Text
	textPrimary: "#CCCCCC",
	textSecondary: "#999999",
};

// Hash Functions
export const HASH_FUNCTIONS = {
	SIMPLE: "simple",
	DJB2: "djb2",
};

// Collision Resolution Strategies
export const COLLISION_STRATEGIES = {
	CHAINING: "chaining",
	LINEAR_PROBING: "linear",
	QUADRATIC_PROBING: "quadratic",
	DOUBLE_HASHING: "double",
};

// Default Configuration Object
export const DEFAULT_CONFIG = {
	capacity: DEFAULT_CAPACITY,
	loadFactorThreshold: DEFAULT_LOAD_FACTOR_THRESHOLD,
	collisionStrategy: DEFAULT_COLLISION_STRATEGY,
	animationDuration: ANIMATION_DURATION,
	hashFunction: HASH_FUNCTIONS.SIMPLE,
};
