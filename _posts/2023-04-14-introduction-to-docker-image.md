---
layout: post
title: "Introduction to Docker Image"
categories: Containerize
date: 2023-04-14
image: "/assets/images/docker_img.png"
excerpt:
reading_time: 20
---

# 1. Operations on Docker images

## 1.1 Check local images

### 1.1.1 Use `docker images` command

```
# docker images
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
bash         latest    5557e073f11c   2 weeks ago    13MB
nginx        latest    605c77e624dd   3 weeks ago    141MB
centos       latest    5d0da3dc9764   4 months ago   231MB
```

### 1.1.2 Use `docker image` command

```
# docker image list (or ls)
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
bash         latest    5557e073f11c   2 weeks ago    13MB
nginx        latest    605c77e624dd   3 weeks ago    141MB
centos       latest    5d0da3dc9764   4 months ago   231MB
```

### 1.1.3 Find the location of docker image locally

> Considering that Docker container images can take up local storage space, it is recommended to set up other storage systems and mount them locally to solve the problem of consuming a large amount of local storage.

```
# ls /var/lib/docker
buildkit  containers  image  network  overlay2  plugins  runtimes  swarm  tmp  trust  volumes
```

## 1.2 Search for images on Docker Hub

### 1.2.1 Command line searching

```
# docker search centos
```

```
# Outputs
NAME                              DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
centos                            The official build of CentOS.                   6987      [OK]
ansible/centos7-ansible           Ansible on Centos7                              135                  [OK]
consol/centos-xfce-vnc            Centos container with "headless" VNC session…   135                  [OK]
jdeathe/centos-ssh                OpenSSH / Supervisor / EPEL/IUS/SCL Repos - …   121                  [OK]
```

### 1.2.2 Docker Hub Website

Just go to this website and search for the image you want: https://hub.docker.com/.

## 1.3 Pull images

```
# docker pull centos
```

## 1.4 Remove images

```
# docker images
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
bash         latest    5557e073f11c   2 weeks ago    13MB
nginx        latest    605c77e624dd   3 weeks ago    141MB
centos       latest    5d0da3dc9764   4 months ago   231MB
```

```
# docker rmi centos
Untagged: centos:latest
Untagged: centos@sha256:a27fd8080b517143cbbbab9dfb7c8571c40d67d534bbdee55bd6c473f432b177
Deleted: sha256:5d0da3dc976460b72c77d94c8a1ad043720b0416bfc16c52c45d4847e53fadb6
Deleted: sha256:74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59
```

or

```
# docker images
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
centos       latest    5d0da3dc9764   4 months ago   231MB
```

```
# docker rmi 5d0da3dc9764
```

# 2. Introduction to Docker image

## 2.1 Docker Image

-   Docker images are read-only container templates and are the foundation of Docker containers.
-   They provide a static file system runtime environment (rootfs) for Docker containers.
-   Docker images represent the static state of a container.
-   Containers represent the running state of a Docker image.

## 2.2 Union Filesystem

### 2.2.1 Definition

-   Union File System is a file system that implements union mount technology.
-   Union mount technology allows multiple file systems to be mounted at the same mount point, integrating the original directory of the mount point with the mounted content, so that the resulting visible file system contains the layered files and directories after integration.

### 2.2.2 Architecture

<p align="center">
<img src="https://raw.githubusercontent.com/ClarenceWhite/BlogImage/main/images/newblog4-14-17-49-58.jpg" id="blog-image" />
</p>

## 2.3 Docker Overlay2

There are several ways to implement storage drivers for container file systems, including aufs, devicemapper, overlay, and overlay2. In this case, we will use overlay2 as an example for explanation.

### 2.3.1 Concepts

-   Registry/Repository: The registry is a collection of repositories, and a repository is a collection of images.
-   Image: An image is metadata that stores information related to the image, including its architecture, default configuration information, container configuration information, and more. It is a "logical" concept and does not correspond to a physical image file.
-   Layer: A layer (image layer) makes up the image, and a single layer can be shared by multiple images.

<p align="center">
<img src="https://raw.githubusercontent.com/ClarenceWhite/BlogImage/main/images/newblog4-14-17-51-33.jpg" id="blog-image" />
</p>

### 2.3.2 Check the storage driver of the Docker Host

```
# docker info | grep overlay
 Storage Driver: overlay2
```

