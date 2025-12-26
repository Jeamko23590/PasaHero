<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Student;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EnrollmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Enrollment::with(['student', 'course']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        $enrollments = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($enrollments);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'course_id' => 'required|exists:courses,id',
            'amount_paid' => 'required|numeric|min:0',
        ]);

        $course = Course::findOrFail($validated['course_id']);
        $student = Student::findOrFail($validated['student_id']);

        // Check if student already has active enrollment
        if ($student->activeEnrollment) {
            return response()->json([
                'message' => 'Student already has an active enrollment'
            ], 422);
        }

        $enrollment = Enrollment::create([
            'enrollment_number' => Enrollment::generateEnrollmentNumber(),
            'student_id' => $validated['student_id'],
            'course_id' => $validated['course_id'],
            'enrollment_date' => now(),
            'expiry_date' => now()->addDays($course->validity_days),
            'status' => 'active',
            'amount_paid' => $validated['amount_paid'],
            'balance' => $course->price - $validated['amount_paid'],
            'payment_status' => $validated['amount_paid'] >= $course->price ? 'paid' : 
                               ($validated['amount_paid'] > 0 ? 'partial' : 'pending'),
        ]);

        $student->update(['status' => 'enrolled']);

        return response()->json([
            'message' => 'Enrollment created successfully',
            'data' => $enrollment->load(['student', 'course'])
        ], 201);
    }

    public function show(Enrollment $enrollment): JsonResponse
    {
        $enrollment->load(['student', 'course', 'schedules.instructor', 'certificates']);
        return response()->json($enrollment);
    }

    public function addPayment(Request $request, Enrollment $enrollment): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
        ]);

        $newAmountPaid = $enrollment->amount_paid + $validated['amount'];
        $newBalance = $enrollment->course->price - $newAmountPaid;

        $enrollment->update([
            'amount_paid' => $newAmountPaid,
            'balance' => max(0, $newBalance),
            'payment_status' => $newBalance <= 0 ? 'paid' : 'partial',
        ]);

        return response()->json([
            'message' => 'Payment recorded successfully',
            'data' => $enrollment
        ]);
    }

    public function updateProgress(Request $request, Enrollment $enrollment): JsonResponse
    {
        $validated = $request->validate([
            'theory_hours' => 'nullable|integer|min:0',
            'practical_hours' => 'nullable|integer|min:0',
            'vr_hours' => 'nullable|integer|min:0',
        ]);

        $enrollment->update([
            'theory_hours_completed' => $validated['theory_hours'] ?? $enrollment->theory_hours_completed,
            'practical_hours_completed' => $validated['practical_hours'] ?? $enrollment->practical_hours_completed,
            'vr_hours_completed' => $validated['vr_hours'] ?? $enrollment->vr_hours_completed,
        ]);

        // Check if course is completed
        $course = $enrollment->course;
        if ($enrollment->theory_hours_completed >= $course->theory_hours &&
            $enrollment->practical_hours_completed >= $course->practical_hours &&
            $enrollment->vr_hours_completed >= $course->vr_simulation_hours) {
            $enrollment->update(['status' => 'completed']);
            $enrollment->student->update(['status' => 'completed']);
        }

        return response()->json([
            'message' => 'Progress updated successfully',
            'data' => $enrollment
        ]);
    }
}
