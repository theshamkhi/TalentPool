<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\AppController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::apiResource('offers', OfferController::class);


Route::post('/offer/{offerID}/apply', [AppController::class, 'apply'])->middleware('auth:sanctum');

Route::delete('/applications/{appID}/withdraw', [AppController::class, 'withdraw'])->middleware('auth:sanctum');

Route::get('/recruiter/applications', [AppController::class, 'getApps'])->middleware('auth:sanctum');//->(recruiter)

Route::put('/applications/{appID}/updateStatus', [AppController::class, 'updateAppStatus'])->middleware('auth:sanctum');