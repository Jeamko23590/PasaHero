<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Instructor;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ScheduleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Schedule::with(['enrollment.student', 'instructor', 'vehicle']);

        if ($request->has('date')) {
            $query->where('scheduled_date', $request->date);
        }

        if ($request->has('instructor_id')) {
            $query->where('instructor_id', $request->instructor_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('session_type')) {
            $query->where('session_type', $request->session_type);
        }

        $schedules = $query->orderBy('scheduled_date')->orderBy('start_time')->paginate(20);

        return response()->json($schedules);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'enrollment_id' => 'required|exists:enrollments,id',
            'instructor_id' => 'required|exists:instructors,id',
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'session_type' => 'required|in:theory,practical,vr_simulation,exam',
            'scheduled_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'notes' => 'nullable|string',
        ]);

        // Check instructor availability
        $conflict = Schedule::where('instructor_id', $validated['instructor_id'])
            ->where('scheduled_date', $validated['scheduled_date'])
            ->whereNotIn('status', ['cancelled'])
            ->where(function($q) use ($validated) {
                $q->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                  ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']]);
            })->exists();

        if ($conflict) {
            return response()->json([
                'message' => 'Instructor is not available at this time'
            ], 422);
        }

        // Check vehicle availability for practical sessions
        if ($validated['vehicle_id'] && in_array($validated['session_type'], ['practical', 'exam'])) {
            $vehicleConflict = Schedule::where('vehicle_id', $validated['vehicle_id'])
                ->where('scheduled_date', $validated['scheduled_date'])
                ->whereNotIn('status', ['cancelled'])
                ->where(function($q) use ($validated) {
                    $q->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                      ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']]);
                })->exists();

            if ($vehicleConflict) {
                return response()->json([
                    'message' => 'Vehicle is not available at this time'
                ], 422);
            }
        }

        $schedule = Schedule::create($validated);

        return response()->json([
            'message' => 'Schedule created successfully',
            'data' => $schedule->load(['enrollment.student', 'instructor', 'vehicle'])
        ], 201);
    }

    public function show(Schedule $schedule): JsonResponse
    {
        $schedule->load(['enrollment.student', 'enrollment.course', 'instructor', 'vehicle', 'vrSession']);
        return response()->json($schedule);
    }

    public function update(Request $request, Schedule $schedule): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'in:scheduled,confirmed,in_progress,completed,cancelled,no_show',
            'rating' => 'nullable|integer|min:1|max:5',
            'feedback' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $schedule->update($validated);

        // Update enrollment progress if completed
        if ($validated['status'] === 'completed') {
            $enrollment = $schedule->enrollment;
            $hours = $schedule->duration_hours;

            switch ($schedule->session_type) {
                case 'theory':
                    $enrollment->increment('theory_hours_completed', $hours);
                    break;
                case 'practical':
                case 'exam':
                    $enrollment->increment('practical_hours_completed', $hours);
                    break;
                case 'vr_simulation':
                    $enrollment->increment('vr_hours_completed', $hours);
                    break;
            }
        }

        return response()->json([
            'message' => 'Schedule updated successfully',
            'data' => $schedule
        ]);
    }

    public function getAvailableSlots(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'instructor_id' => 'nullable|exists:instructors,id',
            'session_type' => 'required|in:theory,practical,vr_simulation,exam',
        ]);

        $instructors = $validated['instructor_id'] 
            ? Instructor::where('id', $validated['instructor_id'])->get()
            : Instructor::where('status', 'active')->get();

        $slots = [];
        $timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

        foreach ($instructors as $instructor) {
            $bookedTimes = Schedule::where('instructor_id', $instructor->id)
                ->where('scheduled_date', $validated['date'])
                ->whereNotIn('status', ['cancelled'])
                ->pluck('start_time')
                ->map(fn($t) => substr($t, 0, 5))
                ->toArray();

            $available = array_diff($timeSlots, $bookedTimes);

            if (count($available) > 0) {
                $slots[] = [
                    'instructor' => $instructor,
                    'available_times' => array_values($available)
                ];
            }
        }

        return response()->json($slots);
    }

    public function mySchedules(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user->student_id) {
            return response()->json([]);
        }

        $schedules = Schedule::with(['instructor', 'vehicle'])
            ->whereHas('enrollment', fn($q) => $q->where('student_id', $user->student_id))
            ->orderBy('scheduled_date', 'desc')
            ->orderBy('start_time')
            ->paginate(20);

        return response()->json($schedules);
    }

    public function instructorSchedules(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user->instructor_id) {
            return response()->json([]);
        }

        $query = Schedule::with(['enrollment.student', 'vehicle'])
            ->where('instructor_id', $user->instructor_id);

        if ($request->has('date')) {
            $query->where('scheduled_date', $request->date);
        }

        if ($request->has('from') && $request->has('to')) {
            $query->whereBetween('scheduled_date', [$request->from, $request->to]);
        }

        $schedules = $query->orderBy('scheduled_date')
            ->orderBy('start_time')
            ->paginate(20);

        return response()->json($schedules);
    }
}
