FROM node:lts
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD react-scripts start
EXPOSE 3001