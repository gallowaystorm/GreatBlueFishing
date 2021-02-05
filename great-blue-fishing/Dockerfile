#using alpine linux with node offical image
FROM gallowaystorm/nodejs as build-deps
USER root

# Set variables
ARG GBF_BACKEND=gbf-backend

#create folder to hold server code
RUN mkdir ${GBF_BACKEND}

# Set workdir to path made above
WORKDIR /app/${GBF_BACKEND}

# Copy in code
COPY ./ .

#install dependencies from package.json, install angular cli, build angular project
RUN npm install

EXPOSE 3000






