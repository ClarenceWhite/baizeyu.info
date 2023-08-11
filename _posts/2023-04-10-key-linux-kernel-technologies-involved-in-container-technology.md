---
layout: post
title: Key Linux Kernel Technologies Involved in Container Technology
categories: Containerize
date: 2023-04-10
image: "/assets/images/linux_docker.png"
excerpt:
reading_time: 20
---

# 1. History of Container Technology

## 1.1 1979 - chroot

-   The concept of container technology can be traced back to UNIX chroot in 1979.
-   It is a set of "UNIX operating system" designed to change the root directory and other subdirectories to a new location within the file system, only accessible by specific processes.
-   The design purpose of this feature is to provide each process with a set of isolated disk space.
-   It was added to BSD in 1982.

## 1.2 2000 - FreeBSD Jails

-   FreeBSD Jails is one of the early container technologies built by Derrick T. Woolworth in the FreeBSD Development Consortium in 2000.
-   It is a set of "operating system" systems similar in positioning to chroot, but includes other process sandboxing mechanisms for isolating file systems, users, networks, and other resources.
-   In this way, it can provide a corresponding IP address for each Jail, customized software package, and even configuration plan.

## 1.3 2001 - Linux VServer

-   Linux VServer is another type of jail mechanism that can be used to protect the security of resources on various partition resources on the computer system (including file systems, CPU time, network addresses, and memory).
-   Each partition is called a security context, and the virtualized system is called a virtual private server.

## 1.4 2004 - Solaris Container

-   The Solaris Container was born targeting x86 and SPARC system architectures. It initially appeared in the February 2004 Solaris 10 Build 51 beta and was officially launched in the full version of Solaris 10 in 2005.
-   The Solaris Container combines system resource control with boundaries provided by partitions. Each partition runs as a completely isolated virtual server within a single instance of the operating system.

## 1.5 2005 - OpenVZ

-   OpenVZ is very similar to Solaris Containers and uses a patched Linux kernel to achieve virtualization, isolation, resource management, and checkpoint delivery.
-   Each OpenVZ container has an isolated file system, users and user groups, a process tree, network, devices, and IPC objects.

## 1.6 2006 - Process Container

-   The Process Container was introduced by Google in 2006 and aims to limit, allocate, and isolate resource usage (including CPU, memory, disk I/O, and network) in a set of processes.
-   It was later renamed Control Groups to avoid conflicts with another term in Linux kernel 2.6.24. This shows Google's keen insight into the importance of container technology and its outstanding contributions.

## 1.7 2007 - Control Groups

Control Groups, also known as cgroups, were added to the Linux kernel in 2007 by Google.

## 1.8 2008 - LXC

-   LXC stands for Linux Containers.
-   It is the first complete Linux container management implementation solution.
-   Its functionality is implemented through cgroups and Linux namespaces.
-   LXC is delivered through the liblxc library and provides APIs that can be integrated with Python3, Python2, Lua, Go, Ruby, Haskell, and other languages.
-   Compared to other container technologies, LXC can run on the original Linux kernel without any additional patches.

## 1.9 2011 - Warden

-   Warden was created by CloudFoundry in 2011, using LXC as the initial stage and then replacing it with their own implementation.
-   Unlike LXC, Warden is not tightly coupled with Linux. Instead, it can run on any operating system that can provide multiple isolation environment methods. Warden runs as a background process and provides APIs for container management.

## 1.10 2013 - LMCTFY

-   LMCTFY stands for "Let Me Contain That For You". It is actually an open-source version of Google's container technology stack, responsible for providing Linux application containers. In the early stages of the project, Google claimed that it could provide reliable performance, high resource utilization, resource sharing mechanisms, ample room for development, and near-zero additional resource consumption.
-   The first version of lmctfy was officially released in October 2013. Google decided to transform the core concepts and abstraction mechanisms of lmctfy into libcontainer in 2015. After losing its mainstream status, lmctfy has lost all positive development momentum.

The Libcontainer project was originally established by Docker, and is now under the jurisdiction of the Open Container Initiative.

## 1.11 2013 - Docker

