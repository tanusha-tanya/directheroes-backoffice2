#!/usr/bin/env bash

/usr/local/bin/make_error_pages.sh
env-replace /etc/nginx/sites-available/symfony.tpl.nginx > /etc/nginx/sites-available/symfony.conf

exec nginx
