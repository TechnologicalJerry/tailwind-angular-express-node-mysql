@echo off
echo Running server diagnostic...
cd /d "d:\GitHub\tailwind-angular-express-node-mysql\express-server"
node -r ts-node/register diagnostic.ts
pause