-   When Docker was first released in 2013, it was an open-source container management engine based on LXC.
-   It simplified the complex process of creating and using containers with its own command system.
-   As Docker developed further, it began to have more ambitious goals, such as defining a standard for container implementation by abstracting the underlying implementation to the Libcontainer interface. This means that the underlying container implementation has become a variable solution, regardless of whether namespace, cgroups technology, or other solutions such as systemd are used, as long as a set of interfaces defined by Libcontainer is implemented, Docker can run. This also makes it possible for Docker to achieve comprehensive cross-platform support.

# 2. Namespace

## 2.1 Introduction to NameSpaces

-   Many programming languages ​​include the concept of namespaces, and we can think of namespaces as a kind of encapsulation, which actually achieves code isolation.

-   In the operating system, namespaces provide isolation of system resources, including processes, networks, file systems, etc.

-   In fact, one of the main purposes of implementing namespaces in Linux is to provide lightweight virtualization services, that is, containers. Processes in the same namespace can perceive each other's changes while knowing nothing about processes in other namespaces. This allows processes in containers to create an illusion that they are in an independent system environment, achieving independence and isolation.

## 2.2 Classification of NameSpaces in Linux System

| Namespace Type |            Description             |                                                   Function                                                   |                                                                                         Remarks                                                                                         |
| :------------: | :--------------------------------: | :----------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|   Process NS   |        Isolates process IDs        | Linux manages process IDs through namespaces, and the same process has different IDs in different namespaces |                                      The process namespace is a parent-child structure, and the child namespace is visible to the parent namespace                                      |
|   Network NS   | Isolates network devices and ports |                           Network isolation is achieved through network namespaces                           |                                                 Docker uses virtual network devices to connect network devices in different namespaces                                                  |
|     IPC NS     |    Isolates interprocess comm.     |                                     Inter-process communication methods                                      |               PID NS and IPC NS can be combined together, processes in the same IPC namespace can interact with each other, and processes in different namespaces cannot                |
|    Mount NS    |       Isolates mount points        |                                          Isolates file directories                                           | Processes can separate mount points from the system during operation. Using this feature, we can achieve the function of chroot, which is more secure than chroot in terms of security. |
|     UTS NS     |  Isolates Hostname and NIS domain  |     Allows containers to have independent hostnames and domains, making them look like independent hosts     |                                                      The purpose is to isolate the hostname and network information service (NIS)                                                       |
|    User NS     |    Isolates user and group IDs     |             Users on each container are not in the same namespace as those on the host machine.              |                      Like process ID, user ID and group ID are different inside and outside the namespace, and can exist with the same ID in different namespaces.                      |

## 2.3 Use Case of NameSpaces

> Taking net namespace as an example

-   In Linux, the network namespace can be considered as an environment with a separate network stack (network card, routing table, iptables) that is isolated. Network namespaces are often used to isolate network devices and services, and only devices with the same network namespace can see each other.

-   Logically, a network namespace is a copy of the network stack, with its own network devices, routing tables, adjacency tables, Netfilter tables, network sockets, network procfs entries, network sysfs entries, and other network resources.

-   From the system's point of view, when creating a new process through the clone() system call, passing the flag CLONE_NEWNET will create a brand new network namespace in the new process.

-   From the user's perspective, we just need to use the tool "ip" (package is iproute2) to create a new persistent network namespace.

<p align="center">
<img
src="https://raw.githubusercontent.com/ClarenceWhite/BlogImage/main/images/6433fb71cb5aec730fd6f479-4-10-13-33-29.jpg" id="blog-image" width="400"/>
</p>

### 2.3.1 Creating a net namespace

```bash
# Creating a network namespace named bzy
ip netns add bzy
```

```bash
# View the created network namespaces
ip netns ls

bzy
```

### 2.3.2 Deleting a net namespace

```bash
# Delete the created network namespace
ip netns delete bzy
```

### 2.3.3 Running commands in the net namespace

```bash
# Execute bash command in the network namespace. Use "exit" to exit.
ip netns exec bzy bash
```

### 2.3.4 Viewing network connectivity (NIC) commands in the net namespace

```bash
# View network card information in the network namespace
ip link
1: lo: <LOOPBACK> mtu 65536 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
```

```bash
# View in the Linux host system
ip netns exec bzy ip link list
1: lo: <LOOPBACK> mtu 65536 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
```

