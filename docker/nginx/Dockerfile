FROM adorofeev/nginx-verbose

COPY env-replace.bash /usr/local/bin/env-replace
COPY symfony.tpl.nginx /etc/nginx/sites-available/
COPY docker_start_nginx.sh /usr/local/bin

ENV PHP_FPM_HOSTNAME php-fpm.compose
RUN echo "upstream php-upstream { server ${PHP_FPM_HOSTNAME}:9000; }" > /etc/nginx/conf.d/upstream.conf

RUN install_packages \
  vim \
  netcat \
  iputils-ping \
  dnsutils


RUN touch /etc/nginx/sites-available/symfony
RUN ln -s /etc/nginx/sites-available/symfony.conf /etc/nginx/sites-enabled/symfony

RUN mkdir -p /var/log/nginx && \
    chown www-data:1000 /var/log/nginx && \
    rm -f /var/log/nginx/access.log && \
	rm -f /var/log/nginx/error.log && \
    ln -sf /dev/stdout /var/log/nginx/access.log && \
	ln -sf /dev/stderr /var/log/nginx/error.log


EXPOSE 80
