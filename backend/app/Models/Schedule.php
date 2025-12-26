<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'enrollment_id', 'instructor_id', 'vehicle_id', 'session_type',
        'scheduled_date', 'start_time', 'end_time', 'status',
        'notes', 'rating', 'feedback'
    ];

    protected $casts = [
        'scheduled_date' => 'date',
    ];

    protected $appends = ['duration_hours'];

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function vrSession()
    {
        return $this->hasOne(VrSession::class);
    }

    public function getDurationHoursAttribute(): float
    {
        $start = \Carbon\Carbon::parse($this->start_time);
        $end = \Carbon\Carbon::parse($this->end_time);
        return $start->diffInMinutes($end) / 60;
    }

    public function scopeUpcoming($query)
    {
        return $query->where('scheduled_date', '>=', now()->toDateString())
                     ->whereIn('status', ['scheduled', 'confirmed']);
    }

    public function scopeToday($query)
    {
        return $query->where('scheduled_date', now()->toDateString());
    }
}
