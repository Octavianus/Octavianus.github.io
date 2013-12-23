---
layout: page
title: Topic about
tagline: technology thought target
---
{% include JB/setup %}

2013:

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
