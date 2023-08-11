---
layout: post
title: "Mechanism for persistent storage of container data"
categories: Containerize
date: 2023-04-29
image: "/assets/images/docker_data.png"
excerpt:
reading_time: 20
---

# 1. Introduction

-   Persistent storage for physical or virtual machines

    -   Since physical or virtual machines already have large-capacity disks, data can be directly stored in the local file system of the physical or virtual machine. Alternatively, additional storage systems such as NFS, GlusterFS, and Ceph can be used to achieve persistent data storage.

-   Persistent storage for Docker containers
    -   Since Docker containers are generated from container images, whatever files or directories are included in the container image can still be seen after the container is started.
    -   As Docker containers are considered "disposable" computing resources, they are not suitable for persistent data storage.

# 2. Solutions

Docker provides three ways to mount data from the host machine into a container:

-   docker run -v ('v' stands for volume)
    -   Mounts a local directory to the container at runtime.
-   Volumes
    -   A part of the host file system managed by Docker (/var/lib/docker/volumes).
    -   This is the default way that Docker stores data.
-   Bind mounts
    -   Mounts a file or directory from anywhere on the host machine into the container.

# 3. Demo

## 3.1 docker run -v

First, let's create a directory on host:

```bash
mkdir /opt/www
```

Second, create an index.html inside it:

```bash
vim index.html
-------------
This is the local volume of nginx docker container!
```

Next, start a container based on Nginx image:

```bash
docker run --name=nginx-volume -d -v /opt/www:/usr/share/nginx/html nginx
docker ps
----------------
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS     NAMES
b22f4de7018f   nginx     "/docker-entrypoint.…"   3 seconds ago   Up 2 seconds   80/tcp    nginx-volume
```

Then, check the ip address of the container:

```bash
docker ispect b22 | grep IPAddress
----------------------
"IPAddress": "172.17.0.2",
```

Use `curl` to get the index page on host:

```bash
curl 172.17.0.2
------------------
This is the local volume of nginx docker container!
```

Let's try to change the content of the index file locally?

```bash
vim /opt/www/index.html
-------------------
Index file changed for nginx-volume!
```

`curl` again:

```bash
curl 172.17.0.2
------------------
Index file changed for nginx-volume!
```

What if we change the index file in the container? what will happen to the local file ?

```bash
cd ~

vim index.html
-----------------
Copy an index file from local to container, and check local file.

docker cp index.html nginx-volume:/usr/share/nginx/html/index.html
----------------
Successfully copied 2.05kB to nginx-volume:/usr/share/nginx/html/index.html

curl 172.17.0.2
----------------
Copy an index file from local to container, and check local file.

cat /opt/www/index.html
-----------------
Copy an index file from local to container, and check local file.
```

Oh! The local file was changed to the one in container.

**Note:** If the directory under '-v' option does not exist, it will be automatically created.

## 3.2 Volumes

### 3.2.1 Create a volume

Create a volume named 'nginx-vol':

```bash
docker volume create nginx-vol
------------------
nginx-vol
```

All the volumes are under `/var/lib/docker/volumes`:

```bash
ls /var/lib/docker/volumes
-------------------
backingFsBlockDev  metadata.db  nginx-vol
```

Or check created volumes using:

```bash
docker volume ls
-----------------
DRIVER    VOLUME NAME
local     nginx-vol
```

It also provides `inspect` option:

```bash
docker volume inspect nginx-vol
----------------------
[
    {
        "CreatedAt": "2023-04-29T20:21:44+01:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/nginx-vol/_data",
        "Name": "nginx-vol",
        "Options": null,
        "Scope": "local"
    }
]
```

### 3.2.2 Use volume

Let's start another nginx container using the volume we created just now:

```bash
docker run -d --name=nginx-volume2 --mount src=nginx-vol,dst=/usr/share/nginx/html nginx
```

or

```bash
docker run -d --name-nginx-volume2 -v nginx-vol:/usr/share/nginx/html/ nginx
```

```bash
docker ps
----------------------
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS     NAMES
d7fdfbc43579   nginx     "/docker-entrypoint.…"   3 seconds ago    Up 2 seconds    80/tcp    nginx-volume2
```

Check the volume directory on host machine:

```bash
ls /var/lib/docker/volumes/nginx-vol/_data/
----------------------
50x.html  index.html
```

Check the index file on host:

```bash
cat /var/lib/docker/volumes/nginx-vol/_data/index.html
-------------------
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

If we change the index on the host, what will we get from container's localhost?

```bash
echo "🥹" > /var/lib/docker/volumes/nginx-vol/_data/index.html
```

```bash
curl 172.17.0.3
---------------------------
🥹
```

This is what we expected :)

## 3.3 bind mounts

bind mounts allows us to bind a point wherever we want on the host machine.

Also, create a dicrectory first:

```bash
mkdir /opt/bind_mounts
```

Start another container:

```bash
docker run -d --name=nginx-bind-mounts --mount type=bind,src=/opt/bind_mounts,dst=/usr/share/nginx/html nginx
```

Create an html file in it:

```bash
echo "🤨" > /opt/bind_mounts/index.html
```

Access the container on host machine:

```bash
curl 172.17.0.4
---------------------
🤨
```

This chapter is easy!
