# This Dockerfile expects the React app to be pre-built by CI (npm run build)
# The dist/ folder is copied in directly — secrets are already baked into the bundle by GitHub Actions
FROM nginx:alpine

COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
