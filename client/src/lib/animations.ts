export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
  transition: { duration: 0.3 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.2 }
};

export const bounceIn = {
  initial: { opacity: 0, scale: 0.3 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 400
    }
  },
  exit: { opacity: 0, scale: 0.3 }
};

export const tapAnimation = {
  scale: [1, 0.95, 1],
  transition: { duration: 0.1 }
};

export const coinFloatAnimation = {
  y: [0, -50, -100],
  opacity: [1, 0.8, 0],
  scale: [1, 1.2, 0.8],
  transition: { duration: 1, ease: "easeOut" }
};

export const levelUpAnimation = {
  scale: [1, 1.2, 1],
  rotate: [0, 5, -5, 0],
  transition: { 
    duration: 0.6,
    repeat: 2,
    ease: "easeInOut"
  }
};

export const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const shakeAnimation = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.5 }
};

export const rotateAnimation = {
  rotate: [0, 360],
  transition: { duration: 1, ease: "linear" }
};

export const slideUpModal = {
  initial: { opacity: 0, y: "100%" },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: "100%" },
  transition: { 
    type: "spring",
    damping: 30,
    stiffness: 300
  }
};

export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

// Custom animation hooks
export const useSpring = (value: number, config = {}) => {
  return {
    type: "spring",
    stiffness: 300,
    damping: 30,
    ...config
  };
};

export const useEase = (duration = 0.3, ease = "easeInOut") => {
  return {
    duration,
    ease
  };
};

// Animation variants for common UI elements
export const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

export const cardVariants = {
  rest: { y: 0, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
  hover: { 
    y: -5, 
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.2 }
  }
};

export const progressBarVariants = {
  initial: { width: 0 },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: { duration: 0.8, ease: "easeOut" }
  })
};

export const notificationVariants = {
  initial: { opacity: 0, x: 100, scale: 0.3 },
  animate: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 500
    }
  },
  exit: { 
    opacity: 0, 
    x: 100, 
    scale: 0.5,
    transition: { duration: 0.2 }
  }
};

// Energy bar animation
export const energyBarVariants = {
  initial: { scaleX: 0 },
  animate: (energy: number) => ({
    scaleX: energy / 100,
    transition: { duration: 0.5, ease: "easeOut" }
  }),
  pulse: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Loading animations
export const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const dotsLoadingVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.5, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3 }
};

export const tabTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 }
};
