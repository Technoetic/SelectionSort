import { afterEach, beforeEach } from 'vitest'

// Cleanup after each test
afterEach(() => {
  if (document && document.body) {
    document.body.innerHTML = ''
  }
})

// Mock GSAP
global.gsap = {
  timeline: ({ onComplete } = {}) => ({
    to: () => ({
      onComplete: onComplete ? onComplete() : null
    }),
    fromTo: () => ({
      onComplete: onComplete ? onComplete() : null
    }),
    play: () => {},
    pause: () => {},
    resume: () => {},
    seek: () => {},
    duration: () => 0
  }),
  to: (target, config) => {
    if (config?.onComplete) {
      config.onComplete()
    }
    return {}
  },
  from: (target, config) => {
    if (config?.onComplete) {
      config.onComplete()
    }
    return {}
  },
  fromTo: (target, fromVars, toVars) => {
    if (toVars?.onComplete) {
      toVars.onComplete()
    }
    return {}
  }
}

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: () => {},
  error: () => {},
  warn: () => {},
  info: () => {}
}

// Create a minimal DOM structure for testing
beforeEach(() => {
  document.body.innerHTML = `
    <div id="app">
      <div id="input-container"></div>
      <div id="visualizer"></div>
      <div id="message-container"></div>
    </div>
  `
})
