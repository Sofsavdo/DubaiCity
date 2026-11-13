FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV=production
# Ma'lumotlar bazasi shu papkada saqlanadi: hostingda doimiy disk (volume) ulang
ENV DB_PATH=/data/bandly.sqlite
ENV TRUST_PROXY=1
VOLUME /data
EXPOSE 3101
CMD ["npm", "start"]