### 2.3.3 Layers of images

```
# docker pull nginx
Using default tag: latest
latest: Pulling from library/nginx
a2abf6c4d29d: Pull complete
a9edb18cadd1: Pull complete
589b7251471a: Pull complete
186b1aaa4aa6: Pull complete
b4df32aa5a72: Pull complete
a0bcbecc962e: Pull complete
Digest: sha256:0d17b565c37bcbd895e9d92315a05c1c3c9a29f762b011a10c54a66cd53c9b31
Status: Downloaded newer image for nginx:latest
docker.io/library/nginx:latest
```

We can see that the downloaded image consists of 6 layers. How to find out where these 6 layers are stored on the Docker Host?

Firstly, check Nginx image:

```
# docker images
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
nginx        latest    605c77e624dd   3 weeks ago    141MB
```

We can find the storage location via the Image ID 605c77e624dd:

```
# ls /var/lib/docker/image/overlay2/
distribution  imagedb  layerdb  repositories.json
```

This directory is the entry point for the search and is very important. It stores the metadata for image management.

-   repositories.json: records the mapping between repo and image ID.
-   imagedb: It records the architecture of the image, the operating system, the container ID and configuration used to build the image, and the rootfs information.
-   layerdb: Records the metadata of each layer.

Find the long ID of the image nginx by looking up the repositories.json file using its short ID, and then use the long ID to locate the metadata of this image in the imagedb:

```
# cat /var/lib/docker/image/overlay2/repositories.json | grep 605c77e624dd
{"Repositories":"nginx":{"nginx:latest":"sha256:605c77e624ddb75e6110f997c58876baa13f8754486b461117934b24a9dc3a85","nginx@sha256:0d17b565c37bcbd895e9d92315a05c1c3c9a29f762b011a10c54a66cd53c9b31":"sha256:605c77e624ddb75e6110f997c58876baa13f8754486b461117934b24a9dc3a85"}}}}
```

```
# cat /var/lib/docker/image/overlay2/imagedb/content/sha256/605c77e624ddb75e6110f997c58876baa13f8754486b461117934b24a9dc3a85
......
"os":"linux","rootfs":{"type":"layers","diff_ids":["sha256:2edcec3590a4ec7f40cf0743c15d78fb39d8326bc029073b41ef9727da6c851f","sha256:e379e8aedd4d72bb4c529a4ca07a4e4d230b5a1d3f7a61bc80179e8f02421ad8","sha256:b8d6e692a25e11b0d32c5c3dd544b71b1085ddc1fddad08e68cbd7fda7f70221","sha256:f1db227348d0a5e0b99b15a096d930d1a69db7474a1847acbc31f05e4ef8df8c","sha256:32ce5f6a5106cc637d09a98289782edf47c32cb082dc475dd47cbf19a4f866da","sha256:d874fd2bc83bb3322b566df739681fbd2248c58d3369cb25908d68e7ed6040a6"]}}
```

Here we keep only the metadata we want, which is `rootfs`. In `rootfs`, we can see that there are 6 layers in the `layers` directory, which correspond to the 6 image layers of the Docker image. These layers are mapped from bottom to top in the container. Having found the 6 layers of the image, the next question is where the file contents of each layer are located.

The `layerdb` metadata will provide us with the information we need. By using the base layer diff ID`2edcec3590a4ec7f40cf0743c15d78fb39d8326bc029073b41ef9727da6c851f`, we can find the `cache_id` of the bottom layer image. By using this `cache_id`, we can find the file contents of the image layer.

```
# ls /var/lib/docker/image/overlay2/layerdb/sha256/2edcec3590a4ec7f40cf0743c15d78fb39d8326bc029073b41ef9727da6c851f
cache-id  diff  size  tar-split.json.gz
```

```
# cat /var/lib/docker/image/overlay2/layerdb/sha256/2edcec3590a4ec7f40cf0743c15d78fb39d8326bc029073b41ef9727da6c851f/cache-id
85c4c5ecdac6c0d197f899dac227b9d493911a9a5820eac501bb5e9ae361f4c7
```

```
# cat /var/lib/docker/image/overlay2/layerdb/sha256/2edcec3590a4ec7f40cf0743c15d78fb39d8326bc029073b41ef9727da6c851f/diff
sha256:2edcec3590a4ec7f40cf0743c15d78fb39d8326bc029073b41ef9727da6c851f
```

