<?php

// Тесты гоняются из установленного форума: его vendor/autoload.php знает Flarum, fof/oauth и это расширение.
$forum = getenv('FLARUM_PATH') ?: '/var/www/www-root/data/www/proektmap-forum';

require $forum.'/vendor/autoload.php';
