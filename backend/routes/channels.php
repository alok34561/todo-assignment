<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('tasks', function ($user) {
    return true; // Allow all authenticated users to listen to tasks channel
});