Use cacheID to check the content of the file

```
# ls /var/lib/docker/overlay2/85c4c5ecdac6c0d197f899dac227b9d493911a9a5820eac501bb5e9ae361f4c7
committed  diff  link
# ls /var/lib/docker/overlay2/85c4c5ecdac6c0d197f899dac227b9d493911a9a5820eac501bb5e9ae361f4c7/diff
bin   dev  home  lib64  mnt  proc  run   srv  tmp  var
boot  etc  lib   media  opt  root  sbin  sys  usr
```

In the example above, the image metadata and image layer contents are stored separately. Therefore, by using the `cache_id`, we need to find the image layer contents in the `/var/lib/docker/overlay2` directory. The contents exist in the `diff` directory, where the `link` file stores the short ID corresponding to the image layer. We will see its usage later on.

After finding the bottom layer of the image, we can proceed to look for the "middle layers" of the image. We found out that there is no image layer with diff ID `e379e8aedd4d72bb4c529a4ca07a4e4d230b5a1d3f7a61bc80179e8f02421ad8` in the `layerdb` directory.

```
# ls /var/lib/docker/image/overlay2/layerdb/sha256/e379e8aedd4d72bb4c529a4ca07a4e4d230b5a1d3f7a61bc80179e8f02421ad8
ls: error /var/lib/docker/image/overlay2/layerdb/sha256/e379e8aedd4d72bb4c529a4ca07a4e4d230b5a1d3f7a61bc80179e8f02421ad8: no such directory
```

This is because Docker introduced a content-addressable mechanism, which indexes images and image layers based on their file contents. Docker uses the `diff_id` in the `rootfs` to calculate the content-addressable `chainID`. By using this `chainID`, layer information can be obtained, and ultimately the content of the image layer file can be indexed.

For the bottom layer of the image, its diff_id is also the chainID. Therefore, we can find the file contents of this layer. For layers other than the bottom layer, the chainID is calculated using the formula chainID(n) = SHA256(chain(n-1) + diffID(n)).

```
# echo -n "sha256:2edcec3590a4ec7f40cf0743c15d78fb39d8326bc029073b41ef9727da6c851f sha256:e379e8aedd4d72bb4c529a4ca07a4e4d230b5a1d3f7a61bc80179e8f02421ad8" | sha256sum -
780238f18c540007376dd5e904f583896a69fe620876cabc06977a3af4ba4fb5  -
```

Find files contents based on the "middle layer" `chainID`:

```
# ls /var/lib/docker/image/overlay2/layerdb/sha256/780238f18c540007376dd5e904f583896a69fe620876cabc06977a3af4ba4fb5
cache-id  diff  parent  size  tar-split.json.gz
```

```
# cat /var/lib/docker/image/overlay2/layerdb/sha256/780238f18c540007376dd5e904f583896a69fe620876cabc06977a3af4ba4fb5/cache-id
57e1f1b11e26f748161b7fccbf2ba6b24c2f98dc8a821729f0be215ad267498c
```

```
# cat /var/lib/docker/image/overlay2/layerdb/sha256/780238f18c540007376dd5e904f583896a69fe620876cabc06977a3af4ba4fb5/diff
sha256:e379e8aedd4d72bb4c529a4ca07a4e4d230b5a1d3f7a61bc80179e8f02421ad8
```

```
# cat /var/lib/docker/image/overlay2/layerdb/sha256/780238f18c540007376dd5e904f583896a69fe620876cabc06977a3af4ba4fb5/parent
sha256:2edcec3590a4ec7f40cf0743c15d78fb39d8326bc029073b41ef9727da6c851f
```

```
Content of the image layer:
# ls /var/lib/docker/overlay2/57e1f1b11e26f748161b7fccbf2ba6b24c2f98dc8a821729f0be215ad267498c
committed  diff  link  lower  work
# ls /var/lib/docker/overlay2/57e1f1b11e26f748161b7fccbf2ba6b24c2f98dc8a821729f0be215ad267498c/diff/
docker-entrypoint.d  etc  lib  tmp  usr  var
```

```
short id:
# cat /var/lib/docker/overlay2/57e1f1b11e26f748161b7fccbf2ba6b24c2f98dc8a821729f0be215ad267498c/link
24GM2IZVPTUROAG7AWJO5ZWE6B
```

