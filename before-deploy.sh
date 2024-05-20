echo "Kill all the running PM2 actions"
pm2 kill

echo "Update app from Git"
git checkout develop  && git pull