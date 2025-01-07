FROM ubuntu:latest
LABEL authors="physi"

ENTRYPOINT ["top", "-b"]

# 使用官方的 Node 镜像构建阶段
FROM node:18 as build

# 设置工作目录
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到容器中
COPY package*.json ./

# 安装依赖
RUN npm install

# 将项目文件复制到容器
COPY . .

# 构建项目
RUN npm run build

# 使用轻量级的 Nginx 镜像作为最终的运行环境
FROM nginx:alpine

# 将构建的文件复制到 Nginx 容器的静态文件目录
COPY --from=build /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