```
parent image layer short id:
# cat /var/lib/docker/overlay2/57e1f1b11e26f748161b7fccbf2ba6b24c2f98dc8a821729f0be215ad267498c/lower
l/SICZO4QNVZEVOIJ4HDXVDKNYA2
```

Once the file contents for the bottom layer and middle layers are found, it becomes easy to locate the file contents for the top layer.

## 2.4 Docker container and image

Use `docker run` to start an Nginx container

```
# docker run -d nginx:latest
3272831107a3499afe8160b0cd423e2ac4223522f1995b7be3504a1d3d272878
# docker ps | grep nginx
3272831107a3   nginx:latest   "/docker-entrypoint.…"   11 seconds ago   Up 9 seconds   80/tcp    angry_beaver
```

```
# mount | grep overlay
overlay on /var/lib/docker/overlay2/b3f5c8b42ac055c715216e376cfe44571f618a876f481533ec1434aa0bc4f8ed/merged type overlay (rw,relatime,seclabel,lowerdir=/var/lib/docker/overlay2/l/MS2X66BYF6UZ7EKUWMZJKCF4HO:/var/lib/docker/overlay2/l/ODJROQUGY3WQMOGQ3BLYZGIAG4:/var/lib/docker/overlay2/l/Q5LOBFJRH5M7M5CMSWW5L4VYOY:/var/lib/docker/overlay2/l/ZR35FN2E3WEARZV4HLRU373FT7:/var/lib/docker/overlay2/l/NSM2PTAT6TIT2H6G3HFNGZJH5N:/var/lib/docker/overlay2/l/24GM2IZVPTUROAG7AWJO5ZWE6B:/var/lib/docker/overlay2/l/SICZO4QNVZEVOIJ4HDXVDKNYA2,upperdir=/var/lib/docker/overlay2/b3f5c8b42ac055c715216e376cfe44571f618a876f481533ec1434aa0bc4f8ed/diff,workdir=/var/lib/docker/overla 2/b3f5c8b42ac055c715216e376cfe44571f618a876f481533ec1434aa0bc4f8ed/work)
```

We can see that a union file system called overlay is mounted into the container when it starts. This file system is composed of three layers:

-   `lowerdir`: the read-only layer, which corresponds to the image's image layer
-   `upperdir`: the read-write layer, which is the container's read-write layer and reflects all read/write operations in the container.
-   `workdir`: an internal layer of overlayfs used to implement the copy_up operation from the read-only layer to the read-write layer.
-   `merge`: The directory that is mounted as a unified view inside the container.

What needs to be emphasized here is the read-only layer of the lowerdir image of the container. View the short ID of the read-only layer:

```
lowerdir=/var/lib/docker/overlay2/l/MS2X66BYF6UZ7EKUWMZJKCF4HO
/var/lib/docker/overlay2/l/ODJROQUGY3WQMOGQ3BLYZGIAG4
/var/lib/docker/overlay2/l/Q5LOBFJRH5M7M5CMSWW5L4VYOY
/var/lib/docker/overlay2/l/ZR35FN2E3WEARZV4HLRU373FT7
/var/lib/docker/overlay2/l/NSM2PTAT6TIT2H6G3HFNGZJH5N
/var/lib/docker/overlay2/l/24GM2IZVPTUROAG7AWJO5ZWE6B
/var/lib/docker/overlay2/l/SICZO4QNVZEVOIJ4HDXVDKNYA2
```

There are only 6 layers in the mirror layer, but there are 7 short IDs here?
In the /var/lib/docker/overlay2/l directory we found the answer:

```
# cd /var/lib/docker/overlay2/l
# pwd
/var/lib/docker/overlay2/l
# ls
24GM2IZVPTUROAG7AWJO5ZWE6B  LZEAXJGRW6HKBBGGB2N4CWMSVJ  R2XTGODAA67NQJM44MIKMDUF4W
5OI5WMJ2FP7QI7IFWDMHLBRDDN  MS2X66BYF6UZ7EKUWMZJKCF4HO  SICZO4QNVZEVOIJ4HDXVDKNYA2
644ISPHLTBSSC2KLP6BGHHHZPR  NSM2PTAT6TIT2H6G3HFNGZJH5N  ZR35FN2E3WEARZV4HLRU373FT7
6CQUILQSJNVTMFFV3ABCCOGOYG  ODJROQUGY3WQMOGQ3BLYZGIAG4
BQENAYC44O2ZCZFT5URMH5OADK  Q5LOBFJRH5M7M5CMSWW5L4VYOY
```

