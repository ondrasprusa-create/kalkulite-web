<?php

use Illuminate\Support\Facades\Route;

// SEO: dynamická sitemapa a robots.txt (absolutní URL z APP_URL, mimo produkci zákaz indexace)
Route::statamic('sitemap.xml', 'seo/sitemap', ['layout' => null, 'content_type' => 'xml']);
Route::statamic('robots.txt', 'seo/robots', ['layout' => null, 'content_type' => 'text']);
