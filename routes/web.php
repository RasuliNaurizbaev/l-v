<?php
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;


Route::get("/register", function(){
    return Inertia::render("Register");
});
Route::get("/login", function(){
    return Inertia::render("Login");
});

Route::get('/', function () {
    return Inertia::render("App");
});
Route::get("/game1", function(){
    return Inertia::render("Game1");
});
Route::get("/game2", function(){
    return Inertia::render("Game2");
});
Route::get("/game3", function(){
    return Inertia::render("Game3");
});
Route::get("/settings", function(){
    return Inertia::render("Settings");
});

Route::get("/test", function(){
    return Inertia::render("Test");
});