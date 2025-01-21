module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    // other plugins here, if any
    "react-native-reanimated/plugin", // Ensure this is added outside the env block
  ],
  env: {
    production: {
      plugins: ["react-native-paper/babel"],
    },
  },
};
                  