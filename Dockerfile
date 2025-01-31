FROM ubuntu:latest
LABEL authors="physi"

ENTRYPOINT ["top", "-b"]


# main/frontend/Dockerfile

# 第一阶段：构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 并安装依赖
COPY package.json package-lock.json ./
RUN npm install

# 复制源代码
COPY . .

# 构建生产版本
RUN npm run build

# 第二阶段：运行阶段
FROM nginx:stable-alpine

# 删除默认的 Nginx 配置
RUN rm /etc/nginx/conf.d/default.conf

# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/

# 复制前端构建文件到 Nginx 的 html 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]