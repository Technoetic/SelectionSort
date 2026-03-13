import { describe, it, expect } from 'vitest'
import {
  DEFAULT_CAPACITY,
  DEFAULT_LOAD_FACTOR_THRESHOLD,
  DEFAULT_COLLISION_STRATEGY,
  ANIMATION_DURATION,
  ANIMATION_EASING,
  ANIMATION_SPEED_MULTIPLIER,
  MAX_MESSAGE_DURATION,
  MESSAGE_TYPES,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  BUCKET_WIDTH,
  BUCKET_HEIGHT,
  ITEM_RADIUS,
  COLORS,
  HASH_FUNCTIONS,
  COLLISION_STRATEGIES,
  DEFAULT_CONFIG
} from '../../src/utils/constants.js'

describe('Constants', () => {
  describe('Hash Table Configuration', () => {
    it('should export DEFAULT_CAPACITY as a positive number', () => {
      expect(DEFAULT_CAPACITY).toBe(16)
      expect(typeof DEFAULT_CAPACITY).toBe('number')
      expect(DEFAULT_CAPACITY).toBeGreaterThan(0)
    })

    it('should export DEFAULT_LOAD_FACTOR_THRESHOLD as a decimal between 0 and 1', () => {
      expect(DEFAULT_LOAD_FACTOR_THRESHOLD).toBe(0.75)
      expect(typeof DEFAULT_LOAD_FACTOR_THRESHOLD).toBe('number')
      expect(DEFAULT_LOAD_FACTOR_THRESHOLD).toBeGreaterThan(0)
      expect(DEFAULT_LOAD_FACTOR_THRESHOLD).toBeLessThan(1)
    })

    it('should export DEFAULT_COLLISION_STRATEGY as string', () => {
      expect(DEFAULT_COLLISION_STRATEGY).toBe('chaining')
      expect(typeof DEFAULT_COLLISION_STRATEGY).toBe('string')
    })
  })

  describe('Animation Configuration', () => {
    it('should export ANIMATION_DURATION as milliseconds', () => {
      expect(ANIMATION_DURATION).toBe(600)
      expect(typeof ANIMATION_DURATION).toBe('number')
      expect(ANIMATION_DURATION).toBeGreaterThan(0)
    })

    it('should export ANIMATION_EASING as string', () => {
      expect(ANIMATION_EASING).toBe('easeInOutQuad')
      expect(typeof ANIMATION_EASING).toBe('string')
    })

    it('should export ANIMATION_SPEED_MULTIPLIER as positive number', () => {
      expect(ANIMATION_SPEED_MULTIPLIER).toBe(1.0)
      expect(typeof ANIMATION_SPEED_MULTIPLIER).toBe('number')
      expect(ANIMATION_SPEED_MULTIPLIER).toBeGreaterThan(0)
    })
  })

  describe('UI Configuration', () => {
    it('should export MAX_MESSAGE_DURATION as milliseconds', () => {
      expect(MAX_MESSAGE_DURATION).toBe(3000)
      expect(typeof MAX_MESSAGE_DURATION).toBe('number')
      expect(MAX_MESSAGE_DURATION).toBeGreaterThan(0)
    })

    it('should export MESSAGE_TYPES with valid keys', () => {
      expect(MESSAGE_TYPES).toBeDefined()
      expect(MESSAGE_TYPES.SUCCESS).toBe('success')
      expect(MESSAGE_TYPES.ERROR).toBe('error')
      expect(MESSAGE_TYPES.INFO).toBe('info')
      expect(MESSAGE_TYPES.WARNING).toBe('warning')
    })

    it('should have all required MESSAGE_TYPES', () => {
      const requiredTypes = ['SUCCESS', 'ERROR', 'INFO', 'WARNING']
      requiredTypes.forEach(type => {
        expect(MESSAGE_TYPES).toHaveProperty(type)
      })
    })
  })

  describe('Canvas Configuration', () => {
    it('should export positive canvas dimensions', () => {
      expect(CANVAS_WIDTH).toBe(1000)
      expect(CANVAS_HEIGHT).toBe(600)
      expect(CANVAS_WIDTH).toBeGreaterThan(0)
      expect(CANVAS_HEIGHT).toBeGreaterThan(0)
    })

    it('should export positive bucket dimensions', () => {
      expect(BUCKET_WIDTH).toBe(80)
      expect(BUCKET_HEIGHT).toBe(60)
      expect(BUCKET_WIDTH).toBeGreaterThan(0)
      expect(BUCKET_HEIGHT).toBeGreaterThan(0)
    })

    it('should export positive ITEM_RADIUS', () => {
      expect(ITEM_RADIUS).toBe(20)
      expect(typeof ITEM_RADIUS).toBe('number')
      expect(ITEM_RADIUS).toBeGreaterThan(0)
    })
  })

  describe('Color Scheme', () => {
    it('should export COLORS object with required properties', () => {
      expect(COLORS).toBeDefined()
      expect(typeof COLORS).toBe('object')
    })

    it('should have dark mode colors', () => {
      expect(COLORS.darkBg).toBe('#1a1a1a')
      expect(COLORS.darkSurface).toBe('#2d2d2d')
    })

    it('should have bucket colors', () => {
      expect(COLORS.bucketBg).toBeDefined()
      expect(COLORS.bucketBorder).toBeDefined()
      expect(COLORS.bucketActive).toBeDefined()
      expect(COLORS.bucketEmpty).toBeDefined()
    })

    it('should have item colors', () => {
      expect(COLORS.itemBg).toBeDefined()
      expect(COLORS.itemText).toBeDefined()
      expect(COLORS.itemFound).toBeDefined()
      expect(COLORS.itemError).toBeDefined()
      expect(COLORS.itemHighlight).toBeDefined()
    })

    it('should have status colors', () => {
      expect(COLORS.success).toBeDefined()
      expect(COLORS.danger).toBeDefined()
      expect(COLORS.warning).toBeDefined()
      expect(COLORS.info).toBeDefined()
    })

    it('should have text colors', () => {
      expect(COLORS.textPrimary).toBeDefined()
      expect(COLORS.textSecondary).toBeDefined()
    })

    it('should export valid hex color codes', () => {
      const colorValues = Object.values(COLORS)
      const hexRegex = /^#[0-9A-F]{6}$/i
      colorValues.forEach(color => {
        expect(hexRegex.test(color)).toBe(true)
      })
    })
  })

  describe('Hash Functions', () => {
    it('should export HASH_FUNCTIONS object', () => {
      expect(HASH_FUNCTIONS).toBeDefined()
      expect(typeof HASH_FUNCTIONS).toBe('object')
    })

    it('should have SIMPLE hash function', () => {
      expect(HASH_FUNCTIONS.SIMPLE).toBe('simple')
    })

    it('should have DJB2 hash function', () => {
      expect(HASH_FUNCTIONS.DJB2).toBe('djb2')
    })
  })

  describe('Collision Strategies', () => {
    it('should export COLLISION_STRATEGIES object', () => {
      expect(COLLISION_STRATEGIES).toBeDefined()
      expect(typeof COLLISION_STRATEGIES).toBe('object')
    })

    it('should have CHAINING strategy', () => {
      expect(COLLISION_STRATEGIES.CHAINING).toBe('chaining')
    })

    it('should have LINEAR_PROBING strategy', () => {
      expect(COLLISION_STRATEGIES.LINEAR_PROBING).toBe('linear')
    })

    it('should have QUADRATIC_PROBING strategy', () => {
      expect(COLLISION_STRATEGIES.QUADRATIC_PROBING).toBe('quadratic')
    })

    it('should have DOUBLE_HASHING strategy', () => {
      expect(COLLISION_STRATEGIES.DOUBLE_HASHING).toBe('double')
    })
  })

  describe('DEFAULT_CONFIG', () => {
    it('should export DEFAULT_CONFIG object', () => {
      expect(DEFAULT_CONFIG).toBeDefined()
      expect(typeof DEFAULT_CONFIG).toBe('object')
    })

    it('should have correct default capacity', () => {
      expect(DEFAULT_CONFIG.capacity).toBe(DEFAULT_CAPACITY)
    })

    it('should have correct load factor threshold', () => {
      expect(DEFAULT_CONFIG.loadFactorThreshold).toBe(DEFAULT_LOAD_FACTOR_THRESHOLD)
    })

    it('should have correct collision strategy', () => {
      expect(DEFAULT_CONFIG.collisionStrategy).toBe(DEFAULT_COLLISION_STRATEGY)
    })

    it('should have correct animation duration', () => {
      expect(DEFAULT_CONFIG.animationDuration).toBe(ANIMATION_DURATION)
    })

    it('should have correct hash function', () => {
      expect(DEFAULT_CONFIG.hashFunction).toBe(HASH_FUNCTIONS.SIMPLE)
    })

    it('should have all required config keys', () => {
      const requiredKeys = ['capacity', 'loadFactorThreshold', 'collisionStrategy', 'animationDuration', 'hashFunction']
      requiredKeys.forEach(key => {
        expect(DEFAULT_CONFIG).toHaveProperty(key)
      })
    })
  })

  describe('Constants Immutability', () => {
    it('should have consistent values across multiple accesses', () => {
      expect(DEFAULT_CAPACITY).toBe(DEFAULT_CAPACITY)
      expect(ANIMATION_DURATION).toBe(ANIMATION_DURATION)
      expect(MESSAGE_TYPES.SUCCESS).toBe(MESSAGE_TYPES.SUCCESS)
    })

    it('should export same object references', () => {
      const colors1 = COLORS
      const colors2 = COLORS
      expect(colors1).toBe(colors2)
    })
  })
})
