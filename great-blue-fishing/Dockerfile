#using alpine linux with node offical image
FROM node:15.7.0-alpine3.10 as build-deps
WORKDIR /usr/src/app
COPY . .
RUN npm install \
  npm build


#Use build files from previous build to make applicate
FROM nginx:1.19.6-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
#download and install necessary packages
RUN apk update --available && sync
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]






