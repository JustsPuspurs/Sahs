<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    
    <!-- CSRF Token Meta Tag -->
    <meta name="csrf-token" content="{{ csrf_token() }}"> <!-- Include this line for CSRF protection -->
    <title>Tiešsaistes Šahs</title>
    @viteReactRefresh
    @vite('resources/js/app.jsx') <!-- Include your React app -->
    @inertiaHead
  </head>
  <body>
    @inertia
  </body>
</html>
