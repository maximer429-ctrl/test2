# Simple nginx-based container for serving static HTML
FROM nginx:alpine

# Copy the HTML file to nginx's default serving directory
COPY index.html /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# nginx alpine image starts nginx automatically
