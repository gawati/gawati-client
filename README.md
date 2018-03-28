This is a desktop Client for managing Gawati data. 

Needs Apache conf entries: 

```
# for gawati-client-data
<Location ~ "/gwdc/(.*)">
  AddType text/cache-manifest .appcache
  ProxyPassMatch  "http://localhost:8080/exist/restxq/gwdc/$1"
  ProxyPassReverse "http://localhost:8080/exist/restxq/gwdc/$1"
  SetEnv force-proxy-request-1.0 1
  SetEnv proxy-nokeepalive 1
</Location>

# for gawati-client-server
<Location ~ "/gwc/(.*)">
  AddType text/cache-manifest .appcache
  ProxyPassMatch  "http://localhost:9002/gwc/$1"
  ProxyPassReverse "http://localhost:9002/gwc/$1"
  SetEnv force-proxy-request-1.0 1
  SetEnv proxy-nokeepalive 1
</Location>

```

You will also need to set CORS headers :

```
    ### CORS BEGIN    
    # Always set these headers.
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "POST, GET, OPTIONS, DELETE, PUT"
    Header always set Access-Control-Max-Age "1000"
    Header always set Access-Control-Allow-Headers "x-requested-with, Content-Type, origin, authorization, accept, client-security-token"
     
    # Added a rewrite to respond with a 200 SUCCESS on every OPTIONS request.
    RewriteEngine On
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=200,L]
    ### CORS END

```

