module.exports = {
  apps: [
    {
      name: "prsm-backend",
      cwd: "/home/rmintz/github/prsm-web/api/fastapi",
      script: "venv/bin/python",
      args: "-m uvicorn main:app --host 127.0.0.1 --port 8002 --workers 1",
      env: {
        NODE_ENV: "production",
        DATABASE_URL:
          "postgresql+asyncpg://postgres:tiger-test-user123@localhost:5432/prsm_db",
        SECRET_KEY: "3e1c6b9f5a2e4d8c9f7b6a1e3d2c4b6f",
        REDIS_URL: "redis://localhost:6379/0",
      },
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "1G",
      error_file: "/tmp/log/prsm/backend-error.log",
      out_file: "/tmp/log/prsm/backend-out.log",
      log_file: "/tmp/log/prsm/backend.log",
    },
  ],
};
