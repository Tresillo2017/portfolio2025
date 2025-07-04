# Use Node 20
FROM node:lts-alpine3.21

# Set work directory
WORKDIR /app

# Copy everything there
COPY . /app

# Install packages and prerender images
RUN pnpm i
RUN pnpm run prerender

# Expose the port the app runs on
EXPOSE 4200

# Start the application
CMD ["pnpm", "run local"]