```
# ls -l MS2X66BYF6UZ7EKUWMZJKCF4HO/
Total usage 0
drwxr-xr-x. 4 root root 43 1月  25 01:27 dev
drwxr-xr-x. 2 root root 66 1月  25 01:27 etc
[root@192 l]# ls -l ODJROQUGY3WQMOGQ3BLYZGIAG4/
Total usage 0
drwxr-xr-x. 2 root root 41 12月 30 03:28 docker-entrypoint.d

[root@192 l]# ls -l Q5LOBFJRH5M7M5CMSWW5L4VYOY/
Total usage 0
drwxr-xr-x. 2 root root 41 12月 30 03:28 docker-entrypoint.d
[root@192 l]# ls -l ZR35FN2E3WEARZV4HLRU373FT7/
Total usage 0
drwxr-xr-x. 2 root root 45 12月 30 03:28 docker-entrypoint.d
[root@192 l]# ls -l NSM2PTAT6TIT2H6G3HFNGZJH5N/
Total usage 4
-rwxrwxr-x. 1 root root 1202 12月 30 03:28 docker-entrypoint.sh
[root@192 l]# ls -l 24GM2IZVPTUROAG7AWJO5ZWE6B/
Total usage 4
drwxr-xr-x.  2 root root    6 12月 30 03:28 docker-entrypoint.d
drwxr-xr-x. 18 root root 4096 12月 30 03:28 etc
drwxr-xr-x.  4 root root   45 12月 20 08:00 lib
drwxrwxrwt.  2 root root    6 12月 30 03:28 tmp
drwxr-xr-x.  7 root root   66 12月 20 08:00 usr
drwxr-xr-x.  5 root root   41 12月 20 08:00 var
[root@192 l]# ls -l SICZO4QNVZEVOIJ4HDXVDKNYA2/
Total usage 12
drwxr-xr-x.  2 root root 4096 12月 20 08:00 bin
drwxr-xr-x.  2 root root    6 12月 12 01:25 boot
drwxr-xr-x.  2 root root    6 12月 20 08:00 dev
drwxr-xr-x. 30 root root 4096 12月 20 08:00 etc
drwxr-xr-x.  2 root root    6 12月 12 01:25 home
drwxr-xr-x.  8 root root   96 12月 20 08:00 lib
drwxr-xr-x.  2 root root   34 12月 20 08:00 lib64
drwxr-xr-x.  2 root root    6 12月 20 08:00 media
drwxr-xr-x.  2 root root    6 12月 20 08:00 mnt
drwxr-xr-x.  2 root root    6 12月 20 08:00 opt
drwxr-xr-x.  2 root root    6 12月 12 01:25 proc
drwx------.  2 root root   37 12月 20 08:00 root
drwxr-xr-x.  3 root root   30 12月 20 08:00 run
drwxr-xr-x.  2 root root 4096 12月 20 08:00 sbin
drwxr-xr-x.  2 root root    6 12月 20 08:00 srv
drwxr-xr-x.  2 root root    6 12月 12 01:25 sys
drwxrwxrwt.  2 root root    6 12月 20 08:00 tmp
drwxr-xr-x. 11 root root  120 12月 20 08:00 usr
drwxr-xr-x. 11 root root  139 12月 20 08:00 var
```

And MS2X66BYF6UZ7EKUWMZJKCF4HO is mapped to the initialization layer init of the container. The content of this layer is the file content related to the container configuration, which is read-only.

The container is started, and docker mounts the content of the image into the container. So, if writing files in the container will have any impact on the image?

## 2.5 Write files in the container

It is not difficult to understand that the image layer is read-only, and writing a file in the container is actually writing the file to the readable and writable layer of the overlay.

Here are a few cases to test:

-   The file does not exist in the read-write layer, but exists in the read-only layer.
-   The file exists in the read-write layer, but not in the read-only layer.
-   The file does not exist in both the read-write layer and the read-only layer.

We simply build a scenario where neither the read-write layer nor the read-only layer exists:

