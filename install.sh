docker network create -d bridge application-network
docker-compose up --build --force-recreate --remove-orphans -d
docker-compose exec php composer install
docker-compose exec php sfconsole assets:install --symlink --relative
docker-compose exec php yarn install
bin/encore