### 2.3.5 Exiting current net namespace

```bash
# Exit the network namespace that has been entered
exit
```

### 2.3.6 Executing multiple commands in the net namespace

```bash
# View the routing table in the network namespace
route -n

Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
```

```bash
# View firewall rules in the network namespace
iptables -t nat -nL

Chain PREROUTING (policy ACCEPT)
target     prot opt source               destination

Chain INPUT (policy ACCEPT)
target     prot opt source               destination

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination

Chain POSTROUTING (policy ACCEPT)
target     prot opt source               destination
```

### 2.3.7 Creating a virtual network card

> Creating a pair of virtual network cards at the same time.

```bash
# Create a pair of virtual network cards
ip link add veth0 type veth peer name veth1
```

```bash
# View in the physical host system
ip a s
......
10: veth1@veth0: <BROADCAST,MULTICAST,M-DOWN> mtu 1500 qdisc noop state DOWN group default qlen 1000
    link/ether de:44:f8:b7:12:65 brd ff:ff:ff:ff:ff:ff
11: veth0@veth1: <BROADCAST,MULTICAST,M-DOWN> mtu 1500 qdisc noop state DOWN group default qlen 1000
    link/ether 46:5e:89:8c:cb:b3 brd ff:ff:ff:ff:ff:ff
```

### 2.3.8 Migrating virtual network cards to a namespace

> Both network cards still belong to the "default" or "global" namespace, just like physical network cards. Move one of the network cards to the bzy namespace.

```bash
# Add the veth1 network card that was created to the bzy network namespace
ip link set veth1 netns bzy
```

```bash
# Viewing networking interfaces within the namespace in the Linux command line
ip netns exec bzy ip link
1: lo: <LOOPBACK> mtu 65536 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
10: veth1@if11: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether de:44:f8:b7:12:65 brd ff:ff:ff:ff:ff:ff link-netnsid 0
```

### 2.3.9 Migrating virtual network cards out of namespace

```bash
# Delete the veth1 virtual network card from the network namespace in the Linux system command line
ip netns exec bzy ip link delete veth1
```

```bash
# View results in the Linux system command line
ip netns exec bzy ip link
1: lo: <LOOPBACK> mtu 65536 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
```

### 2.3.10 Configuring virtual network card IP addresses

```bash
# Create virtual network cards again, add to the bzy network namespace, and set IP addresses.
ip link add veth0 type veth peer name veth1
ip link set veth1 netns bzy
ip netns exec bzy ip addr add 192.168.50.2/24 dev veth1
```

```bash
# Check network status in the Linux system command line
ip netns exec bzy ip addr
1: lo: <LOOPBACK> mtu 65536 qdisc noop state DOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
12: veth1@if13: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN group default qlen 1000
    link/ether fe:20:ac:a8:13:4c brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 192.168.50.2/24 scope global veth1
       valid_lft forever preferred_lft forever
```

```bash
# Start the virtual network card, both veth1 and lo need to be started.
ip netns exec bzy ip link set veth1 up

ip netns exec bzy ip link set lo up
```

```bash
# Add an IP address to the physical machine veth0
ip a s
......
15: veth0@if14: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN group defau
lt qlen 1000
    link/ether 2e:b4:40:c8:73:dc brd ff:ff:ff:ff:ff:ff link-netnsid 0
```

```bash
ip addr add 192.168.50.3/24 dev veth0

ip a s veth0
15: veth0@if14: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN group default qlen 1000
    link/ether 2e:b4:40:c8:73:dc brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 192.168.50.3/24 scope global veth0
       valid_lft forever preferred_lft forever
```

```bash
ip link set veth0 up
```

```bash
# Ping veth1 in bzy from the host machine
ping 192.168.50.2

PING 192.168.50.2 (192.168.50.2) 56(84) bytes of data.
64 bytes from 192.168.50.2: icmp_seq=1 ttl=64 time=0.102 ms
64 bytes from 192.168.50.2: icmp_seq=2 ttl=64 time=0.068 ms
64 bytes from 192.168.50.2: icmp_seq=3 ttl=64 time=0.068 ms
```

