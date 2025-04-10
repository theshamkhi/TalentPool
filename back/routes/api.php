<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\AppController;

// A U T H
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
// Route::post('/forgot-password', [AuthController::class, 'sendReset']);
// Route::post('/reset-password', [AuthController::class, 'passReset']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
// O F F E R S
    Route::apiResource('offers', OfferController::class);
// A P P L Y  &  W I T H D R A W
    Route::post('/offer/{offerID}/apply', [AppController::class, 'apply']);
    Route::delete('/applications/{appID}/withdraw', [AppController::class, 'withdraw']);
// R E C R U I T E R
    Route::get('/recruiter/applications', [AppController::class, 'getApps']);
    Route::get('/recruiter/statistics', [AppController::class, 'getRecruiterStats']);
    Route::put('/applications/{appID}/updateStatus', [AppController::class, 'updateAppStatus']);
});