```
# docker run -it centos:latest bash
[root@355e99982248 /]# touch bzy.txt
[root@355e99982248 /]# ls
bin  etc   lib    lost+found  mnt      opt   root  sbin  sys  usr
dev  home  lib64  media       bzy.txt  proc  run   srv   tmp  var
```

Check whether the file exists in the read-write layer:

```
Check the image for changes
# docker images
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
ubuntu       latest    d13c942271d6   2 weeks ago    72.8MB
bash         latest    5557e073f11c   2 weeks ago    13MB
nginx        latest    605c77e624dd   3 weeks ago    141MB
centos       latest    5d0da3dc9764   4 months ago   231MB

[root@localhost ~]# cat /var/lib/docker/image/overlay2/repositories.json | grep 5d0da3dc9764
{"Repositories"{"centos:latest":"sha256:5d0da3dc976460b72c77d94c8a1ad043720b0416bfc16c52c45d4847e53fadb6","centos@sha256:a27fd8080b517143cbbbab9dfb7c8571c40d67d534bbdee55bd6c473f432b177":"sha256:5d0da3dc976460b72c77d94c8a1ad043720b0416bfc16c52c45d4847e53fadb6"}}}



[root@localhost ~]# cat /var/lib/docker/image/overlay2/imagedb/content/sha256/5d0da3dc976460b72c77d94c8a1ad043720b0416bfc16c52c45d4847e53fadb6
{"os":"linux","rootfs":{"type":"layers","diff_ids":["sha256:74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59"]}}


[root@localhost ~]# ls
/var/lib/docker/image/overlay2/layerdb/sha256/74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59:
cache-id  diff  size  tar-split.json.gz
[root@localhost ~]# cat /var/lib/docker/image/overlay2/layerdb/sha256/74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59/cache-id
b17bc5c5103514923a30983c48f909e06f366b7aa1e85f112b67abb3ef5cd0cb

[root@localhost ~]# cat /var/lib/docker/image/overlay2/layerdb/sha256/74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59/diff
sha256:74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59


[root@localhost ~]# ls /var/lib/docker/overlay2/b17bc5c5103514923a30983c48f909e06f366b7aa1e85f112b67abb3ef5cd0cb
committed  diff  link
[root@localhost ~]# ls /var/lib/docker/overlay2/b17bc5c5103514923a30983c48f909e06f366b7aa1e85f112b67abb3ef5cd0cb/diff/
bin  etc   lib    lost+found  mnt  proc  run   srv  tmp  var
dev  home  lib64  media       opt  root  sbin  sys  usr


Check if the container has changed
[root@localhost ~]# mount | grep overlay
type overlay (rw,relatime,seclabel,lowerdir=/var/lib/docker/overlay2/l/R2W2LEMDPRIUFYDVSLIQSCYTGX:/var/lib/docker/overlay2/l/R2XTGODAA67NQJM44MIKMDUF4W,upperdir=/var/lib/docker overlay2/7f0b54c748171872ce564305e394547555cb1182abf802c2262384be3dc78a8f/diff,workdir=/var/lib/docker/overlay2/7f0b54c748171872ce564305e394547555cb1182abf802c2262384be3dc78a8f/work)


[root@localhost ~]# ls -l /var/lib/docker/overlay2/l/
Total usage 0

lrwxrwxrwx. 1 root root 77 1月  25 01:41 R2W2LEMDPRIUFYDVSLIQSCYTGX -> ../7f0b54c748171872ce564305e394547555cb1182abf802c2262384be3dc78a8f-init/diff
lrwxrwxrwx. 1 root root 72 1月  25 00:29 R2XTGODAA67NQJM44MIKMDUF4W -> ../b17bc5c5103514923a30983c48f909e06f366b7aa1e85f112b67abb3ef5cd0cb/diff


[root@localhost ~]# ls /var/lib/docker/overlay2/7f0b54c748171872ce564305e394547555cb1182abf802c2262384be3dc78a8f/diff
bzy.txt


[root@localhost ~]# ls /var/lib/docker/overlay2/7f0b54c748171872ce564305e394547555cb1182abf802c2262384be3dc78a8f/merged/
bin  etc   lib    lost+found  mnt      opt   root  sbin  sys  usr
dev  home  lib64  media       bzy.txt  proc  run   srv   tmp  var

```

# 3. Docker container image operation command

## 3.1 docker commit

