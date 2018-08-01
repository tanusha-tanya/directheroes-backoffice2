FROM adorofeev/nginx-verbose

ADD symfony.conf /etc/nginx/sites-available/
RUN ln -s /etc/nginx/sites-available/symfony.conf /etc/nginx/sites-enabled/symfony

RUN echo "upstream php-upstream { server php:9000; }" > /etc/nginx/conf.d/upstream.conf

RUN mkdir -p /var/log/nginx && \
    chown www-data:1000 /var/log/nginx && \
    rm -f /var/log/nginx/access.log && \
	rm -f /var/log/nginx/error.log && \
    ln -sf /dev/stdout /var/log/nginx/access.log && \
	ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80
EXPOSE 8080
EXPOSE 443
