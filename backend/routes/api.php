<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\VrSessionController;

// Auth Routes
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
});

// Dashboard
Route::get('/dashboard', [DashboardController::class, 'index']);

// Students
Route::apiResource('students', StudentController::class);

// Enrollments
Route::apiResource('enrollments', EnrollmentController::class)->except(['update', 'destroy']);
Route::post('/enrollments/{enrollment}/payment', [EnrollmentController::class, 'addPayment']);
Route::patch('/enrollments/{enrollment}/progress', [EnrollmentController::class, 'updateProgress']);

// Schedules
Route::apiResource('schedules', ScheduleController::class);
Route::get('/available-slots', [ScheduleController::class, 'getAvailableSlots']);

// VR Sessions
Route::get('/vr/scenarios', [VrSessionController::class, 'scenarios']);
Route::post('/vr/sessions', [VrSessionController::class, 'store']);
Route::get('/vr/sessions/{vrSession}', [VrSessionController::class, 'show']);
Route::get('/vr/student/{studentId}/history', [VrSessionController::class, 'studentHistory']);

// Courses (simple listing)
Route::get('/courses', function() {
    return \App\Models\Course::active()->get();
});

// Instructors (simple listing)
Route::get('/instructors', function() {
    return \App\Models\Instructor::where('status', 'active')->get();
});

// Vehicles (simple listing)
Route::get('/vehicles', function() {
    return \App\Models\Vehicle::available()->get();
});


// Student Portal Routes
Route::prefix('student')->middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'studentDashboard']);
    Route::get('/schedules', [ScheduleController::class, 'mySchedules']);
    Route::get('/progress', [EnrollmentController::class, 'myProgress']);
    Route::get('/certificates', function () {
        $user = request()->user();
        if (!$user->student_id) return response()->json([]);
        return \App\Models\Certificate::whereHas('enrollment', fn($q) => 
            $q->where('student_id', $user->student_id)
        )->get();
    });
});

// Instructor Portal Routes
Route::prefix('instructor')->middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'instructorDashboard']);
    Route::get('/schedules', [ScheduleController::class, 'instructorSchedules']);
    Route::get('/students', [StudentController::class, 'instructorStudents']);
});