#using alpine linux with node offical image
FROM gallowaystorm/nodejs as build-deps
USER root
COPY . .
#install dependencies from package.json, install angular cli, build angular project
RUN npm install && \
  npm install -g @angular/cli && \
  ng build


# #Use build files from previous build to make applicate
# FROM nginx:1.19.6-alpine
# COPY --from=build-deps /app/build /usr/share/nginx/html
# #download and install necessary packages
# RUN apk update --available && sync
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]






