<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Enrollment;
use App\Models\Schedule;
use App\Models\Instructor;
use App\Models\Vehicle;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();

        return response()->json([
            'stats' => [
                'total_students' => Student::count(),
                'active_enrollments' => Enrollment::where('status', 'active')->count(),
                'todays_sessions' => Schedule::where('scheduled_date', $today)->count(),
                'monthly_revenue' => Enrollment::where('created_at', '>=', $thisMonth)->sum('amount_paid'),
                'pending_payments' => Enrollment::where('payment_status', '!=', 'paid')->sum('balance'),
                'active_instructors' => Instructor::where('status', 'active')->count(),
                'available_vehicles' => Vehicle::where('status', 'available')->count(),
                'certificates_issued' => Certificate::whereMonth('created_at', $today->month)->count(),
            ],
            'todays_schedule' => Schedule::with(['enrollment.student', 'instructor'])
                ->where('scheduled_date', $today)
                ->orderBy('start_time')
                ->limit(10)
                ->get(),
            'recent_enrollments' => Enrollment::with(['student', 'course'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(),
            'enrollment_trend' => $this->getEnrollmentTrend(),
            'session_distribution' => $this->getSessionDistribution(),
        ]);
    }

    private function getEnrollmentTrend(): array
    {
        $data = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $data[] = [
                'month' => $month->format('M Y'),
                'count' => Enrollment::whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->count()
            ];
        }
        return $data;
    }

    private function getSessionDistribution(): array
    {
        return [
            'theory' => Schedule::where('session_type', 'theory')->count(),
            'practical' => Schedule::where('session_type', 'practical')->count(),
            'vr_simulation' => Schedule::where('session_type', 'vr_simulation')->count(),
            'exam' => Schedule::where('session_type', 'exam')->count(),
        ];
    }

    public function studentDashboard(): JsonResponse
    {
        $user = request()->user();
        if (!$user->student_id) {
            return response()->json(['error' => 'No student profile linked'], 403);
        }

        $enrollment = Enrollment::with('course')
            ->where('student_id', $user->student_id)
            ->where('status', 'active')
            ->first();

        $upcomingSchedules = Schedule::with('instructor')
            ->whereHas('enrollment', fn($q) => $q->where('student_id', $user->student_id))
            ->where('scheduled_date', '>=', Carbon::today())
            ->whereIn('status', ['scheduled', 'confirmed'])
            ->orderBy('scheduled_date')
            ->orderBy('start_time')
            ->limit(5)
            ->get();

        $completedSessions = Schedule::whereHas('enrollment', fn($q) => 
            $q->where('student_id', $user->student_id)
        )->where('status', 'completed')->count();

        $certificates = Certificate::whereHas('enrollment', fn($q) => 
            $q->where('student_id', $user->student_id)
        )->count();

        return response()->json([
            'enrollment' => $enrollment,
            'upcoming_schedules' => $upcomingSchedules,
            'stats' => [
                'completed_sessions' => $completedSessions,
                'certificates_earned' => $certificates,
                'progress' => $enrollment?->progress_percentage ?? 0,
            ]
        ]);
    }

    public function instructorDashboard(): JsonResponse
    {
        $user = request()->user();
        if (!$user->instructor_id) {
            return response()->json(['error' => 'No instructor profile linked'], 403);
        }

        $today = Carbon::today();

        $todaySchedules = Schedule::with(['enrollment.student'])
            ->where('instructor_id', $user->instructor_id)
            ->where('scheduled_date', $today)
            ->orderBy('start_time')
            ->get();

        $weekSchedules = Schedule::where('instructor_id', $user->instructor_id)
            ->whereBetween('scheduled_date', [$today, $today->copy()->addDays(7)])
            ->count();

        $totalStudents = Schedule::where('instructor_id', $user->instructor_id)
            ->distinct('enrollment_id')
            ->count('enrollment_id');

        $completedThisMonth = Schedule::where('instructor_id', $user->instructor_id)
            ->where('status', 'completed')
            ->whereMonth('scheduled_date', $today->month)
            ->count();

        return response()->json([
            'today_schedules' => $todaySchedules,
            'stats' => [
                'today_sessions' => $todaySchedules->count(),
                'week_sessions' => $weekSchedules,
                'total_students' => $totalStudents,
                'completed_this_month' => $completedThisMonth,
            ]
        ]);
    }
}
