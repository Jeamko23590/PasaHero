<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'plate_number', 'make', 'model', 'year', 'transmission', 'type',
        'status', 'registration_expiry', 'insurance_expiry',
        'last_maintenance', 'next_maintenance', 'mileage'
    ];

    protected $casts = [
        'registration_expiry' => 'date',
        'insurance_expiry' => 'date',
        'last_maintenance' => 'date',
        'next_maintenance' => 'date',
    ];

    protected $appends = ['display_name', 'needs_maintenance'];

    public function getDisplayNameAttribute(): string
    {
        return "{$this->make} {$this->model} ({$this->plate_number})";
    }

    public function getNeedsMaintenanceAttribute(): bool
    {
        return $this->next_maintenance && $this->next_maintenance->lte(now()->addDays(7));
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }
}
