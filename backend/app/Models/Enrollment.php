<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'enrollment_number', 'student_id', 'course_id', 'enrollment_date',
        'expiry_date', 'status', 'amount_paid', 'balance', 'payment_status',
        'theory_hours_completed', 'practical_hours_completed', 'vr_hours_completed'
    ];

    protected $casts = [
        'enrollment_date' => 'date',
        'expiry_date' => 'date',
        'amount_paid' => 'decimal:2',
        'balance' => 'decimal:2',
    ];

    protected $appends = ['progress_percentage', 'is_expired'];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class);
    }

    public function getProgressPercentageAttribute(): float
    {
        $course = $this->course;
        if (!$course) return 0;

        $totalRequired = $course->theory_hours + $course->practical_hours + $course->vr_simulation_hours;
        $totalCompleted = $this->theory_hours_completed + $this->practical_hours_completed + $this->vr_hours_completed;

        return $totalRequired > 0 ? round(($totalCompleted / $totalRequired) * 100, 1) : 0;
    }

    public function getIsExpiredAttribute(): bool
    {
        return $this->expiry_date->isPast();
    }

    public static function generateEnrollmentNumber(): string
    {
        $year = date('Y');
        $month = date('m');
        $count = self::whereYear('created_at', $year)->whereMonth('created_at', $month)->count() + 1;
        return "ENR-{$year}{$month}-" . str_pad($count, 4, '0', STR_PAD_LEFT);
    }
}
