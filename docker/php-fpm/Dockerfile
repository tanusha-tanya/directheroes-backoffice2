FROM adorofeev/php-fpm-nodejs:php71

# switch to root (parent image uses www-data user)
USER root

# a set of packages for debug needs
RUN install_packages \
  vim \
  netcat \
  iputils-ping \
  dnsutils \
  sudo

# set up php
ADD symfony.ini /etc/php7.1/fpm/conf.d/
ADD symfony.ini /etc/php7.1/cli/conf.d/
ADD sudoers /etc/

# switch back to www-data
USER www-data

expose 9000
expose 8080
