<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['middleware' => ['auth:api']], function() {
    Route::resource('roles', RoleController::class);
    Route::resource('users', UserController::class);
    Route::resource('products', ProductController::class);

    Route::post('product-store', [ProductController::class, 'store'])->name('product-store');
    Route::post('product-delete', [ProductController::class, 'destroy'])->name('product-delete');
    Route::post('product-update', [ProductController::class, 'update'])->name('product-update');
    
    Route::get('authUser', [LoginController::class, 'authUser'])->name('authUser');
    
    Route::post('logout', [LoginController::class, 'logout'])->name('logout');
});
Route::post('login', [LoginController::class, 'authenticate'])->name('login');
Route::post('register', [RegisterController::class, 'create'])->name('register');
