module.exports = {
	apps: [
		{
			name: 'zellers-ai-avatar',
			script: 'node_modules/next/dist/bin/next',
			args: 'start',
			cwd: '/var/www/zellers-ai-avatar',
			instances: 1,
			exec_mode: 'fork',
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',
			env: {
				NODE_ENV: 'production',
				PORT: 3000
			},
			error_file: '/var/www/zellers-ai-avatar/logs/pm2-error.log',
			out_file: '/var/www/zellers-ai-avatar/logs/pm2-out.log',
			log_file: '/var/www/zellers-ai-avatar/logs/pm2-combined.log',
			time: true,
			merge_logs: true
		}
	]
};
