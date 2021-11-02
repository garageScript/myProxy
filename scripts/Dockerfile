FROM node:alpine

RUN apk add git --no-cache
RUN git config --global user.email "myproxy@garagescript.org"
RUN git config --global user.name "myproxy"

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node"]