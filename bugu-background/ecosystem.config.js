module.exports = {
  apps: [{
    name: 'bugu_background',
    script: './server.js',
    instances: 1,
    max_restarts: 7,
    env: {
      NODE_ENV: 'production',
      NODE_PORT: 3001,
      REACT_APP_ENV: 'test',
    },
    watch: false,
    merge_logs: true,
    exec_mode: 'cluster',
    max_memory_restart: '600M',
    instance_var: 'NODE_APP_INSTANCE',
  }]
}
