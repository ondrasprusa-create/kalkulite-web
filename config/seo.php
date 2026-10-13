<?php

return [

    /*
    | Povolit indexaci vyhledávači (meta robots + robots.txt).
    | Statický web se generuje lokálně, proto se nespoléháme na APP_ENV,
    | ale na samostatný přepínač. Na produkčním buildu nastav SEO_ALLOW_INDEXING=true.
    */
    'allow_indexing' => (bool) env('SEO_ALLOW_INDEXING', env('APP_ENV') === 'production'),

];
