module.exports = {
  apps: [
    {
      name: "untask-project",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
