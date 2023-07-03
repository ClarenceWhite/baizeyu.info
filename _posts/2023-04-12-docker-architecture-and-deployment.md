---
layout: post
title: Docker Architecture and Deployment
categories: Containerize
date: 2023-04-12
image: "/assets/images/docker_arch.png"
excerpt:
reading_time: 10
---

# 1. Architecture

## 1.1 Docker Containers Are Everywhere

<p align="center">
<img src="https://raw.githubusercontent.com/ClarenceWhite/BlogImage/main/images/newblog4-12-13-55-36.jpg" id="blog-image" width=500/>
</p>

## 1.2 Architecture

<p align="center">
<img src="https://raw.githubusercontent.com/ClarenceWhite/BlogImage/main/images/newblog4-12-13-56-12.jpg" id="blog-image" />
</p>

### 1.2.1 Docker Host

The host used to install the Docker daemon is known as the Docker Host, which can run containers based on container images.

### 1.2.2 Docker daemon

It is used to manage the containers, container images, container networks, etc. running on the Docker Host, and manages the containers provided by Containerd.io.

### 1.2.3 Registry

Container image repository is used to store the generated container runtime templates. When users use it, they can directly download container images from the repository, which is the container runtime template, and then run the applications contained in the container image. For example, Docker Hub, or you can use Harbor to implement a private container image repository for enterprises.

### 1.2.4 Docker client

The Docker Daemon client tool is used to communicate with the Docker Daemon, execute user commands, and can be deployed on the Docker Host or other hosts as long as it can connect to the Docker Daemon to operate.

### 1.2.5 Image

The template file that packages the application runtime environment and computing resources in a way that can be reused to start a container is used primarily to launch a container based on it, and is an immutable infrastructure.

### 1.2.6 Container

It is an environment for running an application that is generated from a container image. It includes all the files in the container image and any files added by the user later. It belongs to the read-write layer generated based on the container image, and it is also the active space for the application.

### 1.2.7 Docker Dashboard

> Only available for Mac and Windows

Docker Dashboard provides a simple interface that allows you to manage your containers, applications, and images directly from your machine without using the CLI to perform core operations.

<p align="center">
<img src="https://raw.githubusercontent.com/ClarenceWhite/BlogImage/main/images/newblog4-12-13-57-5.jpg" id="blog-image" />
</p>

## 1.3 Docker Versions

-   Docker-ce is the community edition of Docker, primarily used for personal developer testing and is a free version.
-   Docker-ee is the enterprise edition of Docker, primarily used for enterprise development and application deployment and is a paid version. It offers a free trial period of one month.

# 2. Docker Installation

> We are going to use Ubuntu server, so just follow the official doc!

[Click here to go to the official installation guide](https://docs.docker.com/engine/install/), just select the doc that suits your operating system in sidebar.
