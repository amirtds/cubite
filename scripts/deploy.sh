#!/bin/bash

# Env Vars
ROOT_URL="cubite.io"
MAIN_DOMAIN="cubite.io"
NEXT_PUBLIC_MAIN_DOMAIN="cubite.io"
NEXTAUTH_URL="http://cubite.io"
MYSQL_USER="admin"
MYSQL_PASSWORD=$(openssl rand -base64 12)  # Generate a random 12-character password
MYSQL_DB="cubite"
NEXTAUTH_SECRET="nXVMttWdqJu07op9pbPXWLCnCQV2qwCcF7OQDXVWa04="
DATABASE_URL="mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@db:3306/${MYSQL_DB}"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dn3cywkpn"
NEXT_PUBLIC_CLOUDINARY_API_KEY="955114754642394"
CLOUDINARY_API_SECRET="cSN7VdjzMjaR3cABHfQ_lgsQ8Gw"
RESEND_API_KEY="re_CHbqijnL_82kVC2maTtW4KRUTkcWHmAAa"

# Script Vars
export REPO_URL="https://github.com/amirtds/cubite.git"
export APP_DIR=~/cubite
export SWAP_SIZE="4G"

# Update package list and upgrade existing packages
sudo apt update && sudo apt upgrade -y

# Add Swap Space
echo "Adding swap space..."
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
# Install Docker Compose
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Wait for the file to be fully downloaded before proceeding
if [ ! -f /usr/local/bin/docker-compose ]; then
  echo "Docker Compose download failed. Exiting."
  exit 1
fi

sudo chmod +x /usr/local/bin/docker-compose

# Ensure Docker Compose is executable and in path
sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Verify Docker Compose installation
docker-compose --version
if [ $? -ne 0 ]; then
  echo "Docker Compose installation failed. Exiting."
  exit 1
fi

# Ensure Docker starts on boot and start Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Clone the Git repository
if [ -d "$APP_DIR" ]; then
  echo "Directory $APP_DIR already exists. Pulling latest changes..."
  cd $APP_DIR && git pull
else
  echo "Cloning repository from $REPO_URL..."
  git clone $REPO_URL $APP_DIR
  cd $APP_DIR
fi

# For Docker internal communication ("db" is the name of Postgres container)
DATABASE_URL="mysql://$MYSQL_USER:$MYSQL_PASSWORD@db:3306/$MYSQL_DB"

# For external tools (like Drizzle Studio)
DATABASE_URL_EXTERNAL="mysql://$MYSQL_USER:$MYSQL_PASSWORD@localhost:3306/$MYSQL_DB"

# Create the .env file inside the app directory (~/myapp/.env)
echo "ROOT_URL=$ROOT_URL" > "$APP_DIR/.env"
echo "MAIN_DOMAIN=$MAIN_DOMAIN" >> "$APP_DIR/.env"
echo "NEXT_PUBLIC_MAIN_DOMAIN=$NEXT_PUBLIC_MAIN_DOMAIN" >> "$APP_DIR/.env"
echo "NEXTAUTH_URL=${NEXTAUTH_URL}" >> "$APP_DIR/.env"
echo "MYSQL_USER=$MYSQL_USER" >> "$APP_DIR/.env"
echo "MYSQL_PASSWORD=$MYSQL_PASSWORD" >> "$APP_DIR/.env"
echo "MYSQL_DB=$MYSQL_DB" >> "$APP_DIR/.env"
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> "$APP_DIR/.env"
echo "DATABASE_URL=$DATABASE_URL" >> "$APP_DIR/.env"
echo "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME" >> "$APP_DIR/.env"
echo "NEXT_PUBLIC_CLOUDINARY_API_KEY=$NEXT_PUBLIC_CLOUDINARY_API_KEY" >> "$APP_DIR/.env"
echo "CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET" >> "$APP_DIR/.env"
echo "RESEND_API_KEY=$RESEND_API_KEY" >> "$APP_DIR/.env"

# These are just for the demo of env vars
echo "SECRET_KEY=$SECRET_KEY" >> "$APP_DIR/.env"
echo "NEXT_PUBLIC_SAFE_KEY=$NEXT_PUBLIC_SAFE_KEY" >> "$APP_DIR/.env"

# Install Nginx
sudo apt install nginx -y

# Remove old Nginx config (if it exists)
sudo rm -f /etc/nginx/sites-available/cubite
sudo rm -f /etc/nginx/sites-enabled/cubite

# Stop Nginx temporarily to allow Certbot to run in standalone mode
sudo systemctl stop nginx

# Obtain SSL certificate using Certbot standalone mode
sudo apt install certbot -y
sudo certbot certonly --standalone -d $DOMAIN_NAME --non-interactive --agree-tos -m $EMAIL

# Ensure SSL files exist or generate them
if [ ! -f /etc/letsencrypt/options-ssl-nginx.conf ]; then
  sudo wget https://raw.githubusercontent.com/certbot/certbot/main/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf -P /etc/letsencrypt/
fi

if [ ! -f /etc/letsencrypt/ssl-dhparams.pem ]; then
  sudo openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
fi

# Create Nginx config with reverse proxy, SSL support, rate limiting, and streaming support
sudo cat > /etc/nginx/sites-available/cubite <<EOL
limit_req_zone \$binary_remote_addr zone=mylimit:10m rate=10r/s;

server {
    listen 80;
    server_name cubite.io www.cubite.io *.cubite.io;

    # Redirect all HTTP requests to HTTPS
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name cubite.io www.cubite.io *.cubite.io;

    ssl_certificate /etc/letsencrypt/live/cubite.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cubite.io/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Enable rate limiting
    limit_req zone=mylimit burst=20 nodelay;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;

        # Disable buffering for streaming support
        proxy_buffering off;
        proxy_set_header X-Accel-Buffering no;
    }
}
EOL

# Create symbolic link if it doesn't already exist
sudo ln -s /etc/nginx/sites-available/cubite /etc/nginx/sites-enabled/cubite

# Restart Nginx to apply the new configuration
sudo systemctl restart nginx

# Build and run the Docker containers from the app directory (~/cubite)
cd $APP_DIR
sudo dockercompose up --build -d

# Check if Docker Compose started correctly
if ! sudo docker-compose ps | grep "Up"; then
  echo "Docker containers failed to start. Check logs with 'docker-compose logs'."
  exit 1
fi

# Output final message
echo "Deployment complete. Your Next.js app and PostgreSQL database are now running. 
Next.js is available at https://$DOMAIN_NAME, and the PostgreSQL database is accessible from the web service.