#!/usr/bin/env bash
# ==============================================================================
# Cloud Deployment Script: Pull images & restart containers
# Usage: ./deploy.sh [TAG]
# ==============================================================================

set -e

TAG=${1:-latest}
export IMAGE_TAG=$TAG

echo "🚀 [1/4] Đăng nhập vào GitHub Container Registry (ghcr.io)..."
# Nếu bạn lưu GHCR_TOKEN trong biến môi trường hoặc file .env:
if [ -n "$GHCR_TOKEN" ] && [ -n "$GHCR_USER" ]; then
    echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin
fi

echo "📥 [2/4] Kéo (Pull) images mới nhất từ Registry với Tag: $IMAGE_TAG..."
docker compose -f docker-compose.prod.yml pull

echo "🔄 [3/4] Khởi động lại các container dịch vụ..."
docker compose -f docker-compose.prod.yml up -d --remove-orphans

echo "🧹 [4/4] Dọn dẹp images cũ không sử dụng..."
docker image prune -f

echo "✅ Triển khai thành công ứng dụng với Tag: $IMAGE_TAG!"
docker compose -f docker-compose.prod.yml ps
