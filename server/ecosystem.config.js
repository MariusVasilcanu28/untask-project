module.exports = {
  apps: [
    {
      name: "untask-project",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
