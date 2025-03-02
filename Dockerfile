FROM node:20.14-alpine3.19 as build
WORKDIR /home/node

COPY package*.json ./
RUN npm cache clean --force && rm -rf node_modules && npm install --silent
COPY . .

RUN npx rimraf dist && npm run build

RUN npm ci --only=production && npm prune --production && npm cache clean --force

USER node
FROM node:20.14-alpine3.19 as production

WORKDIR /home/node

COPY package*.json ./
RUN npm cache clean --force && rm -rf node_modules && npm install --only=production --silent

COPY --from=build /home/node/dist ./dist

CMD [ "node", "dist/main.js" ]
