FROM node:16.4.2
WORKDIR /app
COPY "package.json" "package.json"
COPY "package-lock.json" "package-lock.json"
RUN npm install --production
RUN npm rebuild node-pty --update-binary
COPY . .
CMD [ "node", "index.js" ]