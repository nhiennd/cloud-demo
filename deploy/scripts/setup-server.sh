#!/usr/bin/env bash
# ==============================================================================
# Cloud Server Initial Setup Script (Ubuntu 22.04 / 24.04 LTS, Debian 12)
# Usage: sudo bash setup-server.sh
# ==============================================================================

set -e

echo "=== [1/5] Cập nhật hệ thống package ==="
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install -y ca-certificates curl gnupg lsb-release ufw nginx

echo "=== [2/5] Cài đặt Docker Engine & Docker Compose ==="
if ! command -v docker &> /dev/null; then
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Cho phép user chạy docker không cần sudo
    sudo usermod -aG docker $USER
    echo "Đã cài đặt Docker thành công!"
else
    echo "Docker đã được cài đặt từ trước."
fi

echo "=== [3/5] Cấu hình tường lửa UFW ==="
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 4200/tcp
sudo ufw allow 4201/tcp
sudo ufw --force enable

echo "=== [4/5] Tạo thư mục ứng dụng trên máy chủ ==="
sudo mkdir -p /var/www/cloud-demo
sudo chown -R $USER:$USER /var/www/cloud-demo

echo "=== [5/5] Hoàn tất thiết lập máy chủ! ==="
echo "Kiểm tra phiên bản:"
docker --version
docker compose version
nginx -v
