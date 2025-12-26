<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class StudentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Student::with('activeEnrollment.course');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('student_id', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('license_type')) {
            $query->where('license_type', $request->license_type);
        }

        $students = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($students);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:students',
            'phone' => 'required|string|max:20',
            'birth_date' => 'required|date|before:-18 years',
            'address' => 'required|string',
            'license_type' => 'required|in:non-pro,professional,motorcycle',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'medical_conditions' => 'nullable|array',
        ]);

        $validated['student_id'] = Student::generateStudentId();
        $validated['status'] = 'pending';

        $student = Student::create($validated);

        return response()->json([
            'message' => 'Student registered successfully',
            'data' => $student
        ], 201);
    }

    public function show(Student $student): JsonResponse
    {
        $student->load(['enrollments.course', 'enrollments.schedules', 'enrollments.certificates']);
        return response()->json($student);
    }

    public function update(Request $request, Student $student): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'email' => 'email|unique:students,email,' . $student->id,
            'phone' => 'string|max:20',
            'address' => 'string',
            'status' => 'in:pending,enrolled,in_progress,completed,dropped',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
        ]);

        $student->update($validated);

        return response()->json([
            'message' => 'Student updated successfully',
            'data' => $student
        ]);
    }

    public function destroy(Student $student): JsonResponse
    {
        $student->delete();
        return response()->json(['message' => 'Student deleted successfully']);
    }
}
