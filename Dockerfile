# copy built application to runtime image
FROM node:14.15.4
WORKDIR /app
COPY ./config ./config
COPY ./dist ./dist
COPY ./node_modules ./node_modules

# run in production mode on port 9000
EXPOSE 9000
ENV PORT 9000
ENV NODE_ENV production
CMD [ "node", "dist/app.js" ]
