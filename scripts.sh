docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d --build
docker compose -f docker compose.dev.yml exec web npx prisma migrate dev --name add_externalImageUrl_for_courses
docker compose exec web npx prisma migrate deploy