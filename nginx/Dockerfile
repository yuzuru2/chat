FROM nginx:alpine

RUN adduser -D -H worker

COPY ./file/nginx.conf /etc/nginx/nginx.conf
COPY ./file/conf.d/default.conf /etc/nginx/conf.d/default.conf

# ディレクトリオーナーを変更
RUN touch /var/run/nginx.pid && \
  chown -R worker:worker /var/run/nginx.pid && \
  chown -R worker:worker /var/cache/nginx

USER worker

CMD ["nginx"]