From node: 20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx as production-stage
COPY --from=build-stage /app/dist /user/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
