<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id', 'first_name', 'last_name', 'email', 'phone',
        'birth_date', 'address', 'license_type', 'status',
        'emergency_contact_name', 'emergency_contact_phone', 'medical_conditions'
    ];

    protected $casts = [
        'birth_date' => 'date',
        'medical_conditions' => 'array',
    ];

    protected $appends = ['full_name', 'age'];

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getAgeAttribute(): int
    {
        return $this->birth_date->age;
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function activeEnrollment()
    {
        return $this->hasOne(Enrollment::class)->where('status', 'active');
    }

    public static function generateStudentId(): string
    {
        $year = date('Y');
        $count = self::whereYear('created_at', $year)->count() + 1;
        return "STU-{$year}-" . str_pad($count, 5, '0', STR_PAD_LEFT);
    }
}
