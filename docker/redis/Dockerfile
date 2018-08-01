FROM redis

COPY redis.conf /usr/local/etc/redis/redis.conf

RUN echo -e '\nvm.overcommit_memory = 1' >> /etc/sysctl.conf

CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]
#CMD ["sleep", "600"]
