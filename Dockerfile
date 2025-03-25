# Stage 1: Build the application
FROM node:20-alpine AS builder

# ARG for branch to select the correct environment file
ARG BRANCH

# Label for maintainer
# LABEL maintainer="Hegi <hegi@qoin.id>"

# Install only necessary system dependencies
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /usr/app

# Copy only the package.json and yarn.lock to leverage Docker cache for dependencies
COPY package.json ./

# Install dependencies without creating a cache, and remove unnecessary files afterwards
RUN yarn install --frozen-lockfile \
    && yarn cache clean

# Copy the rest of the application files for build
COPY . .

# Copy environment file based on the branch and then build the application
#COPY .env .env
RUN yarn build

# Stage 2: Create the production image
FROM node:20-alpine 

# Label for maintainer
# LABEL maintainer="Hegi <hegi@qoin.id>"

# Set working directory
WORKDIR /usr/app

# Install PM2 globally without cache to save space
RUN npm install --global pm2 --no-cache \
    && npm cache clean --force

# Create a non-root user for running the application securely
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy only the necessary files from the build stage
COPY --from=builder /usr/app/.env ./.env
COPY --from=builder /usr/app/public ./public
COPY --from=builder --chown=nextjs:nodejs /usr/app/.next/standalone ./ 
COPY --from=builder --chown=nextjs:nodejs /usr/app/.next/static ./.next/static

# Use non-root user for running the application
USER nextjs

# Expose the port
EXPOSE 3000

# Set environment variable
ENV PORT 3000

# Start the application using PM2
CMD ["pm2-runtime","start","server.js"]
# CMD ["pm2-runtime", "start", "npm", "--", "start"]
