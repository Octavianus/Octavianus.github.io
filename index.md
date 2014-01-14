---
layout: page
title: Topic About
tagline: -- Technology & Thought 
---
{% include JB/setup %}

2013-2014:

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string}}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
{{ post.content | strip_html | truncate:100}}
<a href="{{ post.url }}">Read more</a>
{% endfor %}
</ul>

Before:

<ul class="posts">
    <li><span>Before 2013</span> &raquo; <a href = "http://blog.csdn.net/wxdsdtc831">All My Technical Blog in or before 2013 in CSDN</a></li>
</ul>
<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
