<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Instructor extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_id', 'first_name', 'last_name', 'email', 'phone',
        'license_number', 'license_expiry', 'specializations', 'status',
        'hourly_rate', 'max_daily_hours'
    ];

    protected $casts = [
        'license_expiry' => 'date',
        'specializations' => 'array',
        'hourly_rate' => 'decimal:2',
    ];

    protected $appends = ['full_name', 'is_vr_certified'];

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getIsVrCertifiedAttribute(): bool
    {
        return in_array('vr_certified', $this->specializations ?? []);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function getAvailableSlots($date)
    {
        $bookedSlots = $this->schedules()
            ->where('scheduled_date', $date)
            ->whereNotIn('status', ['cancelled'])
            ->get(['start_time', 'end_time']);

        return $bookedSlots;
    }
}
