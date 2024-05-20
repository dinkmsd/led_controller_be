echo "Install app dependencies"
npm install --frozen-lockfile

echo "Build your app"
npm run build

echo "Run new PM2 action"
pm2 start dist/main.js --name main-service