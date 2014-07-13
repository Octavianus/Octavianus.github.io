---
layout: post
category : Technology
tagline: ""
tags : [Technology]
---
{% include JB/setup %}

Dockerize applications:
----

__To do in the future for docker:__

Forrester analyst Charlie Dai has noted that as remarkable as Docker is, It still has a long way to go. It must enable complex enterprise applications in the cloud, much as VMware vApp simplifies the deployment of multitier applications; have more user-friendly graphical user interfaces for easy management; and provide more debugging and tracing features. One of the potential attractions of CoreOS, then, is how it might offer many of those very features in the form of a Linux stack.

__Provide a mount point to the container file system.__
Presume we want to run a python script test.py on local file system ~/script.
docker run -t -i -v /home/vagrant/mp:/home/vagrant/script 6eb7977eea28 python ~/script/test.py

Mount point and the interactive feature in the docker container. Also you can expose your container to the network by assigning a port. Use json to store the info. Figure about how to work with other open source technology such as condor and irods.

__About the duplication of resources:__
There is some duplication of resources across containers, but the benefits see,m to outweigh the overlapping resource usage,  duplication also allows us to haveapplications with conflicting dependencies running on the same box, and even allow them to work on the same dataset.



