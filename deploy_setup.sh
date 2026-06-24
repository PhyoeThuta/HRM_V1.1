#!/bin/bash
# GCP Server Initial Setup Script for CorpHRM
# Run this on your newly created Ubuntu 22.04 VM!

echo "=========================================="
echo " Starting CorpHRM Server Setup..."
echo "=========================================="

# 1. Update system packages
echo ">>> Updating system..."
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js (v20) and NPM
echo ">>> Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install Nginx
echo ">>> Installing Nginx..."
sudo apt install -y nginx

# 4. Install PM2 globally
echo ">>> Installing PM2..."
sudo npm install pm2 -g

# 5. Create project directory and set permissions
echo ">>> Setting up /var/www/hrm_react directory..."
sudo mkdir -p /var/www/hrm_react
sudo chown -R $USER:$USER /var/www/hrm_react

# 6. Configure Nginx
echo ">>> Configuring Nginx for CorpHRM..."
sudo bash -c 'cat > /etc/nginx/sites-available/hrm_react <<EOF
server {
    listen 80;
    server_name _;

    root /var/www/hrm_react/hrm-client/dist;
    index index.html;

    # Serve React Frontend
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy API requests to Node.js Backend
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF'

# Enable the new site and remove default
sudo ln -s /etc/nginx/sites-available/hrm_react /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Restart Nginx to apply changes
echo ">>> Restarting Nginx..."
sudo systemctl restart nginx

# 7. Setup PM2 to start on boot
echo ">>> Setting up PM2 Startup..."
pm2 startup systemd -u $USER --hp /home/$USER
# (Run the command PM2 prints out if it asks to, though usually it works automatically)
pm2 save

echo "=========================================="
echo " Setup Complete!"
echo " Your server is now ready for GitHub Actions."
echo "=========================================="
