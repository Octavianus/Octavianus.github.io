---
layout: page
title: Topic About
tagline: -- Technology & Thought 
---
{% include JB/setup %}

2013:

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
{{ post.content | strip_html | truncate:110}}
<a href="{{ post.url }}">Read more</a>
{% endfor %}
</ul>
<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
