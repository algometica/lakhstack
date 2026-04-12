import nextConfig from "eslint-config-next/core-web-vitals"

const eslintConfig = [
  ...nextConfig,
  {
    rules: {
      // Carried over from previous config
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "warn",
      // New strict rules added in eslint-config-next@16 — downgraded to warn
      // so existing code keeps building. Fix these gradually.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
    },
  },
]

export default eslintConfig
