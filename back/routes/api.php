<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\AppController;


Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('offers', OfferController::class)->except(['create', 'edit']);

    Route::post('/offers/{offer}/apply', [AppController::class, 'apply']);
    
    Route::delete('/applications/{app}/withdraw', [AppController::class, 'withdraw']);
    Route::put('/applications/{app}/updateStatus', [AppController::class, 'updateAppStatus']);

    Route::get('/candidate/applications', [AppController::class, 'getCandidateApps']);

    Route::get('/recruiter/applications', [AppController::class, 'getRecruiterApps']);
    Route::get('/recruiter/statistics', [AppController::class, 'getRecruiterStats']);
});