---
layout: post
title: "The Old Architecture of this website"
categories: Java
date: 2023-04-19
image: "/assets/images/old_arch.png"
excerpt:
reading_time: 2
---

# Architecture Diagram

<p align="center">
<img src="https://raw.githubusercontent.com/ClarenceWhite/BlogImage/main/images/newblog4-6-11-47-31.jpg" id="blog-image" />
</p>

# Intro

There are 6 docker containers in this app, all of them are under the same docker network, so they can communicate with each other easily. Once there is a code update, a bash script can be executed to automate the re-deployment process.

# Update Logs

-   2023.3 - 2023.4:
    -   Rebuilt the overall architecture to improve the stability and aesthetics of the site;
    -   Added image upload feature in online Markdown editor.
-   2023.4.18: - Optimized image uploading function in online markdown editor
<p align="center">
<img src="https://raw.githubusercontent.com/ClarenceWhite/BlogImage/main/images/642ea57e01fef57cfca2f646-4-18-12-41-10.jpg" id="blog-image" width="500"/>
</p>

-   2023.4.19:
    -   Updated SSL certificate for the next 5 years, cost me 20$.
