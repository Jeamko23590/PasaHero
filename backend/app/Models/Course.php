<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'name', 'description', 'license_type',
        'theory_hours', 'practical_hours', 'vr_simulation_hours',
        'price', 'validity_days', 'is_active', 'requirements'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'requirements' => 'array',
    ];

    protected $appends = ['total_hours'];

    public function getTotalHoursAttribute(): int
    {
        return $this->theory_hours + $this->practical_hours + $this->vr_simulation_hours;
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
