<?php

Route::view('{path}', 'index')->where('path', '(.*)');
