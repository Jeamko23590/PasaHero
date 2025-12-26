<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VrSession;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class VrSessionController extends Controller
{
    public function scenarios(): JsonResponse
    {
        return response()->json(VrSession::getScenarios());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'schedule_id' => 'required|exists:schedules,id',
            'scenario_id' => 'required|string',
            'scenario_name' => 'required|string',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'duration_minutes' => 'required|integer|min:1',
            'performance_metrics' => 'required|array',
            'score' => 'nullable|integer|min:0|max:100',
            'incidents' => 'nullable|array',
        ]);

        $validated['passed'] = ($validated['score'] ?? 0) >= 70;
        $validated['ai_feedback'] = $this->generateAiFeedback($validated);

        $vrSession = VrSession::create($validated);

        // Update schedule status
        Schedule::find($validated['schedule_id'])->update(['status' => 'completed']);

        return response()->json([
            'message' => 'VR session recorded successfully',
            'data' => $vrSession
        ], 201);
    }

    public function show(VrSession $vrSession): JsonResponse
    {
        $vrSession->load('schedule.enrollment.student');
        return response()->json($vrSession);
    }

    public function studentHistory(int $studentId): JsonResponse
    {
        $sessions = VrSession::whereHas('schedule.enrollment', function($q) use ($studentId) {
            $q->where('student_id', $studentId);
        })->with('schedule')->orderBy('created_at', 'desc')->get();

        $stats = [
            'total_sessions' => $sessions->count(),
            'average_score' => round($sessions->avg('score'), 1),
            'pass_rate' => $sessions->count() > 0 
                ? round(($sessions->where('passed', true)->count() / $sessions->count()) * 100, 1) 
                : 0,
            'total_time' => $sessions->sum('duration_minutes'),
        ];

        return response()->json([
            'sessions' => $sessions,
            'stats' => $stats
        ]);
    }

    private function generateAiFeedback(array $data): string
    {
        $metrics = $data['performance_metrics'];
        $feedback = [];

        if (isset($metrics['reaction_time']) && $metrics['reaction_time'] > 2) {
            $feedback[] = "Work on improving reaction time to hazards.";
        }
        if (isset($metrics['lane_discipline']) && $metrics['lane_discipline'] < 80) {
            $feedback[] = "Focus on maintaining proper lane position.";
        }
        if (isset($metrics['speed_control']) && $metrics['speed_control'] < 80) {
            $feedback[] = "Practice maintaining consistent and appropriate speed.";
        }
        if (isset($data['incidents']) && count($data['incidents']) > 0) {
            $feedback[] = "Review traffic rules to avoid violations.";
        }

        if (empty($feedback)) {
            $feedback[] = "Excellent performance! Ready for more advanced scenarios.";
        }

        return implode(" ", $feedback);
    }
}
