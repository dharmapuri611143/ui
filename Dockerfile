FROM node:12-alpine AS ui-build 
WORKDIR /app
RUN npm cache clean -f
RUN rm -rf node_modules
RUN rm -rf package-lock.json
COPY package.json /app/package.json 
RUN npm config set package-lock false 
RUN npm install @angular/cli
RUN npm i --package-lock-only
RUN npm install
RUN npm audit fix
RUN cd /app
COPY ./dist ./app/dist 
COPY . /app
EXPOSE 4200
CMD npm start