<?php
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Inertia::render("App");
});
Route::get("/game1", function(){
    return Inertia::render("Game1");
});