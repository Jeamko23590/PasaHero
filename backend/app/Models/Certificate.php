<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'certificate_number', 'enrollment_id', 'issue_date', 'expiry_date',
        'type', 'qr_code', 'verification_url', 'is_valid'
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'is_valid' => 'boolean',
    ];

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }

    public static function generateCertificateNumber($type): string
    {
        $prefix = match($type) {
            'completion' => 'CERT',
            'theory_exam' => 'THE',
            'practical_exam' => 'PRA',
            'lto_ready' => 'LTO',
            default => 'CERT'
        };
        $year = date('Y');
        $count = self::whereYear('created_at', $year)->where('type', $type)->count() + 1;
        return "{$prefix}-{$year}-" . str_pad($count, 6, '0', STR_PAD_LEFT);
    }
}
