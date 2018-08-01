FROM bitnami/minideb:jessie

# prepare apt
RUN install_packages \
  curl \
  git \
  apt-transport-https \
  lsb-release \
  ca-certificates \
  apt-utils \
  sudo \
  vim \
  netcat


# install php
RUN curl -o /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg && \
    echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/php.list

RUN install_packages \
    php7.2-fpm \
    php7.2-cli \
    php7.2-mysql \
    php7.2-apcu \
    php7.2-gd \
    php7.2-imagick \
    php7.2-curl \
    php7.2-intl \
    php7.2-xml \
    php7.2-zip \
    php7.2-mbstring \
    php7.2-redis


# install nodejs
RUN curl -s https://deb.nodesource.com/setup_8.x | bash
RUN install_packages nodejs make g++
#RUN npm install -g webpack


# install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN install_packages yarn

RUN install_packages php7.2-bcmath

# set up php
ADD symfony.ini /etc/php7.2/fpm/conf.d/
ADD symfony.ini /etc/php7.2/cli/conf.d/

ADD symfony.pool.conf /etc/php/7.2/fpm/pool.d/

RUN rm -f /etc/php/7.2/fpm/pool.d/www.conf
RUN mkdir /run/php
RUN sed -i "/pid = .*/c\;pid = /run/php/php7.2-fpm.pid" /etc/php/7.2/fpm/php-fpm.conf \
    && sed -i "/;daemonize = .*/c\daemonize = no" /etc/php/7.2/fpm/php-fpm.conf \
    && sed -i "/error_log = .*/c\error_log = /proc/self/fd/2" /etc/php/7.2/fpm/php-fpm.conf \
    && usermod -u 1000 www-data

RUN mkdir -p /var/www
RUN chown -R www-data:1000 /var/www

RUN ln -sf /dev/stderr /var/log/www.log.slow

ADD sfconsole /usr/bin/
ADD composer /usr/bin/


CMD ["/usr/sbin/php-fpm7.2"]

RUN install_packages libcap2-bin
RUN /sbin/setcap CAP_NET_BIND_SERVICE=+eip /usr/bin/node
RUN chown -R www-data. /var/www/
USER www-data
RUN mkdir /var/www/.composer
WORKDIR /var/www/symfony

# php dev server
EXPOSE 8000
# php-fpm
EXPOSE 9000
# webpack dev server
EXPOSE 8080