```bash
# Ping veth0 on the host machine from veth1 in bzy
ip netns exec bzy ping 192.168.50.3

PING 192.168.50.3 (192.168.50.3) 56(84) bytes of data.
64 bytes from 192.168.50.3: icmp_seq=1 ttl=64 time=0.053 ms
64 bytes from 192.168.50.3: icmp_seq=2 ttl=64 time=0.031 ms
64 bytes from 192.168.50.3: icmp_seq=3 ttl=64 time=0.029 ms
```

```bash
# If you need to access other networks on your computer, you can manually add the following default route entry.
ip netns exec bzy ip route add default via 192.168.50.3
```

> To be able to ping external hosts, you'll need to set up routing and forwarding.

# 3. CGroups

## 3.1 Introduction to CGroups

-   Control groups (cgroups) is a mechanism provided by the Linux kernel that allows limiting, tracking, and isolating the physical resources used by process groups. It was born for containers, and without cgroups, there would be no container technology today.

<p align="center">
<img src="https://raw.githubusercontent.com/ClarenceWhite/BlogImage/main/images/6433fb71cb5aec730fd6f479-4-10-13-56-41.jpg" id="blog-image" width="400"/>
</p>

## 3.2 Functions of CGroups

-   Resource limitation: CGroups can limit the total amount of resources used by a process group. For example, setting a limit on the amount of memory an application can use during runtime, once it exceeds this quota, an OOM (Out of Memory) is issued.
-   Priority allocation: By allocating CPU time slices and hard disk IO bandwidth sizes, it actually controls the priority of process execution.
-   Resource accounting: CGroups can be used to track resource usage in the system, such as CPU usage time, memory usage, etc., which is very suitable for billing purposes.
-   Process control: CGroups can execute operations such as suspension and recovery on process groups.

## 3.3 CGroups Application Case

### 3.3.1 Installation and Starting Services

```bash
[root@localhost ~]# yum -y install libcgroup
[root@localhost ~]# systemctl start cgconfig.service
[root@localhost ~]# systemctl enable cgconfig.service
```

### 3.3.2 Limiting Process CPU Usage

#### 3.3.2.1 View CPU shares

```bash
View resource control subsystems
[root@localhost ~]# lssubsys
cpuset
cpu,cpuacct
memory
devices
freezer
net_cls,net_prio
blkio
perf_event
hugetlb
pids

View the location of the subsystem configuration files
[root@localhost ~]# ls /sys/fs/cgroup/
blkio  cpuacct      cpuset   freezer  memory   net_cls,net_prio  perf_event  systemd
cpu    cpu,cpuacct  devices  hugetlb  net_cls  net_prio          pids
[root@localhost ~]# ls /sys/fs/cgroup/cpu
cgroup.clone_children  cpuacct.stat          cpu.cfs_quota_us   cpu.stat
cgroup.event_control   cpuacct.usage         cpu.rt_period_us   notify_on_release
cgroup.procs           cpuacct.usage_percpu  cpu.rt_runtime_us  release_agent
cgroup.sane_behavior   cpu.cfs_period_us     cpu.shares         tasks

View CPU time slices to ensure the total amount of CPU slices obtained by the group.
[root@localhost ~]# cat /sys/fs/cgroup/cpu/cpu.shares
1024
```

#### 3.3.2.2 Create 2 groups using the CPU subsystem

```bash
[root@localhost ~]# vim /etc/cgconfig.conf
group lesscpu {
	cpu{
		cpu.shares=200;
	}
}
group morecpu {
	cpu{
		cpu.shares=800;
	}
}

[root@localhost ~]# systemctl restart cgconfig
```

Prepare a script

```bash
#!/bin/bash

a=1
while true
do

        a=$[$a+1]
done

```

Assign the application that will be run to the specified group (**Please use a single-CPU machine and verify with three terminals**)

```bash
Terminal 1# cgexec -g cpu:lesscpu sh /tmp/1.sh

Terminal 2# cgexec -g cpu:morecpu sh /tmp/1.sh

Terminal 3# top
```

**PS: If the host has multiple CPUs, for verification purposes, you can perform the following operation**

```bash
# lscpu
# echo 0 > /sys/devices/system/cpu/cpu0/online
# echo 1 > /sys/devices/system/cpu/cpu1/online
```
