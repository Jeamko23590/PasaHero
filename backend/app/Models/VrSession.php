<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VrSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'schedule_id', 'scenario_id', 'scenario_name', 'difficulty',
        'duration_minutes', 'performance_metrics', 'score', 'passed',
        'incidents', 'ai_feedback'
    ];

    protected $casts = [
        'performance_metrics' => 'array',
        'incidents' => 'array',
        'passed' => 'boolean',
    ];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    public static function getScenarios(): array
    {
        return [
            ['id' => 'city_basic', 'name' => 'City Driving - Basic', 'difficulty' => 'beginner'],
            ['id' => 'city_traffic', 'name' => 'City Driving - Heavy Traffic', 'difficulty' => 'intermediate'],
            ['id' => 'highway', 'name' => 'Highway Driving', 'difficulty' => 'intermediate'],
            ['id' => 'night_driving', 'name' => 'Night Driving', 'difficulty' => 'intermediate'],
            ['id' => 'rain_conditions', 'name' => 'Rainy Conditions', 'difficulty' => 'advanced'],
            ['id' => 'emergency', 'name' => 'Emergency Situations', 'difficulty' => 'advanced'],
            ['id' => 'parking', 'name' => 'Parking Scenarios', 'difficulty' => 'beginner'],
            ['id' => 'mountain', 'name' => 'Mountain Roads', 'difficulty' => 'advanced'],
        ];
    }
}
