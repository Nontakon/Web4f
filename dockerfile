FROM node:12-stretch-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install react-scripts -g
COPY . .
EXPOSE 3000


# start app
CMD ["npm", "start"]