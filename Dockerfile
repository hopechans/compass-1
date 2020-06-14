FROM node:14.3.0 AS builder
WORKDIR /app 
COPY package.json /app/ 

COPY . /app   
RUN curl -o- -L https://yarnpkg.com/install.sh | bash
RUN $HOME/.yarn/bin/yarn install
RUN npm install -g webpack && yarn install && yarn build

FROM nginx
COPY --from=builder app/dist /usr/share/nginx/html/
COPY --from=builder app/nginx.conf /etc/nginx/nginx.conf

#暴露容器80端口
EXPOSE 80
