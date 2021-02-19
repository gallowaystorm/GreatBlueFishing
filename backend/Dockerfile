#using alpine linux with node offical image
FROM gallowaystorm/nodejs
USER root
COPY . .
# Install dependencies from package.json
RUN npm install
# Run the node server
RUN node server.js
EXPOSE 3000
EXPOSE 27017
USER app