As mentioned in the previous section, writing files in the container will be reflected in the readable and writable layer of the overlay, so can the contents of the files in the readable and writable layer be mirrored?

Yes. Docker implements image building through commit and build operations. commit submits the container as an image, and build builds an image based on an image.

Use commit to submit the container in the previous section as an image:

```
[root@355e99982248 /]#   ctrl+p+q
```

```
# docker ps
CONTAINER ID   IMAGE           COMMAND                  CREATED          STATUS          PORTS     NAMES
355e99982248   centos:latest   "bash"                   21 minutes ago   Up 21 minutes             fervent_perlman
```

```
# docker commit 355e99982248
sha256:8965dcf23201ed42d4904e2f10854d301ad93b34bea73f384440692e006943de
```

```
# docker images
REPOSITORY   TAG       IMAGE ID       CREATED              SIZE
<none>       <none>    8965dcf23201   About a minute ago   231MB
```

The image short ID 8965dcf23201 is the image submitted by the container, check the imagedb metadata of the image:

```
# cat  /var/lib/docker/image/overlay2/imagedb/content/sha256/8965dcf23201ed42d4904e2f10854d301ad93b34bea73f384440692e006943de
......
"os":"linux","rootfs":{"type":"layers","diff_ids":["sha256:74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59","sha256:551c3089b186b4027e949910981ff1ba54114610f2aab9359d28694c18b0203b"]}}
```

It can be seen that the diff_id of the first mirror layer from top to bottom of the mirror layer is the same as the diff_id of the centos mirror layer, indicating that each mirror layer can be shared by multiple mirrors. And the extra layer of mirror layer content is the content we wrote to the file in the previous section:

```
# echo -n "sha256:74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59 sha256:551c3089b186b4027e949910981ff1ba54114610f2aab9359d28694c18b0203b" | sha256sum -
92f7208b1cc0b5cc8fe214a4b0178aa4962b58af8ec535ee7211f335b1e0ed3b  -
```

```
# cd /var/lib/docker/image/overlay2/layerdb/sha256/92f7208b1cc0b5cc8fe214a4b0178aa4962b58af8ec535ee7211f335b1e0ed3b
[root@192 92f7208b1cc0b5cc8fe214a4b0178aa4962b58af8ec535ee7211f335b1e0ed3b]# ls
cache-id  diff  parent  size  tar-split.json.gz



[root@192 92f7208b1cc0b5cc8fe214a4b0178aa4962b58af8ec535ee7211f335b1e0ed3b]# cat cache-id
250dc0b4f2c5f27952241a55cd4c286bfaaf8af4b77c9d0a38976df4c147cb95


[root@192 92f7208b1cc0b5cc8fe214a4b0178aa4962b58af8ec535ee7211f335b1e0ed3b]# ls /var/lib/docker/overlay2/250dc0b4f2c5f27952241a55cd4c286bfaaf8af4b77c9d0a38976df4c147cb95
diff  link  lower  work


[root@192 92f7208b1cc0b5cc8fe214a4b0178aa4962b58af8ec535ee7211f335b1e0ed3b]# ls /var/lib/docker/overlay2/250dc0b4f2c5f27952241a55cd4c286bfaaf8af4b77c9d0a38976df4c147cb95/diff
bzy.txt

```

## 3.2 docker save

> Export container images for easy sharing.

```
# docker save -o centos.tar centos:latest
```

```
# ls

centos.tar
```

## 3.3 docker load

> Import the container image shared by others to the local, which is usually one of the container image distribution methods.

```
# docker load -i centos.tar
```

## 3.4 docker export

> Export the running container.

```
# docker ps
CONTAINER ID   IMAGE           COMMAND                  CREATED       STATUS       PORTS     NAMES
355e99982248   centos:latest   "bash"                   7 hours ago   Up 7 hours             fervent_perlman
```

```
# docker export -o centos7.tar 355e99982248
```

```
# ls
centos7.tar
```

## 3.5 docker import

> Import the container exported using docker export as a local container image.

```
# ls
centos7.tar
```

```
# docker import centos7.tar centos7:v1
```

```
# docker images
REPOSITORY   TAG       IMAGE ID       CREATED              SIZE
centos7      v1        3639f9a13231   17 seconds ago       231MB
```

It is very troublesome to share container images through docker save and docker load, docker export and docker import. Is there a more convenient way to share container images?
